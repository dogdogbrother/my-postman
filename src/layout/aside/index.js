/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Icon, Modal } from 'antd';

import http from '../../api'
import { getParentNode, returnFindById, returnExcludeById } from '../../tool/returnFn'
import { helperFindByAttributeAndAssign, helperFindByValueAndAssign, helperFindByIdAndRemove } from '../../tool/helpers'
import { CustomAside, CustomTabs, AddCollection, CollectionList, FolderAndRequest } from './style'
import { addRequestInfoByAside } from '../../store/request'

import FormCreateCollection from '../../components/project/create-collection'
import FormCreateFolder from '../../components/project/create-folder'
import FormEditFolder from '../../components/project/edit-collection'
import FormCreateRequest from '../../components/project/create-request'
import FormEditRequest from '../../components/project/edit-request'

const { remote } = window.require('electron')
const { Search } = Input;
const { Menu, MenuItem } = remote
const { confirm } = Modal;

const Aside = (props) => {

  const [ projectInfo, setProjectInfo ] = useState({name: '', describe:''}) // 左上角的项目信息
  const [ tabIndex, setTabIndex ] = useState(1) //  用于历史还是列表的tab切换
  // 关于列表中的status属性我得单独说明一下，本身是没有的，但是如果你让他点击过了他就有了
  const [ collectionList, setCollectionList ] = useState([]) 
  const [ addCollectionModal, setAddCollectionModal ] = useState(false);  //  控制添加集合的对话框的变量
  const [ addFolderModal, setAddFolderModal ] = useState(false);  //  控制添加文件夹的对话框的变量
  const [ editCollectionOrFolderModal, setEditCollectionOrFolderModal ] = useState(false);  //  控制编辑集合的对话框的变量
  const [ addRequestModal, setAddRequestModal ] = useState(false);  //  控制添加接口的对话框的变量
  const [ editRequestModal, setEditRequestModal ] = useState(false);  //  控制编辑接口的对话框的变量
  const [ casuallyProps, setCasuallyProps ] = useState(null) // 用一个临时变量，就是当你右键操作的时候，这个值就被赋上了，本身是什么无所谓。
  let clickedElement = useRef(null)

  const setCollectionStatus = (collection)=> { 
    collection.status = !collection.status
    let newCollectionList = collectionList.concat([])
    setCollectionList(newCollectionList)
  }

  const deleteCollectionConfirm = (id) => {
    confirm({
      title: '是否确认删除此集合?',
      content: '删除集合后，文件夹和接口将不可找回。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http({
          method:'delete',
          url:`/api/collection/${id}`
        }).then(() => {
          const nowCollection = returnExcludeById(collectionList, id)
          setCollectionList(nowCollection)
        })
      }
    })
  }
  const deleteFolderConfirm = (id, collectionId) => {
    confirm({
      title: '是否确认删除此文件夹?',
      content: '删除文件夹后，其下的文件夹和接口将不可找回。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http({
          method:'delete',
          url:`/api/folder/${collectionId}/${id}`
        }).then(() => {
          // 如果删除成功的话，你得找到他的父级，删除他自己后再更新状态
          const deleteData = (arr) => {
            arr.forEach(item => {
              const isExist = returnFindById(item.children, id)
              if (isExist) {
                item.children = returnExcludeById(item.children, id)
                let newCollectionList = collectionList.concat([])
                setCollectionList(newCollectionList)
              } else {
                deleteData(item.children)
              }
            })
          }
          deleteData(collectionList)
        })
      }
    })
  }
  const deleteRequestConfirm = (id) => {
    confirm({
      title: '是否确认删除此接口?',
      content: '删除后将不可找回。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http({
          method:'delete',
          url:`/api/request/${id}`
        }).then(() => {
          setCollectionList(helperFindByIdAndRemove(collectionList, id))
        })
      }
    })
  }
  // 这个函数是从添加dialog里面弹出后的内容，根据记录的id，来递归出真正的父级，然后让他status为true，并且push
  // 值得注意的是，这里的递归找父级的操作是可以复用的，后面要抽出来的
  const createFolder = (folder) => {
    let parent = helperFindByValueAndAssign(collectionList, casuallyProps.id)
    parent.status = true
    parent.children.push(folder)
    let newCollectionList = collectionList.concat([])
    setCollectionList(newCollectionList)
  }
   
  // 用于重命名集合和文件夹
  const renameCollectionAndFolderAndRequest = (item) => {
    const updateList = helperFindByAttributeAndAssign(collectionList, item, '_id', ['name', 'describe'])
    setCollectionList(updateList)
  }

  // 设置点击接口文件夹颜色变深的问题，首先我要递归清空掉所有的状态，然后再给她设置一下。
  const setActive = (item) => {
    const recursion = (arr) => {
      arr.forEach(item => {
        item.active = false
        recursion(item.children || [])
      })
    }
    recursion(collectionList)
    item.active = true
    let newCollectionList = collectionList.concat([])
    setCollectionList(newCollectionList)
  }

  // 选择了接口，不仅要处理颜色变深的问题，还有让你的右侧有所显示。逻辑在rxjs中了，只要把obj传过去就行了。
  const selectReuqest = (item) => {
    addRequestInfoByAside(item)
  }

  useEffect(() => {
    http({ url: `/api/collection/${props.match.params.id}` }).then(res => {
      setCollectionList(res)
    })
    http({ url: `/api/project/${props.match.params.id}` }).then(res => {
      setProjectInfo(res)
    })
  }, [props.match.params.id])

  useEffect(() => {
    const collectionAndFolderConfig = [{
        label: "修改名称和描述",
        click: () => {
          const parentElement = getParentNode(clickedElement.current, 'collection-item')
          // 我要拿到id就够了，递归找到这个原对象，赋值给临时变量，拿去当props
          const update = helperFindByValueAndAssign(collectionList, parentElement.dataset.id)
          setCasuallyProps(update)
          setEditCollectionOrFolderModal(true)
        }
      }, {
        label: "添加文件夹",
        click: () => {
          const parentElement = getParentNode(clickedElement.current, 'collection-item')
          setCasuallyProps({
            id: parentElement.dataset.id,
            collection: parentElement.dataset.collection
          })
          setAddFolderModal(true)
        }
      }, {
        label: "添加接口",
        click: () => {
          // 添加接口和添加文件夹是有点像的
          const parentElement = getParentNode(clickedElement.current, 'collection-item')
          setCasuallyProps({
            id: parentElement.dataset.id,
            collection: parentElement.dataset.collection
          })
          setAddRequestModal(true)
        }
      }, {
        label: "删除",
        click: () => {
          const parentElement = getParentNode(clickedElement.current, 'collection-item')
          // 这里是需要个判断的，有 collection 的id就代表删除的是文件夹，否则删除的就是集合
          if (parentElement.dataset.collection) {
            deleteFolderConfirm(parentElement.dataset.id,parentElement.dataset.collection)
          } else {
            deleteCollectionConfirm(parentElement.dataset.id)
          }
        }
    }]
    const requestConfig = [{
      label: "修改接口名和描述",
      click: () => {
        const parentElement = getParentNode(clickedElement.current, 'request-item')
          // 我要拿到id就够了，递归找到这个原对象，赋值给临时变量，拿去当props
        const update = helperFindByValueAndAssign(collectionList, parentElement.dataset.id)
        setCasuallyProps(update)
        setEditRequestModal(true)
      }
    }, {
      label: "删除",
      click: () => {
        const parentElement = getParentNode(clickedElement.current, 'request-item')
        // 这里是需要个判断的，有 collection 的id就代表删除的是文件夹，否则删除的就是集合
        deleteRequestConfirm(parentElement.dataset.id)
      }
    }]
    const folderMenu = new Menu()
    collectionAndFolderConfig.forEach(config => {
      folderMenu.append(new MenuItem(config))
    })
    const requestMenu = new Menu()
    requestConfig.forEach(config => {
      requestMenu.append(new MenuItem(config))
    })

    const handleContextMenu = (e) => {
      const forlderDoms = document.querySelectorAll('.collection-item') 
      let isExist = false
      forlderDoms.forEach(dom => {
        if (dom.contains(e.target)) isExist = true
      })
      if(isExist) {
        isExist = false
        clickedElement.current = e.target
        folderMenu.popup({window: remote.getCurrentWindow()})
      } else {
        // 上面的操作已经把文件夹和集合的右键菜单判断好了，这里再判断一圈看看是不是接口的
        const requestDoms = document.querySelectorAll('.request-item')
        requestDoms.forEach(dom => {
          if (dom.contains(e.target)) isExist = true
        }) 
        if(isExist) {
          isExist = false
          clickedElement.current = e.target
          requestMenu.popup({window: remote.getCurrentWindow()})
        }
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  })
  // 这个函数接受2个参数，第一个数组，就是集合的children, parent是父节点，这个用处很多，首先就是根据父级的status让这个函数是否显示
  const returnSubFolderDom = (parent) => {
    if (parent.status) {
      // 假如用户有method方法就代表了他是接口，就不能递归他的children了
      return parent.children.map(item => {
        if (item.method) {
          return(
            <div 
              className={`request-item flex-start ${item.active ? "active" : "hover"}`} 
              key={ item._id }
              data-id={ item._id }
              onClick={() => { setActive(item); selectReuqest(item) }}>
              <p className={item.method}>{ item.method }</p>
              <span>{ item.name }</span>
            </div>
          ) 
        } else {
          return(
            <FolderAndRequest key={item._id} style={{ paddingLeft: "10px" }}>
              <div className="folders ">
                <div 
                  className={`folders-item flex-start collection-item ${item.active ? "active" : "hover"}`} 
                  data-id={item._id}
                  data-collection={item.collectionId}
                  onClick={() => { setCollectionStatus(item); setActive(item) }}>
                  <Icon type={ item.status ? 'caret-down' : 'caret-right'} />
                  <Icon type={ item.status ? 'folder-open' : 'folder'} theme="filled"/>
                  <p className="folders-name">
                    { item.name }
                  </p>
                </div>
                { returnSubFolderDom(item) }
              </div>
            </FolderAndRequest>
          )
        }
      })
    }
  }
  return(
    <CustomAside>
      <section>
        <h2 className="ellipsis">{projectInfo.name}</h2>
        <p className="ellipsis">{projectInfo.describe}</p>
      </section>
      {/* 这个div就是单独放个search输入框 */}
      <div className='search'>
        <Search
          placeholder="search name"
          onSearch={value => console.log(value)}
        />
      </div>
      {/* 这个是放tab标签*/}
      <CustomTabs className="flex-start">
        <div className={!tabIndex ? 'active' : ''} onClick={()=>{setTabIndex(0)}}>历史</div>
        <div className={tabIndex ? 'active' : ''} onClick={()=>{setTabIndex(1)}}>列表</div>
      </CustomTabs>
      {/* 这里要写2个div，一个是历史tab，一个是列表tab */}
      {
        !tabIndex ?
        <div className="fill-all">我是历史</div>
        :
        <div className="fill-all">
          <AddCollection>
            <div className="point" onClick={() => { setAddCollectionModal(true) }}>
              <Icon type="plus" className="m-r-5"/>
              <span>新建集合</span>
            </div>
          </AddCollection>
          <CollectionList>  
            {
              collectionList.map(collection => {
                return(
                  <li className="collection" key={collection._id}>
                    <div className={`unfold-controller flex-start collection-item ${collection.active ? "active" : "hover"}`}
                      data-id={collection._id}
                      onClick={() => { setCollectionStatus(collection); setActive(collection) }}>
                      <Icon type={ collection.status ? 'caret-down' : 'caret-right'} />
                      <Icon type={ collection.status ? 'folder-open' : 'folder'} theme="filled"/>
                      <div className="collection-name">
                        <p className="name">{collection.name}</p>
                        <p className="amount">{collection.requestTotal} 个请求</p>
                      </div>
                    </div>
                    {
                      collection.status &&
                      <div>
                        { returnSubFolderDom(collection) }
                      </div>
                    }
                  </li>
                )
              })
            }
          </CollectionList>
        </div>
      }
      {/* 创建集合的对话框，里面是个form表单 */}
      <FormCreateCollection
        state={ addCollectionModal } 
        changeState={ () => { setAddCollectionModal(false) } }
        upList={(listItem) => { setCollectionList(collectionList.concat([listItem])) }}
      />
      {/* 创建文件夹的对话框，里面是个form表单 为什么不和上面集成在一起呢？是因为有点复杂，我先写个架子，后面优化*/}
      <FormCreateFolder
        state={ addFolderModal }
        parent={ casuallyProps } // 这个地方有问题啊，我怎么判断每次我拿到的父级呢，老方法，点击添加的时候单独弄个变量
        changeState={ () => { setAddFolderModal(false) } }
        upList={(folder) => { createFolder(folder) }}
      />
      {/* 修改集合的对话框，里面是个form表单 */}
      <FormEditFolder
        state={ editCollectionOrFolderModal }
        data={ casuallyProps }
        changeState={ () => { setEditCollectionOrFolderModal(false) } }
        upList={(listItem) => { renameCollectionAndFolderAndRequest(listItem) }}
      />
      {/* 创建接口的对话框*/}
      <FormCreateRequest
        state={ addRequestModal }
        parent={ casuallyProps } // 这个地方有问题啊，我怎么判断每次我拿到的父级呢，老方法，点击添加的时候单独弄个变量
        changeState={ () => { setAddRequestModal(false) } }
        upList={(request) => { createFolder(request) }}
      />
      {/* 修改接口的对话框 */}
      <FormEditRequest
        state={ editRequestModal }
        data={ casuallyProps }
        changeState={ () => { setEditRequestModal(false) } }
        upList={(listItem) => { renameCollectionAndFolderAndRequest(listItem) }}
      />
    </CustomAside>
  )
}
export default withRouter(Aside)
/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Icon, Modal } from 'antd';

import http from '../../api'
import { getParentNode } from '../../tool/returnFn'
import { CustomAside, CustomTabs, AddCollection, CollectionList, FolderAndRequest } from './style'

import FormCreateCollection from '../../components/project/create-collection'
import FormCreateFolder from '../../components/project/create-folder'
import FormEditFolder from '../../components/project/edit-collection'

const { remote } = window.require('electron')

const { Search } = Input;
const { Menu, MenuItem } = remote
const { confirm } = Modal;

const Aside = (props) => {
  const [ tabIndex, setTabIndex ] = useState(1) //  用于历史还是列表的tab切换
  // 关于列表中的status属性我得单独说明一下，本身是没有的，但是如果你让他点击过了他就有了
  const [ collectionList, setCollectionList ] = useState([]) 
  const [ addCollectionModal, setAddCollectionModal ] = useState(false);  //  控制添加集合的对话框的变量
  const [ addFolderModal, setAddFolderModal ] = useState(false);  //  控制添加文件夹的对话框的变量
  const [ editCollectionOrFolderModal, setEditCollectionOrFolderModal ] = useState(false);  //  控制编辑集合的对话框的变量
  const [ casuallyProps, setCasuallyProps ] = useState(null) // 用一个临时变量，就是当你右键操作的时候，这个值就被赋上了，本身是什么无所谓。

  let clickedElement = useRef(null)

  const getList = () => {
    http({
      method:'get',
      url:`/api/collection/${props.match.params.id}`
    }).then(res => {
      setCollectionList(res)
    })
  }

  const setCollectionStatus = (collection)=> { 
    collection.status = !collection.status
    // 没法触发监听，这样弄一下
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
          const nowCollection = collectionList.filter(collection => collection._id !== id)
          setCollectionList(nowCollection)
        })
      }
    })
  }
  const deleteFolderConfirm = (id, collectionId) => {
    confirm({
      title: '是否确认删除此集合?',
      content: '删除集合后，文件夹和接口将不可找回。',
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
              const isExist = item.children.find((item2 => item2._id === id))
              if (isExist) {
                item.children = item.children.filter(item2 => item2._id !== id)
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
  // 这个函数是从添加dialog里面弹出后的内容，根据记录的id，来递归出真正的父级，然后让他status为true，并且push
  // 值得注意的是，这里的递归找父级的操作是可以复用的，后面要抽出来的
  const createFolder = (folder) => {
    let parent = null
    const recursion = (arr) => {
      arr.forEach(item => {
        if (item._id === casuallyProps.id) {
          parent = item
        } else {
          recursion(item.children)
        }
      })
    }
    recursion(collectionList)
    parent.status = true
    parent.children.push(folder)
    let newCollectionList = collectionList.concat([])
    setCollectionList(newCollectionList)
  }

  useEffect(() => {
    getList() // 其实这个是不对的，因为你不能只有集合，你还要有集合下面的，但是为了测试，暂时就这样
  }, [])

  useEffect(() => {
    const menu = new Menu()
    menu.append(new MenuItem({
      label: "修改名称和描述",
      click: () => {
        const parentElement = getParentNode(clickedElement.current, 'collection-item')
        // 我要拿到id就够了，递归找到这个原对象，赋值给临时变量，拿去当props
        const recursionFind = (arr) => {
          arr.forEach(item => {
            if (item._id === parentElement.dataset.id) {
              setCasuallyProps(item)
            } else {
              recursionFind(item.children)
            }
          })
        }
        recursionFind(collectionList)
        setEditCollectionOrFolderModal(true)
      }
    }))
    menu.append(new MenuItem({
      label: "添加文件夹",
      click: () => {
        const parentElement = getParentNode(clickedElement.current, 'collection-item')
        setCasuallyProps({
          id: parentElement.dataset.id,
          collection: parentElement.dataset.collection
        })
        setAddFolderModal(true)
      }
    }))
    menu.append(new MenuItem({
      label: "添加接口",
      click: () => {}
    }))
    menu.append(new MenuItem({
      label: "删除",
      click: () => {
        const parentElement = getParentNode(clickedElement.current, 'collection-item')
        // 这里是需要个判断的，有 collection 的id就代表删除的是文件夹，否则删除的就是集合
        console.log(parentElement.dataset.collection);
        if (parentElement.dataset.collection) {
          deleteFolderConfirm(parentElement.dataset.id,parentElement.dataset.collection)
        } else {
          deleteCollectionConfirm(parentElement.dataset.id)
        }
      }
    }))
    const handleContextMenu = (e) => {
      const doms = document.querySelectorAll('.collection-item') 
      let isExist = false
      doms.forEach(dom => {
        if (dom.contains(e.target)) isExist = true
      })
      if(isExist) {
        isExist = false
        clickedElement.current = e.target
        menu.popup({window: remote.getCurrentWindow()})
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
      return parent.children.map(item => {
        return(
          <FolderAndRequest key={item._id}>
            <div className="folders">
              <div 
                className="folders-item flex-start collection-item" 
                data-id={item._id}
                data-collection={item.collectionId}
                onClick={() => { setCollectionStatus(item) }}>
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
      })
    }
  }

  return(
    <CustomAside>
      <section>
        <h2>项目1接口</h2>
        <p>这个项目的描述</p>
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
        <div>
          我是历史
        </div>
        :
        <div>
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
                    <div className="unfold-controller flex-start collection-item" 
                      data-id={collection._id}
                      onClick={() => { setCollectionStatus(collection) }}>
                      <Icon type={ collection.status ? 'caret-down' : 'caret-right'} />
                      <Icon type={ collection.status ? 'folder-open' : 'folder'} theme="filled"/>
                      <div className="collection-name">
                        <p className="name">{collection.name}</p>
                        <p className="amount">{collection.requestTotal} 个请求</p>
                      </div>
                    </div>
                    {/* 这里比较难以处理，一是层级是无限的，需要用递归去return，二是有文件夹和接口，他们俩是共存的 */}
                    {
                      collection.status &&
                      <div style={{ paddingLeft: "10px" }}>
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
        upList={(listItem) => { /** 这里的回显是个问题，感觉有点复杂，先放在这等会再写 */ }}
      />
    </CustomAside>
  )
}
export default withRouter(Aside)
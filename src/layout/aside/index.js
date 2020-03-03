/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Icon } from 'antd';

import http from '../../api'
import { CustomAside, CustomTabs, AddCollection, CollectionList } from './style'

import FormCreateCollection from '../../components/project/create-collection'

const { Search } = Input;

const Aside = (props) => {
  
  const [ tabIndex, setTabIndex ] = useState(1) //  用于历史还是列表的tab切换
  // 关于列表中的status属性我得单独说明一下，本身是没有的，但是如果你让他点击过了他就有了
  const [ collectionList, setCollectionList ] = useState([]) 
  const [ addddCollectionModal, setAddCollectionModal ] = useState(false);  //  控制添加集合或是接口文件夹的对话框的变量


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
  useEffect(() => {
    getList() // 其实这个是不对的，因为你不能只有集合，你还要有集合下面的，但是为了测试，暂时就这样
  }, [])

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
        <div >
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
                  <li className="flex-start" key={collection._id}>
                    <div className="unfold-controller flex-start" onClick={() => { setCollectionStatus(collection) }}>
                      <Icon type={ collection.status ? 'caret-down' : 'caret-right'} />
                      <Icon type={ collection.status ? 'folder-open' : 'folder'} theme="filled"/>
                      <div className="collection-name">
                        <p className="name">{collection.name}</p>
                        <p className="amount">{collection.requestTotal} 个请求</p>
                      </div>
                    </div>
            
                  </li>
                )
              })
            }
            
          </CollectionList>
        </div>
      }
      {/* 创建集合和文件夹的对话框，里面是个form表单 */}
      <FormCreateCollection
        state={ addddCollectionModal } 
        changeState={ () => { setAddCollectionModal(false) } }
        upList={(listItem) => { setCollectionList(collectionList.concat([listItem])) }}
      />
    </CustomAside>
  )
}

export default withRouter(Aside)
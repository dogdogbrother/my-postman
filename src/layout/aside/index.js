/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState } from 'react'
import { Input, Icon } from 'antd';

import { CustomAside, CustomTabs, AddCollection, CollectionList } from './style'

import FormCreateCollection from '../../components/project/create-collection'

const { Search } = Input;

const Aside = (props) => {
  
  const [ tabIndex, setTabIndex ] = useState(1) //  用于晚上
  const [ collectionList, setCollectionList ] = useState({})
  const [ addddCollectionModal, setAddCollectionModal ] = useState(false);  //  控制添加集合或是接口文件夹的对话框的变量
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
            <li className="flex-start">
              <div className="unfold-controller flex-start" onClick={() => { setCollectionList({ state: !collectionList.state }) }}>
                <Icon type={ collectionList.state ? 'caret-down' : 'caret-right'} />
                <Icon type={ collectionList.state ? 'folder-open' : 'folder'} theme="filled"/>
                <div className="collection-name">
                  <p className="name">第一个测试接口</p>
                  <p className="amount">6 个请求</p>
                </div>
              </div>
            </li>
          </CollectionList>
        </div>
      }
      {/* 创建集合和文件夹的对话框，里面是个form表单 */}
      <FormCreateCollection
        state={ addddCollectionModal } 
        changeState={ () => {  } }
        upList={ (list) => {  } }
      />
    </CustomAside>
  )
}

export default Aside
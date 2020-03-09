/**
  *  @description: 右侧接口上面的tab部分
  *  @author: sl
  *  @update :sl(2020/03/08)
*/
import React, { useState } from 'react' 
import { withRouter } from 'react-router-dom'
import { Icon } from 'antd';
import { WrapperHeader, AddBtn, TabWrapper, TabItem } from './style'

// 首先可以肯定的是+的按钮和边框

const ControlHeader = (props) => {
  const [ tabList, setTabList ] = useState([])

  const addTab = () => {
    tabList.push({
      _id: new Date().getTime(),
      type: "get",
      name: "未定义接口",
      isModify: false, // 是否被修改过，要是被修改过还没保存，关闭时要有提醒才行
      isCasually: false,  // 是否是临时的，就是点击了左边的时候，字体要是倾斜的，意思是当我没给他转正的时候，再点击左侧是要切换页面的。
      active: false
    })
    setTabList([...tabList])
  }

  const closeTab = (index) => {
    tabList.splice(index, 1)
    setTabList([...tabList])
  }

  const switchTab = (index) => {
    tabList.forEach((item, index2) => {
      if (index === index2) return item.active = true
      item.active = false
    })
    setTabList([...tabList])
  }

  return(
    <WrapperHeader>
      <TabWrapper>
        {tabList.map((tab, index) => (
          <TabItem 
            className={ tab.active && "active" } 
            key={tab._id}
            onClick={() => { switchTab(index) }}
            >
            <p className={`method-type ${ tab.type }`}>{tab.type}</p>
            <p className="request-name">{tab.name}</p>
            <p className="hover-icon">
              <Icon type="close" onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                closeTab(index)}}
                />
            </p>
          </TabItem>
        ))}
      </TabWrapper>
      <AddBtn onClick={() => addTab()}>
        <Icon type="plus"/>
      </AddBtn>
    </WrapperHeader>
  )
}

export default withRouter(ControlHeader)
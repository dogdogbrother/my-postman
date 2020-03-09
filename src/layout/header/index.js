/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Popover, Avatar, Icon, Badge, Drawer, Collapse } from 'antd';

import { HeaderBox, HearderMyInfo, PopoverContent } from './style'
import http from '../../api'
import { noRead, updateNoRead, userInfo } from '../../store/user'
import { useObservable } from 'rxjs-hooks'

const { Panel } = Collapse;
const Header = (props) => {
  //  关于rxjs的
  const noReadNumber = useObservable(() => noRead.asObservable()) || noRead.value
  const rxUserInfo = useObservable(() => userInfo.asObservable()) || userInfo.value
  
  const [ popoverStatus, setpopoverStatus ] = useState(false) //  点击头像展开的小对话框
  const [ drawerStatus, setDrawerStatus ] = useState(false)  // 点击查看通知右侧的抽屉
  const [ infoList, setInfoList ] = useState([])  //  右侧抽屉里面的信息的渲染列表
  const [ count, setCount] = useState(0)  //  这个是无奈之举，要不然我不知道你是展开点击还是关闭点击

  const logout = () => {
    let myDate = new Date();
    const key = 'jwt'
    myDate.setTime(-1000); // 设置时间
    document.cookie = key + "=''; expires=" + myDate.toGMTString();
    props.history.push('/login')
  }

  //  点击查看通知，做了3件事，关闭头像弹出框，打开侧边抽屉，请求消息参数
  const viewInfo = () => {
    setpopoverStatus(false)
    setDrawerStatus(true)
    http({
      method:'get',
      url:'/api/info'
    }).then(res => {
      setInfoList(res)
    })
  }

  //  这里我要先通过可以找到对应的info数据，如果是未读的就是发送put请求并且改成已读的
  const putSetRead = keyList => {
    if (keyList.length < count) {
      // 假如现在展开的数组小于上次展开的就是代表是关闭的，前端不用理会
      setCount(keyList.length)
      return
    } else {
      setCount(keyList.length)
      const info = infoList.find(info => info._id === keyList[keyList.length-1]) 
      console.log(info);
      
      if (info.isRead) return
      http({
        method:'put',
        url:`/api/info/read/${info._id}`,
      }).then(res => {
        // 这里缺点东西，把返回的自身信息告诉全世界
        info.isRead = true
        updateNoRead(noReadNumber - 1)
        // setInfoList([...infoList])
      })
    }
  }


  const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    margin: "0 -24px -10px -24px",
    border: 0,
    overflow: 'hidden',
  };
  
  const InfoPopover = (
    <PopoverContent>
      <div className="point">
        <Icon type="user" className="m-r-10"/>
        <span>{rxUserInfo.username}</span>
      </div>
      <div className="point">
        <Icon type="mail" className="m-r-10"/>
        <span>{rxUserInfo.email}</span>
      </div>
      <div className="point">
        <Icon type="form" className="m-r-10"/>
        <span>修改账户</span>
      </div>
      <div className="point">
        <Icon type="bell" className="m-r-10"/>
        <span>修改密码</span>
      </div>
      <div className="point" onClick={() => { viewInfo() }}>
        <Icon type="safety" className="m-r-10"/>
          <span>查看通知 { noReadNumber ? `(${noReadNumber}条未读)` : ""}</span>
      </div>
      {
        props.match.params.id && 
        <div className="point" onClick={() => { props.history.push("/") }}>
          <Icon type="rollback" className="m-r-10"/>
            <span>返回项目列表</span>
        </div>
      }
      <div className="point" onClick={ () => { logout() } }>
        <Icon type="poweroff" className="m-r-10 point"/>
        <span>注销</span>
      </div>
    </PopoverContent>
  )
  return(
    <HeaderBox className="flex-between">
      <div>
        {/* 这里暂时是空的，后期有可能添加些东西 */}
      </div>
      <div>
        {/* 这里暂时是空的，后期有可能是LOGO */}
      </div>
      <HearderMyInfo style={{ width: 70, clear: 'both', whiteSpace: 'nowrap' }}>
        <Popover 
          placement="bottom" 
          content={ InfoPopover } 
          trigger="click"
          visible={ popoverStatus }
          onVisibleChange={ val => { setpopoverStatus(val) } }>
          <Badge dot={ noReadNumber ? true : false }>
            <Avatar 
              shape="square"
              style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              size={ 28 }
              className="point"/>
          </Badge>
        </Popover>
      </HearderMyInfo>
      <Drawer
        title="查看信息通知"
        placement="right"
        onClose={ () => { setDrawerStatus(false) } }
        visible={ drawerStatus }
      >
        <Collapse bordered={false} onChange={(key) => { putSetRead(key) }}>
          {
            infoList.map(info => (
              <Panel 
                key={info._id} 
                header={info.title + (info.isRead ? "" : " (未读) ")} 
                style={customPanelStyle}>
                <p className="point">{info.msg}</p>
              </Panel>
            ))
          }
        </Collapse>
      </Drawer>
    </HeaderBox>
  )
}

export default withRouter(Header)
/**
  *  @description: 头部组件，模仿的apizza。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useEffect } from 'react'
import { Popover, Avatar, Icon } from 'antd';
import { HeaderBox, HearderMyInfo, PopoverContent } from './style'
const Header = () => {
  const InfoPopover = (
      <PopoverContent>
        <div className="point">
          <Icon type="user" className="m-r-10"/>
          <span>森林</span>
        </div>
        <div className="point">
          <Icon type="mail" className="m-r-10"/>
          <span>476410344@qq.com</span>
        </div>
        <div className="point">
          <Icon type="form" className="m-r-10"/>
          <span>修改账户</span>
        </div>
        <div className="point">
          <Icon type="safety" className="m-r-10"/>
          <span>修改密码</span>
        </div>
        <div className="point">
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
        <Popover placement="bottom" content={ InfoPopover } trigger="click">
        <Avatar 
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          size={ 28 }
          className="point">
          </Avatar>
        </Popover>
      </HearderMyInfo>
    </HeaderBox>
  )
}

export default Header
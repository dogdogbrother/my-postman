/**
  *  @description: 接口功能就这一个页面，东西比较多，分开成几个部分开发吧。
  *     头部是公用的，左侧是aside组件
  *  @author: sl
  *  @update :sl(2020/03/02)
*/
import React, { useState, useEffect } from 'react';
// import { Button, Card, Icon, Avatar, Modal, Tooltip } from 'antd';

import Header from '../../layout/header'
import Aside from '../../layout/aside'
// import http from '../../api'
import { Main } from './style'


const Project = (props) => {
  return(
    <div>
      <Header/>
      
      <Main className="flex-start">
        <Aside></Aside>
        <div>123</div>
      </Main>
    </div>
  )
}

export default Project
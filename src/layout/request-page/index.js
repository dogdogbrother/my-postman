/**
  *  @description: 我们这个项目的真正功能体现的主体区域。因为内容太多，注定会被分割成还几个组件和区域，这个组件就用做调度数据的地方吧。
  *  @author: sl
  *  @update :sl(2020/03/08)
*/
import React from 'react'
import { withRouter } from 'react-router-dom'
// import {  } from 'antd';

import ControlHeader from '../../components/request/control-header'
import RequestInfoPage from '../../components/request/request-info'

const RequestPage = (props) => {
  return(
    <div style={{flex: "1", display: "flex", flexDirection: "column"}}>
      <ControlHeader></ControlHeader>
      <RequestInfoPage></RequestInfoPage>
    </div>
  )
}

export default withRouter(RequestPage)
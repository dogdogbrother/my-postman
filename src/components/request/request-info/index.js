/**
  *  @description: 右侧接口上面的tab部分
  *  @author: sl
  *  @update :sl(2020/03/08)
*/
import React from 'react' 
import { withRouter } from 'react-router-dom'
import { Input, Select, Tabs, Button } from 'antd'

import { WrapperRequest } from './style'
// 首先可以肯定的是+的按钮和边框
const InputGroup = Input.Group;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const RequestInfo = (props) => {
  return(
    <WrapperRequest>
      <InputGroup compact size="large" style={{ display: 'flex' }}>
        <Select defaultValue="get" size="large" style={{ width: '100px' }}>
          <Option value="get">get</Option>
          <Option value="post">post</Option>
          <Option value="delete">delete</Option>
          <Option value="ptach">ptach</Option>
          <Option value="put">put</Option>
        </Select>
        <Search
          style={{ flex: '1' }}
          placeholder="请输入接口地址,默认 http:// 开头"
          enterButton="发送请求"
          size="large"
          onSearch={value => console.log(value)}
        />
      </InputGroup>
      <Tabs tabBarExtraContent={"清空参数"}>
        <TabPane tab="params" key="1">
          Content of tab params
        </TabPane>
        <TabPane tab="body" key="2">
          Content of tab body
        </TabPane>
        <TabPane tab="form-data" key="3">
          Content of tab form data
        </TabPane>
        <TabPane tab="header" key="4">
          Content of tab header
        </TabPane>
        <TabPane tab="authorization" key="5">
          Content of tab authorization
        </TabPane>
      </Tabs>
    </WrapperRequest>
  )
}

export default withRouter(RequestInfo)
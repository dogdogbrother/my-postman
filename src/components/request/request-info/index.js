/**
  *  @description: 右侧接口tab下的主区域内容，是和
  *  @author: sl
  *  @update :sl(2020/03/08)
*/
import React from 'react' 
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Tabs } from 'antd'
import { useObservable } from 'rxjs-hooks'

import MytableTable from './my-table'
import { requestInfoS, requestIndex } from '../../../store/request'

import { WrapperRequest } from './style'
// 首先可以肯定的是+的按钮和边框
const InputGroup = Input.Group;
const { Option } = Select;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;

const RequestInfo = (props) => {
  const rxRequestInfoS = useObservable(() => requestInfoS.asObservable()) || requestInfoS.value
  const rxRequestIndex = useObservable(() => requestIndex.asObservable()) || requestIndex.value
  
  const { getFieldDecorator } = props.form;
  
  return(
    <>
    {
      rxRequestInfoS.length && rxRequestIndex>-1
      ?
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
            <MytableTable></MytableTable>
          </TabPane>
          <TabPane tab="body" key="2">
            <Form>
              <Form.Item >
                {getFieldDecorator('json')(
                  <TextArea rows={6} />
                )}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="form-data" key="3">
            <MytableTable></MytableTable>
          </TabPane>
          <TabPane tab="header" key="4">
            <MytableTable></MytableTable>
          </TabPane>
          <TabPane tab="authorization" key="5">
            <MytableTable></MytableTable>
          </TabPane>
        </Tabs>
      </WrapperRequest> 
      :
      <div>没有借口</div>
    }
      
    </>
  )
}

const FormRequestInfo = Form.create({ name: 'request-info' })(RequestInfo);
export default withRouter(FormRequestInfo)
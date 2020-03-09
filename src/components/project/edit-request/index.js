/**
  *  @description: 和添加文件夹的思路是很接近的
  *  @author: sl
  *  @update :sl(2020/03/07)
*/
import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom'

import http from '../../../api'
import { helperCloseAndReset } from '../../../tool/helpers'

const CreateRequest = (props) => {
  const [ loading, setLoading ] = useState(false);

  const { TextArea } = Input
  const { getFieldDecorator } = props.form

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true)
    props.form.validateFields((err, values) => {
      if(err) return
      http({
        method: 'put',
        url: `/api/request/${props.data._id}`,
        parm: values
      }).then(res => {
        props.upList(res)
        helperCloseAndReset(props)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    })
  }

  const formItemLayout = {
    labelCol: {
      sm: { span: 5 }
    },
    wrapperCol: {
      sm: { span: 17 }
    },
  };

  return(
    <Modal
      visible={ props.state }
      title="编辑接口"
      onCancel={() => { helperCloseAndReset(props) }}
      footer={[
        <Button key="back" onClick={() => { helperCloseAndReset(props) }}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={ loading } onClick={ handleSubmit }>
          确定
        </Button>
      ]} 
    >
      <Form { ...formItemLayout } className="login-form">
        <Form.Item label="接口名字">
          {getFieldDecorator('name', {
            initialValue: `${props.data && props.data.name}`
          }, {
            rules: [{ required: true, message: '请输入接口名' }],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label="接口描述">
        {getFieldDecorator('describe', {initialValue: `${props.data && props.data.describe}`})(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormCreateRequest = Form.create({ name: 'createRequest' })(CreateRequest);

export default withRouter(FormCreateRequest)
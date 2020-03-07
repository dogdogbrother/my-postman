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
      const parm = {
        ...values,
        project: props.match.params.id,
        method: 'get'
      }
      // 假如有 collection 值，就说明是在文件夹上添加的
      if (props.parent.collection) {
        parm.folder = props.parent.id
        parm.collectionId = props.parent.collection
      } else {
        parm.collectionId = props.parent.id
      }
      http({
        method: 'post',
        url: '/api/request',
        parm,
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
      title="新建接口"
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
            rules: [{ required: true, message: '请输入接口名' }],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label="接口描述">
        {getFieldDecorator('describe')(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormCreateRequest = Form.create({ name: 'createRequest' })(CreateRequest);

export default withRouter(FormCreateRequest)
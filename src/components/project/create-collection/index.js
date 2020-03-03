import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom'

import http from '../../../api'

const CreateCollection = (props) => {
  const [ loading, setLoading ] = useState(false);

  const { TextArea } = Input
  const { getFieldDecorator } = props.form

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true)
    props.form.validateFields((err, values) => {
      if(err) return
      http({
        method:'post',
        url:`/api/collection/${props.match.params.id}`,
        parm: {
          ...values
        }
      }).then(res => {
        props.upList(res)
        props.changeState()
        setLoading(false)
      }).catch(err => {
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
      title="新建集合"
      onCancel={ () => { props.changeState() } }
      footer={[
        <Button key="back" onClick={ () => props.changeState() }>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={ loading } onClick={ handleSubmit }>
          确定
        </Button>
      ]} 
    >
      <Form { ...formItemLayout } className="login-form">
        <Form.Item label="集合名字">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入项目名' }],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label="集合描述">
        {getFieldDecorator('describe')(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormCreateCollection = Form.create({ name: 'createCollection' })(CreateCollection);

export default withRouter(FormCreateCollection)
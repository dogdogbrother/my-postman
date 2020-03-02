import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

import http from '../../../api'

const Createproject = (props) => {
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
        url:'/api/project/create',
        parm:values
      }).then(res => {
        // 这里缺点东西
        props.upList(res);
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
      title="新建项目"
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
        <Form.Item label="项目名字">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目名' }],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label="项目描述">
        {getFieldDecorator('projectDescribe')(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormCreateproject = Form.create({ name: 'creaProject' })(Createproject);

export default FormCreateproject
import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom'

import http from '../../../api'
import { helperCloseAndReset } from '../../../tool/helpers'

const EditCollection = (props) => {
  const [ loading, setLoading ] = useState(false);

  const { TextArea } = Input
  const { getFieldDecorator } = props.form

  const folderOrCollection = props.data && props.data.collectionId ? '文件夹' : '集合'
  const urlType = props.data && props.data.collectionId ? 'folder' : 'collection'

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true)
    props.form.validateFields((err, values) => {
      if(err) return
      http({
        method:'put',
        url:`/api/${urlType}/${props.data._id}`,
        parm: {
          ...values
        }
      }).then(res => {
        helperCloseAndReset(props)
        props.upList(res)
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
      title={`编辑${folderOrCollection}`}
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
        <Form.Item label={`${folderOrCollection}名字`} >
          {getFieldDecorator('name', {
            initialValue: `${props.data && props.data.name}`,
            rules: [{ required: true, message:`请输入${folderOrCollection}名`}],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label={`${folderOrCollection}描述`}>
        {getFieldDecorator('describe', {initialValue: `${props.data && props.data.describe}`})(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormEditCollection = Form.create({ name: 'editCollection' })(EditCollection);

export default withRouter(FormEditCollection)
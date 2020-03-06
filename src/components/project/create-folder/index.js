/**
  *  @description: 用于新建文件夹用的。和新建集合不一样的是，接受的参数有一个data-collection。
  *       这个值如果存在的话，就代表是在文件夹下建立的文件夹，那么就要有pId,就是传进来的id，collectionId就是data-collection
  *       反之，就是集合下的根文件夹，collectionId就是传进来的id，pId不用传
  *       除此之外，还有个小优化处理，就是成功后，会默认打开父级节点的status，并且把返回的值push到parent数组里面。
  *  @author: sl
  *  @update :sl(2020/03/05)
*/
import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom'

import http from '../../../api'
import { helperCloseAndReset } from '../../../tool/helpers'

const CreateFolder = (props) => {
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
        project: props.match.params.id
      }
      if (props.parent.collection) {
        parm.pId = props.parent.id
        parm.collectionId = props.parent.collection
      } else {
        parm.collectionId = props.parent.id
      }
      http({
        method: 'post',
        url: '/api/folder',
        parm,
      }).then(res => {
        props.upList(res)
        helperCloseAndReset(props)
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
      title="新建文件夹"
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
        <Form.Item label="文件夹名字">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入文件夹名' }],
          })(
            <Input/>
          )}
        </Form.Item>
        <Form.Item label="文件夹描述">
        {getFieldDecorator('describe')(
          <TextArea/>
        )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
const FormCreateFolder = Form.create({ name: 'createFolder' })(CreateFolder);

export default withRouter(FormCreateFolder)
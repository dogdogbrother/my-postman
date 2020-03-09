import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Tag } from 'antd';

import http from '../../../api'

import { DeveloperList } from './style'

const { Option } = Select;
const { confirm } = Modal;

const InviteMember = (props) => {
  const [ optionList, setOptionList] = useState([]);
  const [ developerlist, setDeveloperlist] = useState([])
  const { getFieldDecorator } = props.form
  
  const projectId = props.project && props.project._id
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if(err) return
      http({
        method:'put',
        url:`/api/project/${projectId}/member`,
        parm:values
      }).then(res => {
        setDeveloperlist([...developerlist,...res])
      })
    })
  }

  // 每次搜索的时候都向服务器请求对应的用户信息，tudo：做节流函数
  const handleSearch = (value) => {
    if (value === '') return setOptionList([])
    http({
      method:'get',
      url:`/api/user/list?username=${value}&limit=5`
    }).then(res => {
      setOptionList(res)
    })
  }

  // 删除一个项目的开发者
  const deleteConfirm = (id) => {

    confirm({
      title: '是否踢出此开发者?',
      content: '此用户将不能进入该项目进行开发与预览。',
      okText: '踢出',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // 这里我将写删除接口
        http({
          method:'delete',
          url:`/api/project/member/${projectId}/${id}`
        }).then(res => {
          setDeveloperlist(res)
        })
      }
    })
  }

  const handleChange = (val) => {
    // console.log(val)
  }
  
  const formItemLayout = {
    labelCol: {
      sm: { span: 5 }
    },
    wrapperCol: {
      sm: { span: 17 }
    },
  };

  useEffect(() => {
    if (!props.state) return
    http({
      method:'get',
      url:`/api/project/member/${projectId}`
    }).then(res => {
      setDeveloperlist(res)
    })
  }, [projectId, props.state])

  return(
    <Modal
      visible={ props.state }
      title="管理项目成员"
      footer={ null }
      onCancel={ () => { props.form.resetFields();setOptionList([]); props.changeState() } }
    >
      <Form { ...formItemLayout } className="login-form flex-start" style={{ width: '100%' }}>
        <Form.Item label="用户名" style={{ flex: '1' }}>
          {getFieldDecorator('members', {
            rules: [{ required: true, message: '请输入后根据提示选择用户' }],
          })(
            <Select
              filterOption={false} 
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请输入或选择用户"
              onChange={ (val) => { handleChange(val) } }
              onSearch={ (val) => { handleSearch(val)} }
            >
              { optionList.map(item => (
                <Option value={item._id} key={item._id}>
                  <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" className="tag-avatar" alt="avatar"></img>
                  {item.username}
                </Option>
              )) }
            </Select>
          )}
        </Form.Item>
        <Button type="primary" style={{ margin: '4px 0 0 -20px' }} onClick={ handleSubmit }>新增成员</Button>
      </Form>
      <DeveloperList>
        {
          developerlist.map(item => {
            return(
              <li className="flex-start" key={item._id}>
                <p className="username">{item.username}</p>
                <p className="email">{item.email}</p>
                <Tag color="orange">开发者</Tag>
                <span className="delete" onClick={() => { deleteConfirm(item._id) }}>delete</span>
              </li>
            )
          })
        }
      </DeveloperList>
    </Modal>
  )
}
const FormInviteMember = Form.create({ name: 'inviteMember' })(InviteMember);

export default FormInviteMember
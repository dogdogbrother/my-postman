import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import http from '../../api'
import { updateNoRead, updateUserInfo } from '../../store/user'
import { LoginWrapper } from './style'

const Login = (props) => {
  const { getFieldDecorator } = props.form
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // 校验通过
        http({
          method:'post',
          url:'/api/user/login',
          parm:values
        }).then(res => {
          updateNoRead(res.noReadNumber)
          updateUserInfo(res.userInfo)
          props.history.push('/')
        })
      } else {
      }
    })
  }
  return(
    <LoginWrapper>
      <Form onSubmit={ handleSubmit } className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className="flex-between">
            <span className="login-form-forgot" onClick={()=>{ props.history.push('/register') }} style={{ color: "#1890ff", cursor: "pointer" }}>
              现在注册
            </span>
            <span className="login-form-forgot" style={{ color: "#1890ff", cursor: "pointer" }}>
              忘记密码
            </span>
          </div>
          <Button type="primary" size="large" block htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    </LoginWrapper>
  )
}

const WrappedLogin = Form.create({ name: 'login' })(Login);

export default WrappedLogin;
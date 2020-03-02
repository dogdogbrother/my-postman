import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import http from '../../api'
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
          // 这里缺点东西，把返回的自身信息告诉全世界
          props.history.push('/')
        }).catch(err => {
          message.error('登陆失败')
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
            <a className="login-form-forgot" href="" onClick={ ()=>{ props.history.push('/register') } }>
              现在注册
            </a>
            <a className="login-form-forgot" href="">
              忘记密码
            </a>
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
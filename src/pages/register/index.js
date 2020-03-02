import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import http from '../../api'
import { LoginWrapper } from '../login/style'
const Register = (props) => {
  const { getFieldDecorator } = props.form
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        http({
          method:'post',
          url:'/api/user/register',
          parm:values
        }).then(res => {
          // 这里缺点东西，把返回的自身信息告诉全世界
          props.history.push('/')
        }).catch(err => {
          message.error('注册失败')
        })
      }
    })
  }
  const handleCheckPwd = (rule,value,callback) => {
    console.log(rule);
    
    let password = props.form.getFieldValue('password');
    if(password && password !== value){
      callback(new Error('两次密码输入不一致'))
    }else callback()
  }
  return(
    <LoginWrapper>
      <Form onSubmit={ handleSubmit } className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: '请输入用户名' }, 
              { min: 4, message: '用户名不能少于4个字符' },
              { max: 4, message: '用户名不能多于10个字符' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式错误' }]
          })(
            <Input
              prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }, { min: 6, message: '密码至少要6位' },],
            validateTrigger: 'onBlur'
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('affirmPassword', {
            rules: [
              { required: true, message: '请输入确认密码!' },
              { 
                validator: (required,value,callback) => {
                  handleCheckPwd(required,value,callback)
                }
              }
            ],
            validateTrigger: 'onBlur'
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请再次输入密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className="flex-between">
            <a href="" onClick={ ()=>{ props.history.push('/login') } }>
              去登录
            </a>
          </div>
          <Button type="primary" size="large" block htmlType="submit" className="login-form-button">
            注册
          </Button>
        </Form.Item>
      </Form>
    </LoginWrapper>
  )
}

const WrappedRegister = Form.create({ name: 'register' })(Register);
export default WrappedRegister
/**
  *  @description: 目前功能单一，不过后期有可能加东西，所以单独立一个文件夹。
  *  @author: sl
  *  @update :sl(2020/02/18)
*/
import React, { useState, useEffect } from 'react';
import { Button, Card, Icon, Avatar, Modal, Tooltip, Empty } from 'antd';

import http from '../../api'
import { MyProductMain, CardList } from './style'
import Header from '../../layout/header'
import FormCreateproject from '../../components/project/create-project'
import FormInviteMember from '../../components/project/invite-member'

// import { test } from '../socket'

const Layout = (props) => {
  const [ addProjectModal, setAddProjectModal ] = useState(false);  //  控制添加项目的对话框的变量
  const [ inviteModal, setInviteModal ] = useState(false);  //  控制要求组员的对话框的变量
  const [ projectList, setProjectList ] = useState([]);  //  渲染我的项目的数组
  const [ devProjectList, setDevProjectList ] = useState([]);  //  渲染我参与的项目的数组

  const [ currentProject, setCurrentProject ] = useState(null);  //  当然我操作的项目，包括我的和参与的。每当操作项目的时候就会更新
  const { confirm } = Modal;

  if(!document.cookie) {
    props.history.push('/login')
  }

  const deleteConfirm = (id) => {
    confirm({
      title: '是否确认删除此项目?',
      content: '删除项目后不可找回，项目成员将自动解散并收到一条通知。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http({
          method:'delete',
          url:`/api/project/${id}`
        }).then(res => {
          setProjectList(res)
        })
      }
    })
  }

  const quitConfirm = (id) => {
    confirm({
      title: '是否确认退出此项目?',
      content: '退出项目后，将没有进入此项目权限，并不再接受项目通知。',
      okText: '确认退出',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http({
          method:'delete',
          url:`/api/project/quit/${id}`
        }).then(res => {
          setDevProjectList(res)
        })
      }
    })
  }

  useEffect(()=>{
    // 请求全部的项目信息
    http({
      method:'get',
      url:'/api/project/all'
    }).then(res => {
      setProjectList(res.founders)
      setDevProjectList(res.members)
    }).catch(() => props.history.push('/login')) 
  }, [props.history]) 

  const { Meta } = Card;
  
  return (
    <>
      <Header />
      <MyProductMain>
        <Button type="primary" icon="plus" size="large" onClick={ () => { setCurrentProject(null); setAddProjectModal(true) } }>
          新建项目
        </Button>
        <div className="block">
          <p className="title">我拥有的项目</p>
          <CardList>
            {
              projectList.length ?
              projectList.map((item) => (
                <Card
                  className="card"
                  style={{ width: 300, margin: 10 }}
                  key={ item._id }
                  actions={[
                    <Tooltip 
                      placement="top" title="进入项目" arrowPointAtCenter
                      onClick={() => { props.history.push(`/project/${item._id}`) }}>
                      <Icon type="setting" key="setting" />
                    </Tooltip>,
                    <Tooltip placement="top" title="编辑项目" arrowPointAtCenter>
                      <Icon type="edit" key="edit" onClick={ () => { setCurrentProject(item); setAddProjectModal(true) } }/>
                    </Tooltip>,
                    <Tooltip placement="top" title="成员管理" arrowPointAtCenter>
                      <Icon type="branches" key="branches" onClick={ () => { setCurrentProject(item); setInviteModal(true) } }/>
                    </Tooltip>,
                    <Tooltip placement="top" title="删除项目" arrowPointAtCenter>
                      <Icon type="delete" key="delete" onClick={ () => { deleteConfirm(item._id) } }/>
                    </Tooltip>
                  ]}
                  >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={ item.name }
                    description={ item.describe }
                  />
                </Card>
              )) :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: "100%" }} description="没有你建立的项目"/>
            }
          </CardList>
        </div>
        <div className="block">
          <p className="title">我参与的项目</p>
          <CardList>
            {
              devProjectList.length ?
              devProjectList.map(project => {
                return(
                  <Card
                    key={project._id}
                    className="card" 
                    style={{ width: 300, margin: 10 }}
                    actions={[
                      <Tooltip placement="top" title="进入项目" arrowPointAtCenter>
                        <Icon type="setting" key="setting" />
                      </Tooltip>,
                      <Tooltip placement="top" title="退出项目" arrowPointAtCenter>
                        <Icon type="delete" key="delete" onClick={ () => { quitConfirm(project._id) } }/>
                      </Tooltip>
                    ]}
                    >
                    <Meta
                      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={project.name}
                      description={project.describe}
                    />
                  </Card>
                )
              }) :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: "100%" }} description="没有你参与的项目"/>
            }
          </CardList>
        </div>
      </MyProductMain>
      {/* 创建项目的对话框，里面是个form表单,优化一下，增加编辑功能 */}
      <FormCreateproject 
        state={ addProjectModal } 
        project={ currentProject }
        changeState={ () => {setAddProjectModal(false)} }
        upList={ (list) => { setProjectList(list) } }
      />
      {/* 邀请项目成员的对话框，里面是个form表单 */}
      <FormInviteMember
        project={ currentProject }
        state={ inviteModal } 
        changeState={ () => { setInviteModal(false)} }
      />
    </>
  )
}

export default Layout
import React, { useEffect } from 'react';
import { Route, Switch } from "react-router";
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/global-margin-padding.css'
import './styles/global-flex.css'
import './styles/others.css'

import './socket'

import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import Project from './pages/project'

import http from './api'
import { updateNoRead, updateUserInfo } from './store/user'

function App() {
  
  useEffect(() => {
    http({
      method:'get',
      url:'/api/user/gist'
    }).then(res => {
      updateNoRead(res.noReadNumber)
      updateUserInfo(res.userInfo)
    })
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={ Login }></Route>
          <Route exact path="/register" component={ Register }></Route>
          <Route exact path="/" component={ Profile }></Route>
          <Route exact path="/project/:id" component={ Project }></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;

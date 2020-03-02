// 放的都是些个人信息之类的东西，例如有多少未读消息啊等等内容

import { BehaviorSubject } from "rxjs"

export const noRead = new BehaviorSubject(0)

export const updateNoRead= val => { noRead.next(val<0 ? 0 : val) }  

//  未读信息的


export const userInfo = new BehaviorSubject({
  avatar_url: "",
  _id: "",
  username: "",
  email: ""
})

export const updateUserInfo = obj => { 
  let value = userInfo.value
  userInfo.next({
    ...value,
    ...obj
  })
} 

// 这些是用于接口页面主体区域，当我们控制左侧的aside接口，或是控制了上面的tab，都会改变发送接口的主页面

import { BehaviorSubject } from "rxjs"

const data = {
  method: "get",
  name: "未定义接口",
  isModify: false, // 是否被修改过，要是被修改过还没保存，关闭时要有提醒才行
  isCasually: false,  // 是否是临时的，就是点击了左边的时候，字体要是倾斜的，意思是当我没给他转正的时候，再点击左侧是要切换页面的。
  active: true,  // 用于当前那个active被选中了
  location: '',  // 记录当前的http地址
  body: '',  // 记录post的请求体
}


// 这里我先弄的简单一点，值提供个数组，负责渲染顶部的tab的
export const requestInfoS = new BehaviorSubject([])

// 这是干啥用的呢，和上面的 requestInfoS 相互配合的，点击上面的tab，显示对应的数组内容
export const requestIndex = new BehaviorSubject(-1)


// 这个地方我应该写几个不同的dispatch，来做到对应的功能

/**
 * @description: 只有点击上面的add才会执行此函数,在改变index值(改变主页面展示)同时，把全部的active清空，新增的active为true。
 * @param {  }: 不需要参数
 */
export const addRequestInfoByPlus = () => { 
  let value = requestInfoS.value
  value.forEach(item => {
    item.active = false
  })
  requestInfoS.next(value.concat([{
    ...data,
    _id: new Date().getTime()
  }]))
  requestIndex.next(requestInfoS.value.length -1 )
} 

/**
 * @description: 只有点击左侧aside才会执行此函数，相比较上面的add添加多了一些步骤。
 *    1. 改变index值(改变主页面展示)同时。
 *    2. 我们不知道要添加新的tab，还是要替换atb。是要根据参数的_id来判断
 *    2. 不管添加还是替换，active都要清空。
 * @param { object }: 参数是左侧的aside接口数据
 */
export const addRequestInfoByAside = obj => {
  let recordIndex = null
  // 先遍历一遍，看下操作的接口是否已经在tab中了，顺便把active清空
  let value = requestInfoS.value.map((item, index) => {
    item.active = false
    if (item._id === obj._id) {
      item = obj
      item.active = true
      console.log(item)
      recordIndex = index
    }
    return item
  })
  // 如果存在就添加，记住要更新index来显示接口info内容
  if (recordIndex || recordIndex === 0) {
    requestInfoS.next([...value])
    requestIndex.next(recordIndex)
  } else {
    requestInfoS.next(value.concat([{
      ...obj
    }]))
    requestIndex.next(requestInfoS.value.length -1 )
  }
}

/**
 * @description: 是点击上面的叉叉的时候把index传过去，在关闭的同时注意active的改变
 * @param { number }: index值
 */
export const removeRequestInfo = index => {
  let value = requestInfoS.value
  value.splice(index, 1)
  requestInfoS.next([...value])
}

/**
 * @description: 点击tab，会把全部的active设false，只有对应的index的变为true
 * @param { number }: index值
 */
export const switchRequestInfo = (index) => {
  let value = requestInfoS.value
  value.forEach((item, index2) => {
    item.active = (index === index2)
  })
  requestInfoS.next([...value])
}
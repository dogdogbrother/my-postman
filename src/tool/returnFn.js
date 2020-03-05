/**
  *  @description: 之所以名字叫做returnFn，意思就是说需要返回值的公用函数
  *  @author: sl
  *  @update :sl(2020/02/18)
*/

// 这个函数传入节点，和需要查找的父节点的class，返回父节点
export const getParentNode = (node,parentClassName) => {
  let current = node
  while(current !== null) {
    if(current.classList.contains(parentClassName)) {
      return current
    }
    current = current.parentNode
  }
  return false
}

// 传入一个数组和id，根据id来找到数组对应的属性
export const getIdItem = (node,parentClassName) => {
  let current = node
  while(current !== null) {
    if(current.classList.contains(parentClassName)) {
      return current
    }
    current = current.parentNode
  }
  return false
}
/**
  *  @description: 之所以名字叫做returnFn，意思就是说需要返回值的公用函数
  *  @author: sl
  *  @update :sl(2020/02/18)
*/

/**
  *  @description: 这个函数传入节点，和需要查找的父节点的class，返回父节点
  *  @param { object, string }: 第一个是dom节点，第二个是查找的父级的className
  *  @author: sl
*/
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

/**
  *  @description: 传入一个数组和id，根据id来找到数组对应的属性
  *  @param { object, string }: 第一个是dom节点，第二个是查找的父级的className
  *  @author: sl
*/
export const getIdItem = (node,parentClassName) => {
  // 未实现
}
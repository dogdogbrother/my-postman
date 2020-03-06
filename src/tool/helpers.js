/**
  *  @description: 帮忙做一些经常做的操作，小助手函数
  *  @author: sl
  *  @update :sl(2020/03/06)
*/

/**
  *  @description: 关闭对话框并且清楚对话框里面的form表单的值。不过这个对外部的属性有要求，关闭对话框的函数比较名为changeState
  *  @param { object }: 执行props下的 changeState和form.resetFields
  *  @author: sl
*/
export function helperCloseAndReset(props) {
  props.changeState()
  props.form.resetFields()
}

/**
  *  @description: 递归有很多种，有一种是根据参数对象的属性找到树中对应的子级，然后把参数对象中的值赋给子级
  *  @param { array }: 就是需要递归的树
  *  @param { object }: 等待被赋值的参数对象
  *  @param { string }: 需要匹配的属性
  *  @param { [string, array] }: 需要被赋值的属性名，如果是多个，可以传数组
  *  @param { object }: options选填.isReturn:是否把递归过后的tree返回,默认true,children:自己的属性名，默认是children。
  *  @author: sl
*/
export function helperFindByAttributeAndAssign(
  tree, 
  paramObject,
  matchAttribute,
  assignAttribute,
  options= {
    isReturn: true,
    children: "children"
  }) {
  const { isReturn, children } = options
  const recursion = (tree) => {
    tree.forEach(item => {
      if (item[matchAttribute] === paramObject[matchAttribute]) {
        // 假如 assignAttribute 为数组，就代表有多个属性需要被赋值
        if (assignAttribute instanceof Array) {
          assignAttribute.forEach(attribute => {
            item[attribute] = paramObject[attribute]
          })
        } else {
          item[assignAttribute] = paramObject[assignAttribute]
        }
      }
      recursion(item[children])
    })
  }
  recursion(tree)
  if (isReturn) return tree.concat([])
}

/**
  *  @description: 根据一个值找到tree中的一个对象，然后返回找到的对象，
  *  @param { array }: 就是需要递归的树
  *  @param { any }: 匹配的值
  *  @param { string }: 需要匹配的属性,默认为_id
  *  @param { string }: tree下一级数组的属性名，默认是childer
  *  @author: sl
*/
export function helperFindByValueAndAssign(tree, value, matchAttribute="_id", children="children") {
  let target = null
  const recursion = (tree) => {
    tree.forEach(item => {     
      if (item[matchAttribute] === value) {            
        target = item
      } else {
        recursion(item[children])
      }
    })
  }
  recursion(tree)
  return target
}
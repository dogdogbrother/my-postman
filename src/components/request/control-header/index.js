/**
  *  @description: 右侧接口上面的tab部分
  *  @author: sl
  *  @update :sl(2020/03/08)
*/
import React from 'react' 
import { withRouter } from 'react-router-dom'
import { Icon } from 'antd';
import { useObservable } from 'rxjs-hooks'
import { requestInfoS, addRequestInfoByPlus, removeRequestInfo, switchRequestInfo } from '../../../store/request'
import { WrapperHeader, AddBtn, TabWrapper, TabItem } from './style'


// 首先可以肯定的是+的按钮和边框

const ControlHeader = () => {
  const rxRequestInfoS = useObservable(() => requestInfoS.asObservable()) || requestInfoS.value

  const closeTab = (index) => {
    removeRequestInfo(index)
  }

  return(
    <WrapperHeader>
      <TabWrapper>
        {rxRequestInfoS.map((tab, index) => (
          <TabItem 
            className={ tab.active && "active" } 
            key={tab._id}
            onClick={() => { switchRequestInfo(index) }}
            >
            <p className={`method-type ${ tab.method }`}>{tab.method}</p>
            <p className="request-name">{tab.name}</p>
            <p className="hover-icon" onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              closeTab(index)}}>
              <Icon type="close"/>
            </p>
          </TabItem>
        ))}
      </TabWrapper>
      <AddBtn onClick={() => addRequestInfoByPlus()}>
        <Icon type="plus"/>
      </AddBtn>
    </WrapperHeader>
  )
}

export default withRouter(ControlHeader)
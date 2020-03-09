import styled from "styled-components";

export const WrapperHeader = styled.div`
  padding: 30px 10px 0 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  line-height: 32px;
  ul,p{
    margin: 0;
  }
`

export const AddBtn = styled.div`
  height: 34px;
  width:32px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #eee;
  margin-bottom: -1px;
  i:hover{
    color: #1890ff;
  }
`

export const TabWrapper = styled.ul`
  display: flex;
`

export const TabItem = styled.li`
  cursor: pointer;
  display: flex;
  border:1px solid #eee;
  border-bottom: none;
  margin-right: 5px;
  margin-bottom: -1px;
  max-width: 250px;
  min-width: 150px;
  .method-type{
    width:44px;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
  }
  .request-name{
    flex: 1;
  }
  .hover-icon{
    width: 20px;
    text-align: center;
    font-size: 12px;
    display: none;
    &:hover{
      color: red;
    }
  }
  &.active{
    border-top: 2px solid #1890ff;
    border-bottom: 1px solid #fff;

  }
  &:hover .hover-icon{
    display: block;
  }
`

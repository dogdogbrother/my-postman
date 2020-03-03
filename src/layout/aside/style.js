import styled from "styled-components";

export const CustomAside = styled.aside`
  width: 240px;
  box-sizing: border-box;
  height: calc(100vh - 48px);
  box-shadow: 0 0px 8px #ccc;
  section {
    height:80px;
    padding: 10px;
    border-bottom: 1px solid #eee;
    h2{
      font-size: 20px;
      line-height: 28px;
    }
    p{
      color: #999;
    }
  }
  .search {
    padding: 10px;
  }
`
export const CustomTabs = styled.div`
  padding: 0 5px;
  border-bottom: 1px solid #eee;
  margin-bottom: -1px;
  div{
    flex: 1;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
    color: #999;
    box-sizing: border-box;
  }
  .active{
    color: #555;
    border-bottom: solid #1890ff 3px;
  }
`

export const AddCollection = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: #1890ff;
`

export const CollectionList = styled.ul`
  margin: 0;
  .unfold-controller{
    width: 100%;
    background-color: #fffeee;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    i{
      margin: 10px 3px 0 0;
    }
    .collection-name{
      margin-left: 5px;
      flex:1;
      p{
        margin: 0;
      }
      .name{
        color: #333;
      }
      .amount{
        font-size: 12px;
        color: #999;
      }
    }
  }
`
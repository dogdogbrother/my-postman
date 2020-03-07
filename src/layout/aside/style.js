import styled from "styled-components";
// --color-brand-primary: ##666666; patch
// --color-brand-secondary: #097BED; put
// --color-accent-error: #EB2013; delete
// --color-accent-warning: #FFB400; post
// --color-accent-success: #249C47; get
export const CustomAside = styled.aside`
  .request-item{
    padding: 5px 0 5px 10px;
    font-size: 14px;
    line-height: 18px;
    p{
      font-size: 11px;
      text-align: center;
      width: 48px;
      font-weight: bold;
    }
  }
  .patch {
    color: #666666
  }
  .put {
    color: #097BED
  }
  .delete {
    color: #EB2013
  }
  .post {
    color: #FFB400
  }
  .get {
    color: #249C47
  }
  width: 240px;
  box-sizing: border-box;
  height: calc(100vh - 48px);
  box-shadow: 0 0px 8px #ccc;
  display: flex;
  flex-direction: column;
  .fill-all{
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .fill-all::-webkit-scrollbar {
    display: none;
  }
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
  flex: 1;
  overflow: scroll;
  .collection{
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .unfold-controller{
    width: 100%;
    padding: 10px;
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

export const FolderAndRequest = styled.div`
  p{
    margin-bottom: 0;
  }
  .folders{
    padding-left: 10px;
    i{
      margin-right: 3px;
    }
    .folders-name{
      line-height: 1;
    }
    .folders-item{
      padding: 10px 0 10px 0;
    }
  }
`
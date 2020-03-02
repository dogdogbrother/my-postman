import styled from "styled-components";

export const MyProductMain = styled.main`
  width: 90%;
  min-width: 860px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20px 0;
  .block{
    margin: 20px 0;
    .title{
      margin-bottom:10px;
      font-weight: bold;
      font-size: 16px;
    }
  }
`;

export const CardList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  .card:hover {
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.15);
  }
`
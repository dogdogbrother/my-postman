import styled from "styled-components";

export const DeveloperList = styled.ul`
  margin-top: 2px;
  padding-left: 20px;
  li{
    margin-bottom: 8px;
  }
  p{
    margin: 0;
  }
  .username{
    width: 22%;
  }
  .email{
    width: 52%;
  }
  .delete{
    margin-left: 10px;
    color: #ff4d4f;
    cursor: pointer;
    user-select: none;
    &:hover{
      color: #f00000;
    }
  }
`
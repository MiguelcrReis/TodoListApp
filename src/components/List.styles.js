import styled from "styled-components";

const checkTask = Boolean;

export const Constainer = styled.div(({checkTask}) => ( 
`
display: flex;
background-color: #8A2BE2;
padding: 0px;
border-radius: 10px;
margin-bottom: 10px;
align-items: center;

input {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  
}

label{
  text-decoration: ${checkTask ? 'line-through' : 'initial'};
}

`));
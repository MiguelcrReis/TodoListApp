import React from 'react'
import styled from 'styled-components'
import Layout from './Layout'

const PostLayout = styled.div`
margin: 1rem 2rem;
    padding: 1rem 4rem;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 5vmin;
    background: #e7e8e8; 
    border-radius: 8px;
    box-shadow: -7px 7px 6px -6px #777;
    z-index: 200;
  
`

const Post = ({ match }) => {
  console.log(match)
return(
    <PostLayout>
      <span>Post:  {match.params.id} </span>
    </PostLayout>
  )
}
  export default Post
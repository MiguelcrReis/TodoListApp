/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { createPost, deletePost } from '../graphql/mutations'
import { listPosts } from '../graphql/queries'
import awsExports from "../aws-exports";
import Layout from "./Layout"
import styled from "styled-components"
import Article from "./Article"
import Post from "./Post"
Amplify.configure(awsExports);

const Wrapper = styled.div`

  input, textarea {
    border: none; 
    background-color: #ddd; 
    margin: .2rem; 
    padding: 1rem; 
    font-size: 18; 
  }
  .Nav{
    display: flex;
    justify-content: center;
  }
  button, .homeButton { 
    text-align: center;
    background: #fff;
    color: #1ECD97; 
    outline: none; 
    font-size: 18px; 
    border-radius:20px;
    border: 2px solid #69c7aa;
    margin: 1rem 2rem;
    padding: 1rem 4rem;
    &:hover {
    color:white;
    background: #69c7aa;
    cursor: pointer;
  }
  }
  .article-list {
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
  }
  .overlay {
    position:absolute;
    top:50%;
    left:50%;
    width:50%;
    height:50%;
    transform:translate(-50%, -50%);
    color: white; 
    background: white; 
    opacity: .8;
    z-index: 99;
    transition: opacity .2s ease-out;
    box-shadow: -4px 7px 20px 0px #5f5f5f;
    border-radius: 8px;
    display: flex; 
    flex-direction: column; 
    justify-content: space-around;
    p{
      color: black; 
    }
    
  }
  .closeButton {
    cursor: pointer;
    position: absolute;
    top: 4%;
    right: .5%;
    padding: 12px 16px;
    transform: translate(0%, -50%);
    color: black;
    border: 1px solid black;
    border-radius: 5px;
  }
  .closeButton:hover {
    background: #bbb;
  }
  .hidden {
    display: none;
  }
  a {
    text-decoration: none;
  }
`

const initialState = { name: '', description: '' }

const Main = () => {
  const [formState, setFormState] = useState(initialState)
  const [unpublishState, setUnpublishState] = useState(false)
  const [Posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchPosts() {
    try {
      const PostData = await API.graphql(graphqlOperation(listPosts))
      const Posts = PostData.data.listPosts.items
      setPosts(Posts)
    } catch (err) { console.log('error fetching Posts') }
  }

  async function addPost() {
    try {
      if (!formState.name || !formState.description) return
      const Post = { ...formState }
      setPosts([...Posts, Post])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createPost, {input: Post}))
      toggleOverlay()
    } catch (err) {
      console.log('error creating Post:', err)
    }
  }
  async function callDeletePost(item) {
    try {
      await API.graphql(graphqlOperation(deletePost, {input: { id: item.id } }))
      console.log('todo successfully deleted!');
      const new_items = Posts.filter(myitem => myitem.id !== item.id);
      setPosts(new_items);
    } catch (err) {
      console.log('error deleting Post:', err)
    }
  }
  const handleDelete = event => {
    console.log("onDelete Post");
    console.log(event);
    callDeletePost(event);
  }
  function toggleOverlay() {
    let overlayDiv = document.querySelector(".overlay");
    console.log(overlayDiv.style.opacity);
    if (overlayDiv.style.opacity === '0'){
      overlayDiv.style.opacity = 1;
      overlayDiv.style.zIndex = 299;
      overlayDiv.classList.remove(".hidden");
    }
    else{
      overlayDiv.style.opacity = 0;
      overlayDiv.style.zIndex = -1;
      overlayDiv.classList.add(".hidden");
    }
  }
  function toggleUnpublish() {
    let overlayDiv = document.querySelector(".overlay");
    overlayDiv.style.opacity = 0;
    overlayDiv.style.zIndex = -1;
    overlayDiv.classList.add(".hidden");
    if (unpublishState === false)
      setUnpublishState(true);
    else
    setUnpublishState(false);
  }

  return (
    <Wrapper>
      <div className="overlay" style={{ opacity: 0}}>
        <span className="closeButton" onClick={toggleOverlay}>x</span>
        <p>Publish new post</p>
        <input
          onChange={event => setInput('name', event.target.value)}
          value={formState.name}
          placeholder="Name"
        />
        <textarea
          onChange={event => setInput('description', event.target.value)}
          value={formState.description}
          placeholder="Description"
          name="message" rows="10" cols="30"
        />
        <button onClick={addPost}>Create Post</button>
      </div>

      <div className="Nav">
        <a href="/" className="homeButton">Home</a>
        <button onClick={toggleOverlay} >Publish</button>
        <button onClick={toggleUnpublish} >Unpublish</button>
      </div>

      <ul className="article-list">
        {
          Posts.map((Post, index) => (
            <li key={Post.id ? Post.id : index}>
              
              <Link to={`/post/${(Post.name).replace(/\s+/g, '')}`}>
                <Article 
                  className="article" 
                  Post={Post} 
                  Url={Post.name} 
                  PageIndex={index} 
                  ImgSrc={`https://picsum.photos/300/200?`+Post.name} 
                  onDelete={handleDelete} 
                  setDelete={unpublishState}
                ></Article>
              </Link>
            </li>
          ))
        }
      </ul>
      <Route path='/post/:id' render={(props) => <Post {...props} /> } />
    </Wrapper>
  )
}

export default Main

import './App.css';
import Logo from './img/logo.png'  
import * as S from './App.styles';
import * as C from './components/Create.styles';
import * as L from './components/List.styles';
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
//import AddTaskIcon from '@mui/icons-material/AddTask';
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { Fab } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import React from 'react';
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import {createTodo as createTodoMutation, deleteTodo as deleteTodoMutation, updateTodo as updateTodoMutation} from './graphql/mutations';
import { Tune } from '@material-ui/icons';
/*
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from "@material-ui/icons/Add";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { Fab } from "@material-ui/core";
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(3),
  },
  itens: {
    width: '90%',
    margin: '10px',
    padding: '10px',
  },
  inline: {
    display: 'inline',
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
    color: "#2882F8",
  },
  div: {
    color: "#FFF",
    backgroundColor: "#f29316",
    margin: '10px',
    marginBottom: '20px',
    padding: '15px',
  },
  campos: {
    margin: '10px',
    padding: '10px',
  },
  camera: {
    color: "#f29316",
  }
}));
*/

const initialFormState = { name: '', check: false}

const teste = {Boolean}
function App() {

  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);


  useEffect(() => {
    fetchTodos();
  }, []);

  /*
  async function onChange(e) {
    if(!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData})
  }
  */
  

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos});
    const TodosFromAPI = apiData.data.listTodos.items;
    {/*setTodos(apiData.data.listTodos.items);*/}
    
    await Promise.all(TodosFromAPI.map(async todo => {
    return todo;
    }))
    setTodos(apiData.data.listTodos.items);
  }

  async function updateTodo(){
    if (formData.name) return;
    await API.graphql({ query: updateTodoMutation, variables: {input: formData} });
    setTodos([ ...todos, formData ]);
    setFormData(initialFormState);
  }

  async function createTodo({ onEnter }){
    if (!formData.name) return;
    await API.graphql({ query: createTodoMutation, variables: {input: formData } });
    /*
    event = new KeyboardEvent(typeArg, keyboradInit);
    const handleKeyUp = (e: KeyboardEvent ) => {
    if(e.code === "Enter" && formData.name !== ''){
      onEnter(formData.name);
    }*/
    

    setTodos([ ...todos, formData ]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: {input: { id } }});
  }
  
  return (

      
      <S.Container>
        <S.Centro>
          <S.Header>
            <img class='App-logo' src={Logo}/>
            <S.sub>Sua Lista de Tarefas online</S.sub>
          </S.Header>
      <C.Container> 
      <div className="+">➕</div>
      <input 
        onChange={e => setFormData({ ...formData, 'name': e.target.value })}
        placeholder="Adicione uma nova tarefa..."
        value={formData.name}

      />

      <Fab 

        size="small" 
        component="span" 
        aria-label="add" 
        onClick={createTodo}
        >
        <AddIcon/>

      </Fab>

      </C.Container>  

      <div style={{marginBottom: 30}}>
        {
          todos.map(todo => (

            <div key={todo.id || todo.name}>
             

              <L.Constainer>
                
                <input 
                type="checkbox"
                checked={teste}
                onChange={e => setFormData({ ...formData, 'check': e.target.checked })}
                //value={formData.check}
                />
                <label>{todo.name}</label>
                
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo)} variant="contained" color="black">
                    <DeleteIcon />
                  </IconButton>
                
              </L.Constainer>
            </div>
          ))
        }
          </div>
      <AmplifySignOut />
      </S.Centro>
    </S.Container>
  );
}

export default withAuthenticator(App);
//IMPORTS
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

import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import {createTodo as createTodoMutation, deleteTodo as deleteTodoMutation, updateTodo as updateTodoMutation} from './graphql/mutations';

const initialFormState = { name: '', check: false}





//APP
const teste = {Boolean}
function App() {

  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isChecked, setIsChecked] = useState(Boolean);

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
  
  //LIST 
  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos});
    const TodosFromAPI = apiData.data.listTodos.items;
    {/*setTodos(apiData.data.listTodos.items);*/}
    
    await Promise.all(TodosFromAPI.map(async todo => {
    return todo;
    }))
    setTodos(apiData.data.listTodos.items);
  }
  //UPDATE
  async function updateTodo({id, check}){
    if (formData.name) return;
    await API.graphql({ query: updateTodoMutation, variables: {input: formData} });

    const updateTask = (id, check) => {
    let newList = [... formData] 
    for(let i in newList) {
      if (newList[i].id === id){
        newList[i].check = check;
      }
    }
    }
    setTodos([ ...todos, formData ]);
    setFormData(initialFormState);
  }
  //CREATE
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

  //DELETE
  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: {input: { id } }});
  }
  
  //RETURN APP
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
             

              <L.Constainer check={isChecked}>
                
                <input
                type="checkbox"
                //onChange={e => setIsChecked( e.target.checked)}
                //onChange={updateTodo(todo.id, todo.check)}
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
import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import {createTodo as createTodoMutation, deleteTodo as deleteTodoMutation} from './graphql/mutations';

import './App.css';

const initialFormState = { name: ''}


function App() {

  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos});
    setTodos(apiData.data.listTodos.items);
  }

  async function createTodo(){
    if (!formData.name) return;
    await API.graphql({ query: createTodoMutation, variables: {input: formData } });
    setTodos([ ...todos, formData ]);
    setFormData(initialFormState);
  }

  async function deleteTodo({id}) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: {input: { id } }});
  }
  
  return (
    <div className="App"> 
      <h1>TodoList</h1>
      <h3>Sua lista de Tarefas online</h3>
      ➕
      <input 
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Adicione uma nova tarefa..."
        value={formData.name}
      />
      <button oncClick={createTodo}>Adicionar Tarefa</button>
      <div style={{marginBottom: 30}}>
        {
          todos.map(todo => (
            <div key={todo.id || todo.name}>
              <h2>{todo.name}</h2>
              <button onClick={() => deleteTodo(todo)}>Deletar Tarefa</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
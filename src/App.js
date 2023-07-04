import './reset.css';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList.js';
import TodoFilters from './components/TodoFilters.js';
import CheckAllAndRemaining from './components/CheckAllAndRemaining.js';
import ClearComponentBtn from './components/ClearComponentBtn.js';
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [todos,setTodos] = useState([]);
  let [filterTodos,setFilterTodos] = useState(todos);


  useEffect(()=>{
    fetch('http://localhost:3001/todos')
    .then(res =>res.json())
    .then((todos)=>{
      setTodos(todos);
      setFilterTodos(todos);
    })
  },[])

  let filterBy = useCallback(
    (filter)=>{
      if(filter == 'All'){
        setFilterTodos(todos);
      }
      if(filter == 'Active'){
        setFilterTodos(todos.filter(t => !t.completed))
      }
      if(filter == 'Completed'){
        setFilterTodos(todos.filter(t => t.completed))
      }
    },[todos]
  )

  let addTodo = (todo ) => {
    //update data at server side
    fetch('http://localhost:3001/todos',{
          method : "POST",
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(todo)
    })
    setTodos(prevState => [...prevState,todo])
  }

  let deleteTodo=(todoId)=>{

    fetch(`http://localhost:3001/todos/${todoId}`,{
          method : "DELETE"
    })
    setTodos(prevState => {
      return prevState.filter((todo=>{
        return todo.id != todoId
      }));
    })
  }

  let updateTodo =(todo) =>{
    fetch(`http://localhost:3001/todos/${todo.id}`,{
      method : "PATCH",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(todo)
})
    setTodos(prevState => {
      return prevState.map((t=>{
        if(t.id == todo.id){
          return todo;
        }
        return t;
      }));
    })
  }

  let remainingCount = todos.filter(t => !t.completed).length;

  let checkAll =()=>{

    todos.forEach(t => {
      t.completed =true;
      updateTodo(t);
    })
    setTodos((prevState)=>{
      return prevState.map(t =>{
        return {...t,completed :true};
      })

    })
  }

  let clearCompleted = ()=>{
    todos.forEach(t =>{
      if(t.completed){
        deleteTodo(t.id)
      }
    })
    setTodos((prevState)=>{
      return prevState.filter(t => !t.completed)
    })
  }


  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>    
        <TodoForm addTodo={ addTodo}/>    
        <TodoList todos={filterTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>
        <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll}/>
        <div className="other-buttons-container">
        <TodoFilters filterBy={filterBy}/>
        <ClearComponentBtn clearCompleted={clearCompleted}/>
        </div>
      </div>
    </div>
  );
}

export default App;

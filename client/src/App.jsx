import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterButtons from './components/FilterButtons';
import { todoApi } from './services/todoApi';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // 加载 todos
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const todosData = await todoApi.getAll();
      setTodos(todosData);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  // 添加 todo
  const handleAdd = async (text) => {
    try {
      const newTodo = await todoApi.create(text);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  // 切换完成状态
  const handleToggle = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const updatedTodo = await todoApi.update(id, { 
        completed: !todo.completed 
      });
      
      setTodos(todos.map(t => 
        t._id === id ? updatedTodo : t
      ));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  // 删除 todo
  const handleDelete = async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  // 过滤 todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
          🚀 Todo App
        </h1>
        
        <TodoForm onAdd={handleAdd} />
        
        <FilterButtons filter={filter} setFilter={setFilter} />
        
        <TodoList 
          todos={filteredTodos} 
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        
        <div className="mt-8 text-center text-gray-600">
          <p>{todos.filter(t => !t.completed).length} tasks remaining</p>
        </div>
      </div>
    </div>
  );
}

export default App;
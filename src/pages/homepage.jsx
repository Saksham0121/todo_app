import { useState, useEffect } from 'react';
import { Trash2, Edit, Check, X, Plus, Calendar, Star, StarOff, Sun, Moon } from 'lucide-react';
import Particles from '../components/particles';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      important: false
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion status
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Toggle todo importance
  const toggleImportant = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, important: !todo.important } : todo
      )
    );
  };

  // Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editingText.trim() === '') return;
    
    setTodos(
      todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editingText } : todo
      )
    );
    
    setEditingId(null);
    setEditingText('');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'important') return todo.important;
    return true; // 'all' filter
  });

  return (
    <div className="min-h-screen">
      {/* Particles component positioned fixed behind everything */}
      <Particles 
        className="fixed inset-0 -z-10" 
        quantity={150}
        color="#4f46e5"
        size={0.6}
        staticity={40}
      />
      
      <div className="max-w-lg mx-auto p-6 relative z-10">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Task Master
            </h1>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          {/* Add new todo form */}
          <form onSubmit={addTodo} className="flex mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className={`flex-grow py-2 px-4 mr-2 border rounded-lg focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:ring-blue-500'
              }`}
            />
            <button 
              type="submit" 
              className={`py-2 px-4 rounded-lg focus:outline-none flex items-center ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
          </form>

          {/* Filter controls */}
          <div className="flex justify-center mb-6">
            <div className={`flex space-x-1 p-1 rounded-lg w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-md flex-1 transition-colors ${
                  filter === 'all' 
                    ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white shadow-sm') 
                    : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('active')} 
                className={`px-4 py-2 rounded-md flex-1 transition-colors ${
                  filter === 'active' 
                    ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white shadow-sm') 
                    : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('completed')} 
                className={`px-4 py-2 rounded-md flex-1 transition-colors ${
                  filter === 'completed' 
                    ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white shadow-sm') 
                    : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')
                }`}
              >
                Completed
              </button>
              <button 
                onClick={() => setFilter('important')} 
                className={`px-4 py-2 rounded-md flex-1 transition-colors ${
                  filter === 'important' 
                    ? (darkMode ? 'bg-gray-600 text-white shadow-sm' : 'bg-white shadow-sm') 
                    : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200')
                }`}
              >
                Important
              </button>
            </div>
          </div>

          {/* Todo list */}
          <ul className="space-y-3">
            {filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  darkMode
                    ? (todo.completed ? 'bg-gray-700 border-gray-600' : 'bg-gray-700 border-gray-600')
                    : (todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300')
                } ${todo.important ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {editingId === todo.id ? (
                  <div className="flex-grow flex items-center">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className={`flex-grow py-1 px-2 border rounded focus:outline-none focus:ring-2 ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' 
                          : 'bg-white border-gray-300 focus:ring-blue-500'
                      }`}
                      autoFocus
                    />
                    <button 
                      onClick={saveEdit} 
                      className={`ml-2 p-1 rounded-full ${darkMode ? 'text-green-400 hover:bg-gray-600' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={cancelEdit} 
                      className={`ml-1 p-1 rounded-full ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center flex-grow">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className="w-5 h-5 mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleImportant(todo.id)}
                        className={`p-1 rounded-full ${
                          todo.important 
                            ? 'text-yellow-400 hover:text-yellow-500' 
                            : (darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-500')
                        }`}
                      >
                        {todo.important ? <Star size={18} /> : <StarOff size={18} />}
                      </button>
                      <button 
                        onClick={() => startEdit(todo)}
                        className={`p-1 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className={`p-1 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {filteredTodos.length === 0 && (
              <li className={`text-center py-8 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                No tasks found
              </li>
            )}
          </ul>

          {/* Summary */}
          <div className={`mt-6 text-sm flex justify-between items-center pt-3 border-t ${
            darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-100'
          }`}>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{new Date().toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{todos.filter(todo => !todo.completed).length} tasks left</span>
            </div>
            {todos.some(todo => todo.completed) && (
              <button 
                onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                className={`hover:underline transition-colors ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
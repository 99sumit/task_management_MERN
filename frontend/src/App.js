import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks', {
        title,
        description,
        dueDate
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleEditTask = async (id) => {
    const taskToEdit = tasks.find(task => task._id === id);
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setEditingTask(id);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const response = await axios.put(`http://localhost:8000/api/tasks/${editingTask}`, {
        title,
        description,
        dueDate
      });
      const updatedTasks = tasks.map(task => {
        if (task._id === response.data._id) {
          return response.data;
        }
        return task;
      });
      setTasks(updatedTasks);
      setTitle('');
      setDescription('');
      setDueDate('');
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  return (
    <div className="App">
      <h1>Task Management Application</h1>
      <div className='boxes'>
        <h2>Add/Edit Task</h2>
        <form onSubmit={editingTask !== null ? handleUpdateTask : handleAddTask}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          <button type="submit">{editingTask !== null ? 'Update Task' : 'Add Task'}</button>
        </form>
      </div>
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <button onClick={() => handleEditTask(task._id)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

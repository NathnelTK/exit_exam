import React from 'react';
import axios from 'axios';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import './DailyPlan.css';

const DailyPlan = ({ tasks, setTasks, token }) => {
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = {
        completed: !task.completed,
        completedMinutes: !task.completed ? task.allocatedMinutes : task.completedMinutes
      };
      
      const response = await axios.put(`/api/daily-tasks/${task._id}`, updated, axiosConfig);
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateMinutes = async (task, minutes) => {
    try {
      const response = await axios.put(
        `/api/daily-tasks/${task._id}`,
        { completedMinutes: minutes },
        axiosConfig
      );
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const totalAllocated = tasks.reduce((sum, task) => sum + task.allocatedMinutes, 0);
  const totalCompleted = tasks.reduce((sum, task) => sum + task.completedMinutes, 0);
  const completionPercentage = totalAllocated > 0 ? (totalCompleted / totalAllocated) * 100 : 0;

  if (tasks.length === 0) {
    return (
      <div className="daily-plan-empty">
        <p>No tasks scheduled for today. Add courses in settings to get started!</p>
      </div>
    );
  }

  return (
    <div className="daily-plan">
      <div className="progress-summary">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="progress-text">
          {Math.round(totalCompleted)} / {totalAllocated} minutes completed
          ({Math.round(completionPercentage)}%)
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map(task => (
          <div 
            key={task._id} 
            className={`task-item ${task.completed ? 'completed' : ''}`}
            style={{ borderLeftColor: task.courseId?.color }}
          >
            <button 
              onClick={() => handleToggleComplete(task)}
              className="task-checkbox"
            >
              {task.completed ? <FiCheckCircle /> : <FiCircle />}
            </button>
            
            <div className="task-content">
              <h4>{task.courseId?.name || 'Unknown Course'}</h4>
              <div className="task-time">
                <input
                  type="number"
                  min="0"
                  max={task.allocatedMinutes}
                  value={task.completedMinutes}
                  onChange={(e) => handleUpdateMinutes(task, parseInt(e.target.value) || 0)}
                  className="time-input"
                />
                <span> / {task.allocatedMinutes} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyPlan;


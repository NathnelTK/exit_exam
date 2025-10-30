import React, { useState } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import './CourseList.css';

const CourseList = ({ courses, setCourses, token, refreshPlan }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    weight: 10,
    difficulty: 3,
    color: '#3b82f6'
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const response = await axios.put(`/api/courses/${editingCourse._id}`, formData, axiosConfig);
        setCourses(courses.map(c => c._id === editingCourse._id ? response.data : c));
      } else {
        const response = await axios.post('/api/courses', formData, axiosConfig);
        setCourses([...courses, response.data]);
      }
      
      // Regenerate plan
      await axios.post('/api/study-plans/regenerate', {}, axiosConfig);
      refreshPlan();
      
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`/api/courses/${courseId}`, axiosConfig);
      setCourses(courses.filter(c => c._id !== courseId));
      await axios.post('/api/study-plans/regenerate', {}, axiosConfig);
      refreshPlan();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      weight: course.weight,
      difficulty: course.difficulty,
      color: course.color
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', weight: 10, difficulty: 3, color: '#3b82f6' });
    setEditingCourse(null);
    setShowForm(false);
  };

  return (
    <div className="course-list">
      {courses.map(course => (
        <div key={course._id} className="course-card" style={{ borderLeftColor: course.color }}>
          <div className="course-header">
            <h3>{course.name}</h3>
            <div className="course-actions">
              <button onClick={() => handleEdit(course)} className="icon-btn">
                <FiEdit2 />
              </button>
              <button onClick={() => handleDelete(course._id)} className="icon-btn delete">
                <FiTrash2 />
              </button>
            </div>
          </div>
          <div className="course-details">
            <span className="course-weight">{course.weight} questions</span>
            <span className="course-difficulty">Difficulty: {course.difficulty}/5</span>
          </div>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="course-form">
          <input
            type="text"
            placeholder="Course name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Number of questions"
            min="1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
            required
          />
          <div className="form-row">
            <label>
              Difficulty:
              <input
                type="range"
                min="1"
                max="5"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              />
              <span>{formData.difficulty}/5</span>
            </label>
          </div>
          <div className="form-row">
            <label>
              Color:
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingCourse ? 'Update' : 'Add'} Course
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="add-course-btn">
          <FiPlus /> Add Course
        </button>
      )}
    </div>
  );
};

export default CourseList;


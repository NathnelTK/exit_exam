import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSettings, FiPlus } from 'react-icons/fi';
import CountdownTimer from '../components/CountdownTimer';
import CourseList from '../components/CourseList';
import DailyPlan from '../components/DailyPlan';
import './Dashboard.css';

const Dashboard = ({ token, customization }) => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [courses, setCourses] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchData = async () => {
    try {
      const [planRes, coursesRes, tasksRes] = await Promise.all([
        axios.get('/api/study-plans', axiosConfig),
        axios.get('/api/courses', axiosConfig),
        axios.get('/api/daily-tasks/today', axiosConfig)
      ]);
      
      setStudyPlan(planRes.data);
      setCourses(coursesRes.data);
      setTodayTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Exit - Exam Prep</h1>
        <Link to="/settings" className="settings-link">
          <FiSettings size={24} />
        </Link>
      </header>

      {!studyPlan ? (
        <div className="setup-prompt">
          <h2>Welcome to Exit!</h2>
          <p>Get started by setting up your exam plan in the settings.</p>
          <Link to="/settings" className="btn-primary">
            <FiPlus /> Set Up Your Exam
          </Link>
        </div>
      ) : (
        <div className="dashboard-content">
          <CountdownTimer examDate={studyPlan.examDate} title={studyPlan.title} />
          
          <div className={`main-content layout-${customization.layout}`}>
            <div className="section">
              <h2>Your Courses</h2>
              <CourseList 
                courses={courses} 
                setCourses={setCourses} 
                token={token}
                refreshPlan={fetchData}
              />
            </div>

            <div className="section">
              <h2>Today's Plan</h2>
              <DailyPlan 
                tasks={todayTasks} 
                setTasks={setTodayTasks} 
                token={token} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


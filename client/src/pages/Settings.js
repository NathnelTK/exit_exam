import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HexColorPicker } from 'react-colorful';
import { FiArrowLeft } from 'react-icons/fi';
import './Settings.css';

const Settings = ({ token, customization, setCustomization, setToken }) => {
  const [studyPlan, setStudyPlan] = useState({
    examDate: '',
    title: 'My Exam',
    dailyStudyHours: 4,
    notificationTime: '09:00'
  });
  const [showColorPicker, setShowColorPicker] = useState(null);
  const navigate = useNavigate();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await axios.get('/api/study-plans', axiosConfig);
        if (response.data) {
          setStudyPlan({
            examDate: response.data.examDate ? new Date(response.data.examDate).toISOString().split('T')[0] : '',
            title: response.data.title || 'My Exam',
            dailyStudyHours: response.data.dailyStudyHours || 4,
            notificationTime: response.data.notificationTime || '09:00'
          });
          if (response.data.customization) {
            setCustomization(response.data.customization);
          }
        }
      } catch (error) {
        console.error('Error fetching study plan:', error);
      }
    };
    fetchStudyPlan();
  }, []);

  const handleSaveStudyPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/study-plans', {
        ...studyPlan,
        customization
      }, axiosConfig);
      alert('Study plan saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving study plan:', error);
      alert('Failed to save study plan');
    }
  };

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  };

  const handleSubscribeNotifications = async () => {
    try {
      if (!('serviceWorker' in navigator)) return alert('Service workers not supported in this browser');
      const reg = window.swReg || (await navigator.serviceWorker.ready);
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) return alert('Missing REACT_APP_VAPID_PUBLIC_KEY');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      await axios.post('/api/notifications/subscribe', sub, axiosConfig);
      alert('Subscribed to notifications');
    } catch (e) {
      console.error('Subscribe failed', e);
      alert('Failed to subscribe to notifications');
    }
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <button onClick={() => navigate('/')} className="back-button">
          <FiArrowLeft /> Back
        </button>
        <h1>Settings</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Exam Setup</h2>
          <form onSubmit={handleSaveStudyPlan} className="settings-form">
            <div className="form-group">
              <label>Exam Title</label>
              <input
                type="text"
                value={studyPlan.title}
                onChange={(e) => setStudyPlan({ ...studyPlan, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Exam Date</label>
              <input
                type="date"
                value={studyPlan.examDate}
                onChange={(e) => setStudyPlan({ ...studyPlan, examDate: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Daily Study Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={studyPlan.dailyStudyHours}
                onChange={(e) => setStudyPlan({ ...studyPlan, dailyStudyHours: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Notification Time</label>
              <input
                type="time"
                value={studyPlan.notificationTime}
                onChange={(e) => setStudyPlan({ ...studyPlan, notificationTime: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Save Study Plan</button>
          </form>
        </section>

        <section className="settings-section">
          <h2>Customization</h2>
          
          <div className="form-group">
            <label>Theme</label>
            <div className="theme-selector">
              <button
                type="button"
                className={customization.theme === 'light' ? 'active' : ''}
                onClick={() => setCustomization({ ...customization, theme: 'light' })}
              >
                Light
              </button>
              <button
                type="button"
                className={customization.theme === 'dark' ? 'active' : ''}
                onClick={() => setCustomization({ ...customization, theme: 'dark' })}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Layout</label>
            <div className="layout-selector">
              <button
                type="button"
                className={customization.layout === 'grid' ? 'active' : ''}
                onClick={() => setCustomization({ ...customization, layout: 'grid' })}
              >
                Grid
              </button>
              <button
                type="button"
                className={customization.layout === 'list' ? 'active' : ''}
                onClick={() => setCustomization({ ...customization, layout: 'list' })}
              >
                List
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Primary Color</label>
            <div className="color-picker-wrapper">
              <div
                className="color-preview"
                style={{ backgroundColor: customization.primaryColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
              />
              {showColorPicker === 'primary' && (
                <div className="color-picker-popover">
                  <HexColorPicker
                    color={customization.primaryColor}
                    onChange={(color) => setCustomization({ ...customization, primaryColor: color })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Background Color</label>
            <div className="color-picker-wrapper">
              <div
                className="color-preview"
                style={{ backgroundColor: customization.backgroundColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
              />
              {showColorPicker === 'background' && (
                <div className="color-picker-popover">
                  <HexColorPicker
                    color={customization.backgroundColor}
                    onChange={(color) => setCustomization({ ...customization, backgroundColor: color })}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notifications</h2>
          <p>Enable daily push notifications at your configured time.</p>
          <button type="button" className="btn-primary" onClick={handleSubscribeNotifications}>Enable Push Notifications</button>
        </section>
      </div>
    </div>
  );
};

export default Settings;


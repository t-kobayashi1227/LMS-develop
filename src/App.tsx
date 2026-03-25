import React, { useState } from 'react';
import { currentUser, adminUser } from './mockData';
import Login from './views/Login';
import Layout from './components/Layout';
import StudentDashboard from './views/student/Dashboard';
import CourseList from './views/student/CourseList';
import LessonView from './views/student/LessonView';
import AdminDashboard from './views/admin/Dashboard';
import AdminUserList from './views/admin/UserList';
import AdminCourseList from './views/admin/CourseList';

export default function App() {
  const [role, setRole] = useState<'student' | 'admin' | null>(null);
  const [currentView, setCurrentView] = useState<string>('');

  const handleLogin = (selectedRole: 'student' | 'admin') => {
    setRole(selectedRole);
    setCurrentView(selectedRole === 'student' ? 'dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentView('');
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  const user = role === 'student' ? currentUser : adminUser;

  if (currentView === 'lesson') {
    return <LessonView onNavigate={setCurrentView} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard onNavigate={setCurrentView} />;
      case 'courses':
        return <CourseList onNavigate={setCurrentView} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={setCurrentView} />;
      case 'admin-users':
        return <AdminUserList onNavigate={setCurrentView} />;
      case 'admin-courses':
        return <AdminCourseList onNavigate={setCurrentView} />;
      case 'messages':
      case 'admin-messages':
      case 'admin-analytics':
        return (
          <div className="flex-1 flex items-center justify-center p-8 h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-on-surface font-headline">Coming Soon</h2>
              <p className="text-secondary">この機能は現在開発中です。</p>
            </div>
          </div>
        );
      default:
        return role === 'student' ? <StudentDashboard onNavigate={setCurrentView} /> : <AdminDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
}

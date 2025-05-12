import { useState, useEffect } from 'react';
import CandidatesContent from './Candidates/CandidatesComponent';
import styles from '../../pages/Dashboard/Dashboard.module.css';
import EmployeeManagement from './Employees/Employees';
import AttendanceManagement from './Attendance/Attendance';
import LeavesManagement from './Leaves/Leaves';
import LogoutModal from './Logout/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function MainContent({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previousTab, setPreviousTab] = useState('Candidates');

  useEffect(() => {
    if (activeTab !== 'Logout') {
      setPreviousTab(activeTab);
    }
  }, [activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCancelLogout = () => {
    onTabChange(previousTab);
  };

  const renderContentForTab = (tab) => {
    switch (tab) {
      case 'Candidates':
        return <CandidatesContent />;
      case 'Employees':
        return <EmployeeManagement />;
      case 'Attendance':
        return <AttendanceManagement />;
      case 'Leaves':
        return <LeavesManagement />;
      default:
        return (
          <div className={styles.placeholderContent}>
            <h2 className={styles.placeholderTitle}>{tab} Content</h2>
            <p className={styles.placeholderText}>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.contentContainer}>
        {renderContentForTab(activeTab === 'Logout' ? previousTab : activeTab)}
        
        {activeTab === 'Logout' && (
          <LogoutModal
            isOpen={true}
            onClose={handleCancelLogout}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
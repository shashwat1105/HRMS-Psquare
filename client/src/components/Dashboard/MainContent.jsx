import CandidatesContent from './Candidates/CandidatesComponent';
import styles from '../../pages/Dashboard/Dashboard.module.css';
import EmployeeManagement from './Employees/Employees';
import AttendanceManagement from './Attendance/Attendance';
import LeavesManagement from './Leaves/Leaves';

export default function MainContent({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'Candidates':
        return <CandidatesContent />;
      case 'Employees':
        return <EmployeeManagement/>
      case 'Attendance':
        return <AttendanceManagement/>
      case 'Leaves':
        return <LeavesManagement/>
      case 'Logout':
      default:
        return (
          <div className={styles.placeholderContent}>
            <h2 className={styles.placeholderTitle}>{activeTab} Content</h2>
            <p className={styles.placeholderText}>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.contentContainer}>
        {renderContent()}
      </div>
    </div>
  );
}
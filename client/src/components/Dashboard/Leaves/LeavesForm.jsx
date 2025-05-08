import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, ChevronDown } from 'lucide-react';
import styles from './LeavesForm.module.css';

export default function LeaveForm() {
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statusOptions] = useState(['Approved', 'Pending', 'Rejected']);
  
  // Leave data
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: 'Jane Cooper',
      position: 'Full Time Designer',
      date: '10/09/24',
      reason: 'Visiting House',
      status: 'Approved',
      hasDocuments: true,
    },
    {
      id: 2,
      name: 'Cody Fisher',
      position: 'Senior Backend Developer',
      date: '8/09/24',
      reason: 'Visiting House',
      status: 'Approved',
      hasDocuments: false,
    },
  ]);

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get the current month name
  const currentMonthName = monthNames[currentMonth];
  
  // Get days in current month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  
  // Navigation handlers
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Check if a day has any leave approvals
  const hasLeaveOnDate = (day) => {
    return leaveRequests.some(leave => {
      const [leaveDay, leaveMonth, leaveYear] = leave.date.split('/').map(Number);
      return leaveDay === day && (leaveMonth - 1) === currentMonth && 
             (leaveYear + 2000) === currentYear;
    });
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const blanks = [];
    
    // Add blank spaces for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td key={`blank-${i}`} className={`${styles.calendarDay} ${styles.empty}`}></td>);
    }
    
    // Add the days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const hasLeave = hasLeaveOnDate(d);
      
      days.push(
        <td key={d} className={`${styles.calendarDay} ${hasLeave ? styles.hasLeave : ''}`}>
          {d}
          {hasLeave && <div className={styles.leaveIndicator}></div>}
        </td>
      );
    }
    
    return [...blanks, ...days];
  };

  // Generate rows for the calendar
  const generateCalendarRows = () => {
    const allDays = generateCalendarDays();
    const rows = [];
    let cells = [];
    
    allDays.forEach((day, i) => {
      if (i % 7 === 0 && cells.length > 0) {
        rows.push(<tr key={i}>{cells}</tr>);
        cells = [];
      }
      cells.push(day);
      
      if (i === allDays.length - 1) {
        // Add any remaining cells
        rows.push(<tr key={i}>{cells}</tr>);
      }
    });
    
    return rows;
  };

  // Toggle dropdown for status change
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  
  // Change status of a leave request
  const changeStatus = (id, newStatus) => {
    setLeaveRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id ? {...request, status: newStatus} : request
      )
    );
    setOpenDropdownId(null);
  };

  return (
    <div className={styles.leaveManagementContainer}>
      <div className={styles.appliedLeavesPanel}>
        <div className={styles.panelHeader}>
          <h2>Applied Leaves</h2>
        </div>
        
        <div className={styles.tableHeader}>
          <div className={`${styles.column} ${styles.profileColumn}`}>Profile</div>
          <div className={`${styles.column} ${styles.nameColumn}`}>Name</div>
          <div className={`${styles.column} ${styles.dateColumn}`}>Date</div>
          <div className={`${styles.column} ${styles.reasonColumn}`}>Reason</div>
          <div className={`${styles.column} ${styles.statusColumn}`}>Status</div>
          <div className={`${styles.column} ${styles.docsColumn}`}>Docs</div>
        </div>
        
        <div className={styles.leavesTable}>
          {leaveRequests.map((leave) => (
            <div key={leave.id} className={styles.leaveRow}>
              <div className={`${styles.column} ${styles.profileColumn}`}>
                <div className={styles.avatar}>{leave.name.charAt(0)}</div>
              </div>
              <div className={`${styles.column} ${styles.nameColumn}`}>
                <div className={styles.employeeName}>{leave.name}</div>
                <div className={styles.employeePosition}>{leave.position}</div>
              </div>
              <div className={`${styles.column} ${styles.dateColumn}`}>{leave.date}</div>
              <div className={`${styles.column} ${styles.reasonColumn}`}>{leave.reason}</div>
              <div className={`${styles.column} ${styles.statusColumn}`}>
                <div className={styles.dropdownContainer}>
                  <button 
                    className={`${styles.statusButton} ${styles[leave.status.toLowerCase()]}`}
                    onClick={() => toggleDropdown(leave.id)}
                  >
                    {leave.status} {openDropdownId === leave.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {openDropdownId === leave.id && (
                    <div className={styles.statusDropdown}>
                      {statusOptions.map((status) => (
                        <div 
                          key={status} 
                          className={`${styles.dropdownItem} ${styles[status.toLowerCase()]}`}
                          onClick={() => changeStatus(leave.id, status)}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${styles.column} ${styles.docsColumn}`}>
                {leave.hasDocuments && (
                  <a href="#" className={styles.docLink}>
                    <FileText size={20} className={styles.docIcon} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.leaveCalendarPanel}>
        <div className={styles.panelHeader}>
          <h2>Leave Calendar</h2>
        </div>
        
        <div className={styles.calendarNav}>
          <button className={styles.navButton} onClick={goToPreviousMonth}>
            <ChevronLeft size={16} />
          </button>
          <span className={styles.currentMonth}>{currentMonthName}, {currentYear}</span>
          <button className={styles.navButton} onClick={goToNextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <table className={styles.calendar}>
          <thead>
            <tr>
              <th>S</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>T</th>
              <th>F</th>
              <th>S</th>
            </tr>
          </thead>
          <tbody>
            {generateCalendarRows()}
          </tbody>
        </table>
        
        <div className={styles.approvedLeavesSection}>
          <h3>Approved Leaves</h3>
          
          {leaveRequests
            .filter(leave => leave.status === 'Approved')
            .map((leave) => (
              <div key={leave.id} className={styles.approvedLeaveItem}>
                <div className={styles.avatar}>{leave.name.charAt(0)}</div>
                <div className={styles.employeeInfo}>
                  <div className={styles.employeeName}>{leave.name}</div>
                  <div className={styles.employeePosition}>{leave.position}</div>
                </div>
                <div className={styles.leaveDate}>{leave.date}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from './LeavesForm.module.css';
import { updateLeaveStatus } from '../../../store/slices/leaveSlice';

export default function LeaveForm({ leaveRequests, onStatusChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statusOptions] = useState(['Approved', 'Pending', 'Rejected']);
  const dispatch = useDispatch();

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
      if (!leave.date) return false;
      
      // Parse the date based on your format (assuming DD/MM/YY)
      const [leaveDay, leaveMonth, leaveYear] = leave.date.split('/').map(Number);
      return (
        leaveDay === day && 
        (leaveMonth - 1) === currentMonth && 
        (leaveYear + 2000) === currentYear
      );
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
  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateLeaveStatus({ id, status: newStatus })).unwrap();
      toast.success('Leave status updated successfully');
      onStatusChange(id, newStatus); // Notify parent component
      setOpenDropdownId(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update leave status');
    }
  };

  // Format date for display (DD/MM/YY)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.leaveManagementContainer}>
      <div className={styles.appliedLeavesPanel}>
        <div className={styles.panelHeader}>
          <h2>Applied Leaves</h2>
        </div>
        
        <div className={styles.tableHeader} style={{ backgroundColor: '#6b46c1' }}>
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
                <div className={styles.avatar}>
                  {leave.employee?.name?.charAt(0) || '?'}
                </div>
              </div>
              <div className={`${styles.column} ${styles.nameColumn}`}>
                <div className={styles.employeeName}>{leave.employee?.name || 'Unknown'}</div>
                <div className={styles.employeePosition}>{leave.designation || 'N/A'}</div>
              </div>
              <div className={`${styles.column} ${styles.dateColumn}`}>
                {formatDate(leave.date)}
              </div>
              <div className={`${styles.column} ${styles.reasonColumn}`}>{leave.reason || 'N/A'}</div>
              <div className={`${styles.column} ${styles.statusColumn}`}>
                <div className={styles.dropdownContainer}>
                  <button 
                    className={`${styles.statusButton} ${styles[leave.status?.toLowerCase()] || styles.pending}`}
                    onClick={() => toggleDropdown(leave._id)}
                  >
                    {leave.status || 'Pending'} 
                    {openDropdownId === leave._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {openDropdownId === leave._id && (
                    <div className={styles.statusDropdown}>
                      {statusOptions.map((status) => (
                        <div 
                          key={status} 
                          className={`${styles.dropdownItem} ${styles[status.toLowerCase()]}`}
                          onClick={() => handleStatusChange(leave._id, status)}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${styles.column} ${styles.docsColumn}`}>
                {leave.docs && (
                  <a 
                    href={leave.docs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.docLink}
                  >
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
            <tr style={{ backgroundColor: '#6b46c1', color: 'white' }}>
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
              <div key={leave._id} className={styles.approvedLeaveItem}>
                <div className={styles.avatar}>
                  {leave.employee?.name?.charAt(0) || '?'}
                </div>
                <div className={styles.employeeInfo}>
                  <div className={styles.employeeName}>{leave.employee?.name || 'Unknown'}</div>
                  <div className={styles.employeePosition}>{leave.designation || 'N/A'}</div>
                </div>
                <div className={styles.leaveDate}>{formatDate(leave.date)}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
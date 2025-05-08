import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search, Plus, FileText } from "lucide-react";
import styles from "./Leaves.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import DataTable from "../Candidates/comps/DataTable";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
 

export default function LeavesManagement() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const statusOptions = ["All", "Pending", "Approved", "Rejected"];

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: 'Jane Copper',
      position: 'Intern',
      date: '15/09/24',
      reason: 'Family function',
      status: 'Pending',
      avatar: '/api/placeholder/32/32',
      hasDocs: false
    },
    {
      id: 2,
      name: 'Arlene McCoy',
      position: 'Full Time',
      date: '10/09/24',
      reason: 'Medical leave',
      status: 'Approved',
      avatar: '/api/placeholder/32/32',
      hasDocs: true
    },
    {
      id: 3,
      name: 'Cody Fisher',
      position: 'Senior',
      date: '08/09/24',
      reason: 'Personal',
      status: 'Approved',
      avatar: '/api/placeholder/32/32',
      hasDocs: false
    }
  ]);

  // Filter leaves based on search and status
  const filteredLeaves = leaves.filter(leave => {
    if (statusFilter !== "All" && leave.status !== statusFilter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        leave.name.toLowerCase().includes(lowerSearch) ||
        leave.position.toLowerCase().includes(lowerSearch) ||
        leave.reason.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  });

  // Calendar navigation
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Generate calendar days with leave counts
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Count leaves per day
    const leaveCounts = {};
    leaves.forEach(leave => {
      if (leave.status === 'Approved') {
        const [day, leaveMonth, leaveYear] = leave.date.split('/').map(Number);
        if (leaveMonth === month + 1 && leaveYear === year) {
          leaveCounts[day] = (leaveCounts[day] || 0) + 1;
        }
      }
    });

    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarEmptyDay}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasLeaves = leaveCounts[day] > 0;
      days.push(
        <div 
          key={`day-${day}`} 
          className={`${styles.calendarDay} ${hasLeaves ? styles.hasLeaves : ''}`}
        >
          <span className={styles.dayNumber}>{day}</span>
          {hasLeaves && (
            <span className={styles.leaveCount}>{leaveCounts[day]}</span>
          )}
        </div>
      );
    }

    return days;
  };

  // Format month/year display
  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get approved leaves for the sidebar
  const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');

  return (
    <div className={styles.container}>
      <Navbar title="Leaves" />
      
      {isMobile && (
        <div className={styles.mobileFilterToggle}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={styles.filterToggleButton}
          >
            <Filter className={styles.filterIcon} />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      )}
      
      <FilterOptions
        isMobile={isMobile}
        isFilterOpen={isFilterOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        hidePositionFilter={true}
        addButtonText="Add Leave"
        onAddClick={() => setIsModalOpen(true)}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.leavesTable}>
          <DataTable
            columns={["Sr. no","Profile", "Name", "Date", "Reason", "Status", "Docs"]}
            data={filteredLeaves.map(leave => ({
              id: leave.id,
              profile: (
                <img 
                  src={leave.avatar} 
                  alt={leave.name} 
                  className={styles.employeeAvatar} 
                />
              ),
              name: leave.name,
              date: leave.date,
              reason: leave.reason,
              status: (
                <span className={`${styles.statusBadge} ${
                  leave.status === 'Approved' ? styles.approved : 
                  leave.status === 'Pending' ? styles.pending : 
                  styles.rejected
                }`}>
                  {leave.status}
                </span>
              ),
              docs: leave.hasDocs ? (
                <a href="#" className={styles.docsLink}>
                  <FileText size={16} />
                </a>
              ) : '--'
            }))}
          />
        </div>
        
        <div className={styles.calendarSidebar}>
          <div className={styles.calendarSection}>
            <h3 className={styles.sectionTitle}>Leave Calendar</h3>
            <div className={styles.calendarHeader}>
              <button onClick={prevMonth} className={styles.calendarNavButton}>
                <ChevronLeft size={16} />
              </button>
              <span className={styles.calendarMonth}>{formatMonthYear()}</span>
              <button onClick={nextMonth} className={styles.calendarNavButton}>
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className={styles.calendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className={styles.calendarDayHeader}>{day}</div>
              ))}
              {generateCalendarDays()}
            </div>
          </div>
          
          <div className={styles.approvedLeaves}>
            <h3 className={styles.sectionTitle}>Approved Leaves</h3>
            {approvedLeaves.map(leave => (
              <div key={leave.id} className={styles.approvedLeaveItem}>
                <img src={leave.avatar} alt={leave.name} className={styles.leaveAvatar} />
                <div className={styles.leaveInfo}>
                  <div className={styles.leaveName}>{leave.name}</div>
                  <div className={styles.leaveDate}>{leave.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newLeave) => {
          const newId = Math.max(...leaves.map(l => l.id)) + 1;
          setLeaves([...leaves, { ...newLeave, id: newId, status: 'Pending' }]);
          setIsModalOpen(false);
        }}
        title="Leave Application"
        fields={[
          { name: 'name', label: 'Employee Name', type: 'text', required: true },
          { name: 'position', label: 'Position', type: 'text', required: true },
          { name: 'date', label: 'Leave Date', type: 'date', required: true },
          { name: 'reason', label: 'Reason', type: 'textarea', required: true },
          { 
            name: 'document', 
            label: 'Supporting Document', 
            type: 'file', 
            accept: '.pdf,.doc,.docx,.jpg,.png' 
          }
        ]}
      />
    </div>
  );
}
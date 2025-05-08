import { useState } from "react";
import { MoreVertical, Filter } from "lucide-react";
import styles from "./Attendance.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import DataTable from "../Candidates/comps/DataTable";

export default function AttendanceManagement() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusOptions = ["Present", "Absent", "All"];
  const attendanceStatusOptions = ["Present", "Absent"];

  const [attendance, setAttendance] = useState([
    {
      id: 1,
      name: 'Jane Copper',
      position: 'Intern',
      department: 'Designer',
      task: 'UI Design',
      status: 'Present',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      name: 'Arlene McCoy',
      position: 'Full Time',
      department: 'Designer',
      task: 'Wireframing',
      status: 'Present',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      name: 'Cody Fisher',
      position: 'Senior',
      department: 'Backend Development',
      task: 'API Development',
      status: 'Absent',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      name: 'Janney Wilson',
      position: 'Junior',
      department: 'Backend Development',
      task: 'Database Optimization',
      status: 'Present',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 5,
      name: 'Leslie Alexander',
      position: 'Team Lead',
      department: 'Human Resource',
      task: 'Recruitment',
      status: 'Present',
      avatar: '/api/placeholder/32/32'
    }
  ]);

  const filteredAttendance = attendance.filter(record => {
    if (statusFilter && statusFilter !== "All" && record.status !== statusFilter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        record.name.toLowerCase().includes(lowerSearch) ||
        record.position.toLowerCase().includes(lowerSearch) ||
        record.task.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  });

  const handleStatusChange = (id, newStatus) => {
    setAttendance(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, status: newStatus } 
          : record
      )
    );
  };

  return (
    <div className={styles.container}>
      <Navbar title="Attendance" />

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
        addButtonText="Add Record"
        onAddClick={() => console.log("Add new attendance record")}
      />

      <DataTable
        columns={["Sr. no", "Profile", "Employee Name", "Position", "Task", "Status", "Action"]}
        statusOptions={attendanceStatusOptions} 
        onStatusChange={handleStatusChange}
        data={filteredAttendance.map((record, index) => ({
          id: record.id,
          profile: (
            <div className={styles.avatarCell}>
              <img 
                src={record.avatar} 
                alt={record.name} 
                className={styles.employeeAvatar} 
              />
            </div>
          ),
          name: record.name,
          position: record.position,
          task: record.task,
          status: record.status,  // pass raw string, not JSX
          action: (               // consistent key with DataTable usage
            <button className={styles.actionButton}>
              <MoreVertical className={styles.actionIcon} />
            </button>
          ),
        }))}
      />
    </div>
  );
}
 
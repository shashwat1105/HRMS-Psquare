import React, { useState, useEffect, useMemo } from "react";
import { Filter, MoreVertical } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { toast } from "react-hot-toast";
import styles from "./Attendance.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import DataTable from "../Candidates/comps/DataTable";
import { 
  getAllAttendance, 
  updateAttendanceStatus 
} from "../../../store/slices/attendanceSlice";

const statusOptions = ["Present", "Absent", "Medical Leave", "Work From Home"];

export default function AttendanceManagement() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const dispatch = useDispatch();
  

  const { attendance, loading } = useSelector(
    (state) => ({
      attendance: state.attendance?.attendance || [],
      loading: state.attendance?.loading || false
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);


  const filteredAttendance = useMemo(() => {
    if (!attendance || attendance.length === 0) return [];
    
    return attendance.filter(record => {
      if (!record || !record.employee) return false;
      
      if (statusFilter && record.status !== statusFilter) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (record.employee.name?.toLowerCase().includes(searchLower)) ||
          (record.employee.position?.toLowerCase().includes(searchLower)) ||
          (record.employee.department?.toLowerCase().includes(searchLower)) ||
          (record.status?.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [attendance, statusFilter, searchTerm]);


  const tableData = useMemo(() => {
    return filteredAttendance.map((record, index) => {
      const employee = record.employee || {};
      return {
        id: record._id,
        "Sr no.": index + 1,
        "Profile": employee.photo ? (
          <img 
            src={employee.photo} 
            alt={employee.name}
            className={styles.employeeAvatar}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {employee.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        ),
        "Employee Name": employee.name || 'Unknown',
        "Position": employee.position || 'N/A',
        "Department": employee.department || 'N/A',
        "Status": record.status || 'Present',
        "Action": true
      };
    });
  }, [filteredAttendance]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateAttendanceStatus({ id, status: newStatus })).unwrap();
      toast.success("Attendance status updated");
      await dispatch(getAllAttendance());
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const actionItems = [
    
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }
  
  if (!loading && attendance.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No attendance records found</p>
        <button 
          onClick={() => dispatch(getAllAttendance())}
          className={styles.refreshButton}
        >
          Refresh Data
        </button>
      </div>
    );
  }

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
        statusOptions={["All", ...statusOptions]}
        onReset={() => {
          setStatusFilter("");
          setSearchTerm("");
        }}
        hidePositionFilter={true}
        hideAddButton={true}
      />
      
      <DataTable
        columns={["Sr no.", "Profile", "Employee Name", "Position", "Department", "Status", "Action"]}
        data={tableData}
        onStatusChange={handleStatusChange}
        statusOptions={statusOptions}
        actionItems={actionItems}
      />
    </div>
  );
}
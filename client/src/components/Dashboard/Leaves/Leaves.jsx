import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import styles from "./Leaves.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import LeaveForm from "./LeavesForm";
import AddLeaveModal from "./AddLeaveModal/AddLeaveModal";
import { 
  createLeave, 
  getAllLeaves, 
  updateLeaveStatus 
} from "../../../store/slices/leaveSlice";
import { getAllEmployees } from "../../../store/slices/employeeSlice";

export default function LeavesPage() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ["Approved", "Pending", "Rejected"];
  
  const { leaveRequests, isLoading ,employees} = useSelector(
    (state) => ({
      leaveRequests: state.leave.leaveRequests || [],
      isLoading: state.leave.isLoading || false,
      employees: state.employee.employees || [] 
    })
  );

  
  useEffect(() => {
    dispatch(getAllLeaves());
    dispatch(getAllEmployees())
  }, [dispatch]);

  
  const filteredLeaves = leaveRequests.filter(leave => {
    if (!leave.employee) return false;
    if (statusFilter && leave.status !== statusFilter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        leave.employee.name.toLowerCase().includes(lowerSearch) ||
        (leave.designation?.toLowerCase().includes(lowerSearch)) ||
        (leave.reason?.toLowerCase().includes(lowerSearch))
      );
    }
    return true;
  });

 
const handleSaveLeave = async (leaveData) => {
  try {
    const formData = new FormData();
    formData.append('employee', leaveData.employee);
    formData.append('designation', leaveData.designation);
    formData.append('leaveDate', leaveData.leaveDate);
    formData.append('reason', leaveData.reason);
    
    if (leaveData.document) {
      formData.append('docs', leaveData.document);
    }

    await dispatch(createLeave(formData)).unwrap();
    toast.success("Leave request submitted successfully");
    return true; 
  } catch (error) {
    toast.error(error.message || "Failed to submit leave request");
    return false; 
  }
};


  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await dispatch(updateLeaveStatus({
        id: leaveId,
        status: newStatus
      })).unwrap();
      
      toast.success("Leave status updated successfully");
      dispatch(getAllLeaves()); 
    } catch (error) {
      toast.error(error.message || "Failed to update leave status");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading leave data...</p>
      </div>
    );
  }

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
      
      <LeaveForm 
  leaveRequests={filteredLeaves} 
  onStatusChange={handleStatusChange} 
/>

<AddLeaveModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onCreateSuccess={() => {
        setIsModalOpen(false);
        dispatch(getAllLeaves());
      }}
      handleSaveLeave={handleSaveLeave}
    />
    </div>
  );
}
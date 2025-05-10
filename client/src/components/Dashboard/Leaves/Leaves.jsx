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

export default function LeavesPage() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ["Approved", "Pending", "Rejected"];
  
  // Get leaves and loading state from Redux store
  const { leaveRequests, isLoading } = useSelector(
    (state) => ({
      leaveRequests: state.leave.leaveRequests || [],
      isLoading: state.leave.isLoading || false,
    })
  );

  // Fetch leaves on component mount
  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  // Filter leaves based on search and status
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

  // Handle saving new leave
  const handleSaveLeave = async (newLeaveData) => {
    try {
      await dispatch(createLeave({
        employee: newLeaveData.employee.id,
        designation: newLeaveData.employee.position,
        leaveDate: newLeaveData.leaveDate,
        reason: newLeaveData.reason,
        docs: newLeaveData.document
      })).unwrap();
      
      toast.success("Leave request submitted successfully");
      setIsModalOpen(false);
      dispatch(getAllLeaves()); // Refresh leaves list
    } catch (error) {
      toast.error(error.message || "Failed to submit leave request");
    }
  };

  // Handle status change
  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await dispatch(updateLeaveStatus({
        id: leaveId,
        status: newStatus
      })).unwrap();
      
      toast.success("Leave status updated successfully");
      dispatch(getAllLeaves()); // Refresh leaves list
    } catch (error) {
      toast.error(error.message || "Failed to update leave status");
    }
  };

  // Mobile detection
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
/>
    </div>
  );
}
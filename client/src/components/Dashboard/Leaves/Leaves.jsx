import { useState, useEffect } from "react";
import { Filter, Plus } from "lucide-react";
import styles from "./Leaves.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import LeaveForm from "./LeavesForm";
import AddLeaveModal from "./AddLeaveModal/AddLeaveModal";

export default function LeavesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ["Approved", "Pending", "Rejected"];

  // Sample leave data
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Jane Cooper",
      position: "Full Time Designer",
      date: "10/09/24",
      reason: "Visiting House",
      status: "Approved",
      type: "Annual",
      hasDocuments: true,
    },
    {
      id: 2,
      name: "Cody Fisher",
      position: "Senior Backend Developer",
      date: "08/09/24",
      reason: "Family Emergency",
      status: "Pending",
      type: "Sick",
      hasDocuments: false,
    },
  ]);

  // Sample employees data - you might want to fetch this from your API
  const [employees] = useState([
    { id: 1, name: "Jane Cooper", position: "Full Time Designer" },
    { id: 2, name: "Cody Fisher", position: "Senior Backend Developer" },
    // Add more employees as needed
  ]);

  const filteredLeaves = leaves.filter(leave => {
    if (statusFilter && leave.status !== statusFilter) return false;
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

  const handleSaveLeave = (newLeave) => {
    const newId = leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 1;
    setLeaves(prev => [...prev, { 
      id: newId,
      name: newLeave.employee.name,
      position: newLeave.employee.position,
      date: newLeave.leaveDate,
      reason: newLeave.reason,
      status: "Pending", // Default status
      type: "Annual", // Default type
      hasDocuments: newLeave.document ? true : false
    }]);
  };

  const handleStatusChange = (leaveId, newStatus) => {
    setLeaves(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: newStatus } 
          : leave
      )
    );
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        onSave={handleSaveLeave}
        employees={employees}
      />
    </div>
  );
}
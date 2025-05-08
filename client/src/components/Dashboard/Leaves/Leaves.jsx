import { useState, useEffect } from "react";
import { Filter, Plus } from "lucide-react";
import styles from "./Leaves.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import LeaveForm from "./LeavesForm";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
 

export default function LeavesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ["Approved", "Pending", "Rejected"];
  // const leaveTypeOptions = ["Annual", "Sick", "Maternity", "Paternity", "Unpaid"];

  // Sample leave data - you might want to lift this state up
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

  const filteredLeaves = leaves.filter(leave => {
    if (statusFilter && leave.status !== statusFilter) return false;
    // if (leaveTypeFilter && leave.type !== leaveTypeFilter) return false;
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
      ...newLeave,
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
        hidePositionFilter={true} // This will now properly hide the position filter
        addButtonText="Add Leave"
        onAddClick={() => setIsModalOpen(true)}
      />
      
      <LeaveForm
        leaveRequests={filteredLeaves}
        onStatusChange={handleStatusChange}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLeave}
        title="Leave"
        mode="add"
        fields={[
          { name: 'name', label: 'Employee Name', type: 'text', required: true },
          { name: 'position', label: 'Position', type: 'text', required: true },
          // { 
          //   name: 'type', 
          //   label: 'Leave Type', 
          //   type: 'select',
          //   options: leaveTypeOptions,
          //   required: true 
          // },
          { name: 'date', label: 'Leave Date', type: 'date', required: true },
          { name: 'reason', label: 'Reason', type: 'textarea', required: true },
          { 
            name: 'document', 
            label: 'Supporting Document', 
            type: 'file', 
            accept: '.pdf,.doc,.docx,.jpg,.png',
            required: false 
          }
        ]}
      />
    </div>
  );
}
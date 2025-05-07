import { useState, useEffect } from "react";
import { Filter, Download, Trash2 } from "lucide-react";
import styles from "./Candidates.module.css";
import Navbar from "./comps/NavBar";
import FilterOptions from "./comps/FilterOptions";
import DataTable from "./comps/DataTable";
// import CandidateModal from "../AddCandidateModal/AddCandidateModal";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
 

export default function CandidatesTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // or "edit"
const [editingCandidate, setEditingCandidate] = useState({});


  const statusOptions = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
  const positionOptions = ["Developer", "Designer", "Human Resource"];

  const [candidates, setCandidates] = useState([
    {
      id: "01",
      name: "Jacob William",
      email: "jacob.william@example.com",
      phone: "(252) 555-0111",
      position: "Senior Developer",
      status: "New",
      experience: "1+"
    },
    // ... other candidates
  ]);

  const filteredCandidates = candidates.filter(candidate => {
    if (statusFilter && candidate.status !== statusFilter) return false;
    if (positionFilter && !candidate.position.includes(positionFilter)) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(lowerSearch) ||
        candidate.email.toLowerCase().includes(lowerSearch) ||
        candidate.position.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  });

  const handleSaveCandidate = (newCandidate) => {
    const newId = String(candidates.length + 1).padStart(2, '0');
    setCandidates(prev => [...prev, { id: newId, ...newCandidate }]);
  };

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus } 
          : candidate
      )
    );
  };

  const actionItems = [
    {
      label: "Download Resume",
      icon: Download,
      handler: (id) => console.log("Download", id)
    },
    {
      label: "Delete Candidate",
      icon: Trash2,
      handler: (id) => {
        setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      }
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <Navbar title="Candidates" />
      
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
        positionFilter={positionFilter}
        setPositionFilter={setPositionFilter}
        statusOptions={statusOptions}
        positionOptions={positionOptions}
        addButtonText="Add Candidate"
        onAddClick={() => setIsModalOpen(true)}
      />
      
      <DataTable
        columns={["Sr no.", "Name", "Email", "Phone", "Position", "Status", "Experience", "Action"]}
        data={filteredCandidates.map(candidate => ({
          ...candidate,
          actions: true
        }))}
        onStatusChange={handleStatusChange}
        statusOptions={statusOptions}
        actionItems={actionItems}
      />

<ModalForm
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSaveCandidate}
  title="Candidate"
  mode={modalMode} // "add" or "edit"
  initialData={editingCandidate} // data when in edit mode
  fields={[
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { 
      name: 'position', 
      label: 'Position', 
      type: 'select',
      options: ['Developer', 'Designer', 'HR'],
      required: true 
    },
    { name: 'experience', label: 'Experience', type: 'text', required: true },
    { 
      name: 'resume', 
      label: 'Resume', 
      type: 'file', 
      accept: '.pdf,.doc,.docx',
      required: true 
    },
    { 
      name: 'declaration', 
      label: 'I hereby declare that the above information is true to the best of my knowledge and belief',
      type: 'checkbox',
      required: true 
    }
  ]}
/>
    </div>
  );
}
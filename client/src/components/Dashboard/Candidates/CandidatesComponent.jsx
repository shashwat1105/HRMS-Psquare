import { useState, useEffect } from "react";
import { Filter, Download, Trash2 } from "lucide-react";
import styles from "./Candidates.module.css";
import Navbar from "./comps/NavBar";
import FilterOptions from "./comps/FilterOptions";
import DataTable from "./comps/DataTable";
// import CandidateModal from "../AddCandidateModal/AddCandidateModal";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
import { addCandidate, deleteCandidate, getAllCandidates, updateCandidateStatus } from "../../../store/slices/candidateSlice";
import { useDispatch, useSelector } from "react-redux";
 

export default function CandidatesTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // or "edit"
const [editingCandidate, setEditingCandidate] = useState({});
const dispatch=useDispatch();
const { candidates = [],loading } = useSelector((state) => state.candidate) || {};


  const statusOptions = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
  const positionOptions = ["Developer", "Designer", "Human Resource"];


  useEffect(() => {

    dispatch(getAllCandidates())
    
  }, []);
  console.log(candidates)

 

  const filteredCandidates = (candidates || []).filter(candidate => {
    if (!candidate) return false;
    
    // Convert all values to lowercase for case-insensitive comparison
    const candidateStatus = candidate.status?.toLowerCase() || '';
    const candidatePosition = candidate.position?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    const statusFilterLower = statusFilter.toLowerCase();
    const positionFilterLower = positionFilter.toLowerCase();
  
    // Status filter (exact match)
    if (statusFilter && candidateStatus !== statusFilterLower) {
      return false;
    }
  
    // Position filter (exact match)
    if (positionFilter && candidatePosition !== positionFilterLower) {
      return false;
    }
  
    // Search term (partial match in multiple fields)
    if (searchTerm) {
      return (
        candidate.name?.toLowerCase().includes(searchTermLower) ||
        candidate.email?.toLowerCase().includes(searchTermLower) ||
        candidatePosition.includes(searchTermLower)
      );
    }
  
    return true;
  });
  
  const tableData = filteredCandidates.map((candidate, index) => ({
    id: candidate._id || index,  // Make sure each row has unique ID
    "Sr no.": index + 1,
    "Name": candidate?.name || '',
    "Email": candidate?.email || '',
    "Phone": candidate?.phone || '',
    "Position": candidate?.position || '',
    "Status": candidate?.status || 'New',
    "Experience": candidate?.experience || '',
    // "Action": true
  }));

  const handleSaveCandidate = async (newCandidate) => {
    const formData = new FormData();
    
    Object.keys(newCandidate).forEach(key => {
      if (key === 'resume' && newCandidate[key] instanceof File) {
        formData.append(key, newCandidate[key]);
      } else if (key !== 'declaration') {
        formData.append(key, newCandidate[key]);
      }
    });
  
    try {
      await dispatch(addCandidate(formData)).unwrap();
      setIsModalOpen(false);
      dispatch(getAllCandidates()); // Refresh the list after successful addition
    } catch (error) {
      console.error("Failed to add candidate:", error);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      // Dispatch the status update action
      const result = await dispatch(updateCandidateStatus({ 
        id: candidateId, 
        status: newStatus 
      })).unwrap();
      
      if (result) {
        dispatch(getAllCandidates());
      }
      
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };


  const handleDownloadResume = (id) => {
    const candidate = candidates.find(c => c._id === id);
    if (candidate?.resume) {
      const downloadUrl = candidate.resume.replace('/upload/', '/upload/fl_attachment/');
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${candidate.name}-Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Resume not available for this candidate.");
    }
  };
  

  const handleDeleteCandidate = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      dispatch(deleteCandidate(id))
        .unwrap()
        .then(() => {
          dispatch(getAllCandidates()); // Refresh the list
        })
        .catch(err => console.log(err));
    }
  };

  const resetFilters = () => {
    setStatusFilter('');
    setPositionFilter('');
    setSearchTerm('');
  };

  const actionItems = [
    {
      label: "Download Resume",
      icon: Download,
      handler: (id) => {
       handleDownloadResume(id);
      }
    },
    {
      label: "Delete Candidate",
      icon: Trash2,
      handler: (id) => {
        handleDeleteCandidate(id);
        console.log("delete handler:",id)
        // setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      }
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

if(loading) return <div>Loading......</div>
   

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
        onReset={resetFilters}
      />
      
      <DataTable
        columns={["Sr no.", "Name", "Email", "Phone", "Position", "Status", "Experience","Action"]}
        data={tableData.map(candidate => ({
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
    { name: 'name', label: 'Full Name', type: 'text', required: true },
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
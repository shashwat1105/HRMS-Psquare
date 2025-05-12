import { useState, useEffect } from "react";
import { Filter, Trash2, User } from "lucide-react";
import styles from "./Employees.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import DataTable from "../Candidates/comps/DataTable";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
import { 
  addEmployee, 
  getAllEmployees, 
  updateEmployee, 
  deleteEmployee 
} from "../../../store/slices/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function EmployeeManagement() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingEmployee, setEditingEmployee] = useState({});
  const dispatch = useDispatch();
  
  const { employees = [] } = useSelector((state) => state.employee) || {};

  const positionOptions = ["Intern", "Junior", "Full Time", "Senior", "Team Lead"];
  const departmentOptions = ['Designer', 'Backend Development', 'Human Resource', 'Frontend Development', 'Marketing'];

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch]);

  const filteredEmployees = (employees || []).filter(employee => {
    if (!employee) return false;
    
    if (positionFilter && employee.position !== positionFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (employee.name?.toLowerCase().includes(searchLower)) ||
        (employee.email?.toLowerCase().includes(searchLower)) ||
        (employee.department?.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const tableData = filteredEmployees.map((employee, index) => ({
    id: employee._id || index,
    "Sr no.": index + 1,
    "Profile": employee.photo ? (
      <img 
        src={employee.photo} 
        alt={employee.name}
        className={styles.employeeAvatar}
      />
    ) : (
      <div className={styles.avatarPlaceholder}>
        {employee.name?.charAt(0).toUpperCase()}
      </div>
    ),
    "Employee Name": employee?.name || '',
    "Email Address": employee?.email || '',
    "Phone Number": employee?.phone || '',
    "Position": employee?.position || '',
    "Department": employee?.department || '',
    "Date of Joining": employee?.joiningDate 
      ? new Date(employee.joiningDate).toLocaleDateString() 
      : '',
  }));

  const handleSaveEmployee = async (newEmployee) => {
    const formData = new FormData();
    
    Object.keys(newEmployee).forEach(key => {
      if (key === 'avatar' && newEmployee[key] instanceof File) {
        formData.append('photo', newEmployee[key]);
      } else if (key !== 'declaration') {
        formData.append(key, newEmployee[key]);
      }
    });

    try {
      if (modalMode === "add") {
        await dispatch(addEmployee(formData)).unwrap();
        toast.success("Employee added successfully");
      } else {
        await dispatch(updateEmployee({ 
          id: editingEmployee._id, 
          userData: formData 
        })).unwrap();
        toast.success("Employee updated successfully");
      }
      setIsModalOpen(false);
      dispatch(getAllEmployees());
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id))
        .unwrap()
        .then(() => {
          toast.success("Employee deleted successfully");
          dispatch(getAllEmployees());
        })
        .catch(err => toast.error(err.message || "Delete failed"));
    }
  };

  const actionItems = [
    {
      label: "Edit Employee",
      icon: User,
      handler: (id) => { handleEditEmployee(id);}
    },
    {
      label: "Delete Employee",
      icon: Trash2,
      handler:(id)=> handleDeleteEmployee(id),
      danger: true
    }
  ];

  const resetFilters = () => {
    setPositionFilter("");
    setSearchTerm("");
    setIsFilterOpen(false); 
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditEmployee = (id) => {
    const employee = employees.find(e => e._id === id);
    setEditingEmployee({
      ...employee,
      joiningDate: employee.joiningDate ? formatDateForInput(employee.joiningDate) : ''
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <Navbar title="Employees" />
      
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
  positionFilter={positionFilter}
  setPositionFilter={setPositionFilter}
  positionOptions={positionOptions}
  addButtonText="Add Employee"
  onAddClick={() => {
    setEditingEmployee({});
    setModalMode("add");
    setIsModalOpen(true);
  }}
  onReset={resetFilters}
  hideStatusFilter={true}
  hideDepartmentFilter={true}
/>
      
      <DataTable
        columns={["Sr no.", "Profile", "Employee Name", "Email Address", "Phone Number", "Position", "Department", "Date of Joining", "Action"]}
        data={tableData}
        actionItems={actionItems}
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        title="Employee"
        mode={modalMode}
        initialData={editingEmployee}
        fields={[
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
          { 
            name: 'position', 
            label: 'Position', 
            type: 'select',
            options: positionOptions,
            required: true 
          },
          { 
            name: 'department', 
            label: 'Department', 
            type: 'select',
            options: departmentOptions,
            required: true 
          },
          { name: 'joiningDate', label: 'Date of Joining', type: 'date', required: true },
          { 
            name: 'avatar', 
            label: 'Profile Photo', 
            type: 'file', 
            accept: 'image/*',
            required: modalMode === 'add'
          }
        ]}
      />
    </div>
  );
}
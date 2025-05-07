import { useState } from "react";
import { MoreVertical, ChevronDown, Mail, Bell, User, Trash2 } from "lucide-react";
import styles from "./Employees.module.css";
import Navbar from "../Candidates/comps/NavBar";
import FilterOptions from "../Candidates/comps/FilterOptions";
import DataTable from "../Candidates/comps/DataTable";
import ModalForm from "../AddCandidateModal/AddCandidateModal";
 

export default function EmployeeManagement() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [editingEmployee, setEditingEmployee] = useState({});

  const positionOptions = ["Intern", "Junior", "Full Time", "Senior", "Team Lead"];

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Jane Copper',
      email: 'jane.copper@example.com',
      phone: '(704) 555-0127',
      position: 'Intern',
      department: 'Designer',
      joinDate: '10/06/13',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      name: 'Arlene McCoy',
      email: 'arlene.mccoy@example.com',
      phone: '(302) 555-0107',
      position: 'Full Time',
      department: 'Designer',
      joinDate: '11/07/16',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'deanna.curtis@example.com',
      phone: '(252) 555-0126',
      position: 'Senior',
      department: 'Backend Development',
      joinDate: '08/15/17',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      name: 'Janney Wilson',
      email: 'janney.wilson@example.com',
      phone: '(252) 555-0126',
      position: 'Junior',
      department: 'Backend Development',
      joinDate: '12/04/17',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 5,
      name: 'Leslie Alexander',
      email: 'willie.jennings@example.com',
      phone: '(207) 555-0119',
      position: 'Team Lead',
      department: 'Human Resource',
      joinDate: '05/30/14',
      avatar: '/api/placeholder/32/32'
    }
  ]);

  const filteredEmployees = employees.filter(employee => {
    if (positionFilter && employee.position !== positionFilter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        employee.name.toLowerCase().includes(lowerSearch) ||
        employee.email.toLowerCase().includes(lowerSearch) ||
        employee.department.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  });

  const handleSaveEmployee = (newEmployee) => {
    if (modalMode === 'add') {
      const newId = Math.max(...employees.map(e => e.id)) + 1;
      setEmployees(prev => [...prev, { id: newId, ...newEmployee }]);
    } else {
      setEmployees(prev => 
        prev.map(employee => 
          employee.id === editingEmployee.id 
            ? { ...employee, ...newEmployee } 
            : employee
        )
      );
    }
  };

  const actionItems = [
    {
        label: "Edit Employee",
        icon: User,
        handler: (id) => {
          const employeeToEdit = employees.find(e => e.id === id);
          setEditingEmployee({...employeeToEdit});
          setModalMode("edit");
          setIsModalOpen(true);
        }
      },
    {
      label: "Delete",
      icon: Trash2,
      handler: (id) => {
        setEmployees(prev => prev.filter(employee => employee.id !== id));
      }
    }
  ];

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
          setModalMode("add");
          setIsModalOpen(true);
        }}
        hideStatusFilter={true}
      />
      
      <DataTable
        columns={["Sr. no","Profile", "Employee Name", "Email Address", "Phone Number", "Position", "Department", "Date of Joining", "Action"]}
        data={filteredEmployees.map(employee => ({
          id: employee.id,
          profile: (
            <div className={styles.avatarCell}>
              <img 
                src={employee.avatar} 
                alt={employee.name} 
                className={styles.employeeAvatar} 
              />
            </div>
          ),
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          joinDate: employee.joinDate,
          actions: true
        }))}
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
            options: ['Designer', 'Backend Development', 'Human Resource', 'Frontend Development', 'Marketing'],
            required: true 
          },
          { name: 'joinDate', label: 'Date of Joining', type: 'date', required: true },
          { 
            name: 'avatar', 
            label: 'Profile Picture', 
            type: 'file', 
            accept: 'image/*',
            required: modalMode === 'edit'
          }
        ]}
      />
    </div>
  );
}
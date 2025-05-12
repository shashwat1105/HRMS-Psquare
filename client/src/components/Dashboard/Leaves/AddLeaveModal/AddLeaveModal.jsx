import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Upload, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from './AddLeave.module.css';
import { createLeave, getAllLeaves } from '../../../../store/slices/leaveSlice';



const AddLeaveModal = ({ isOpen, onClose ,handleSaveLeave,onCreateSuccess}) => {
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    designation: '',
    leaveDate: '',
    reason: '',
    docs: null
  });
  const [documentName, setDocumentName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef(null);

  // Get employees from Redux store (you'll need to fetch them elsewhere)
  const { employees } = useSelector((state) => ({
    employees: state.employee.employees || []
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("Employees in store:", employees);
  }, [employees]);
  

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() !== '' && !selectedEmployee) {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setShowDropdown(true);
    } else {
      setFilteredEmployees([]);
      setShowDropdown(false);
    }
  }, [searchTerm, employees, selectedEmployee]);

  // Validate form
  useEffect(() => {
    const isValid = 
      selectedEmployee !== null && 
      formData.designation.trim() !== '' && 
      formData.leaveDate.trim() !== '' && 
      formData.reason.trim() !== '';
    setIsFormValid(isValid);
  }, [selectedEmployee, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(employee.name);
    setShowDropdown(false);
    setFormData(prev => ({
      ...prev,
      designation: employee.position || employee.designation || ''
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setSelectedEmployee(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        docs: file
      });
      setDocumentName(file.name);
    }
  };

  const handleClearDocument = () => {
    setFormData(prev => ({
      ...prev,
      docs: null
    }));
    setDocumentName('');
  };

// In your handleSubmit function
const handleSubmit = async () => {
    if (!isFormValid || !formData.docs) {
      toast.error('Please fill all required fields and upload a supporting document');
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('employee', selectedEmployee._id);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('leaveDate', formData.leaveDate);
      formDataToSend.append('reason', formData.reason);
      formDataToSend.append('docs', formData.docs); // Consistent field name
      
      await dispatch(createLeave(formDataToSend)).unwrap();
      
      toast.success('Leave request submitted successfully');
      onClose();
      resetForm();
      dispatch(getAllLeaves()); // Refresh the leaves list
    } catch (error) {
      toast.error(error.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const resetForm = () => {
    setSelectedEmployee(null);
    setSearchTerm('');
    setFormData({
      designation: '',
      leaveDate: '',
      reason: '',
      docs: null
    });
    setDocumentName('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add New Leave</h2>
          <button 
            className={styles.closeButton} 
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            {/* Employee Search */}
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Employee*</label>
              <div className={styles.searchContainer} ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search Employee Name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={styles.inputField}
                  onClick={() => {
                    if (!selectedEmployee && employees.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Search className={styles.searchIcon} size={16} />
                
                {showDropdown && filteredEmployees.length > 0 && (
                  <div className={styles.dropdownList}>
                    {filteredEmployees.map((emp) => (
                      <div 
                        key={emp._id} 
                        className={styles.dropdownItem}
                        onClick={() => handleEmployeeSelect(emp)}
                      >
                        <div className={styles.employeeOption}>
                          <span className={styles.employeeName}>{emp.name}</span>
                          <span className={styles.employeePosition}>{emp.position}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Designation */}
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Designation*</label>
              <input
                type="text"
                name="designation"
                placeholder="Employee designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={styles.inputField}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Leave Date */}
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Leave Date*</label>
              <input
                type="date"
                name="leaveDate"
                value={formData.leaveDate}
                onChange={handleInputChange}
                className={styles.inputField}
                required
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]} // Disable past dates
              />
            </div>

            {/* Document Upload */}
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Supporting Document</label>
              <div className={styles.uploadContainer}>
                <label className={styles.uploadField} style={isSubmitting ? { opacity: 0.7 } : {}}>
                  {documentName ? (
                    <div className={styles.documentPreview}>
                      <span className={styles.documentName}>{documentName}</span>
                      {!isSubmitting && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearDocument();
                          }}
                          className={styles.clearDocument}
                          aria-label="Remove document"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span>Click to upload document</span>
                  )}
                  <input
                    type="file"
                    name="docs"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    disabled={isSubmitting}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Upload className={styles.uploadIcon} size={16} />
                </label>
              </div>
            </div>
          </div>

          {/* Reason - Full Width */}
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Reason for Leave*</label>
            <textarea
              name="reason"
              placeholder="Enter reason for leave"
              value={formData.reason}
              onChange={handleInputChange}
              className={`${styles.inputField} ${styles.reasonInput}`}
              required
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Save Button */}
          <div className={styles.actionContainer}>
            <button 
              className={`${styles.saveButton} ${isFormValid ? styles.saveButtonEnabled : ''}`} 
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Save Leave Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveModal;
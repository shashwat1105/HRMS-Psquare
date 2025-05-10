import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Upload, Search, X } from 'lucide-react';
import styles from './AddLeave.module.css';

const AddLeaveModal = ({ isOpen, onClose, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    designation: '',
    leaveDate: '',
    reason: '',
    document: null
  });
  const [documentName, setDocumentName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const dropdownRef = useRef(null);

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
      designation: employee.designation || ''
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
        document: file
      });
      setDocumentName(file.name);
    }
  };

  const handleClearDocument = () => {
    setFormData({
      ...formData,
      document: null
    });
    setDocumentName('');
  };

  const handleSubmit = () => {
    if (isFormValid) {
      const leaveData = {
        employee: selectedEmployee,
        ...formData
      };
      console.log('Submitting leave data:', leaveData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add New Leave</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            {/* Employee Search */}
            <div className={styles.inputContainer}>
              <div className={styles.searchContainer} ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search Employee Name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={styles.inputField}
                  onClick={() => {
                    if (!selectedEmployee) {
                      setShowDropdown(true);
                    }
                  }}
                />
                <Search className={styles.searchIcon} size={16} />
                
                {showDropdown && filteredEmployees.length > 0 && (
                  <div className={styles.dropdownList}>
                    {filteredEmployees.map((emp) => (
                      <div 
                        key={emp.id} 
                        className={styles.dropdownItem}
                        onClick={() => handleEmployeeSelect(emp)}
                      >
                        {emp.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Designation */}
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="designation"
                placeholder="Designation*"
                value={formData.designation}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
            </div>

            {/* Leave Date */}
            <div className={styles.inputContainer}>
              <input
                type="date"
                name="leaveDate"
                placeholder="Leave Date*"
                value={formData.leaveDate}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
              {/* <Calendar className={styles.fieldIcon} size={16} /> */}
            </div>

            {/* Document Upload */}
            <div className={styles.inputContainer}>
              <div className={styles.uploadContainer}>
                <label className={styles.uploadField}>
                  {documentName ? (
                    <div className={styles.documentPreview}>
                      <span className={styles.documentName}>{documentName}</span>
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
                    </div>
                  ) : (
                    <span>Upload Document</span>
                  )}
                  <input
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <Upload className={styles.uploadIcon} size={16} />
                </label>
              </div>
            </div>
          </div>

          {/* Reason - Full Width */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="reason"
              placeholder="Reason*"
              value={formData.reason}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </div>

          {/* Save Button */}
          <div className={styles.actionContainer}>
            <button 
              className={`${styles.saveButton} ${isFormValid ? styles.saveButtonEnabled : ''}`} 
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveModal;
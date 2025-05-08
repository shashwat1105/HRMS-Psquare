import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import styles from './CandidateModal.module.css';

const ModalForm = ({ 
  isOpen, 
  onClose, 
  onSave,
  title = "Form",
  fields = [],
  initialData = {},
  mode = "add" // "add" or "edit"
}) => {
  const modalRef = useRef(null);
  const fileInputRefs = useRef({});

  // Initialize form data based on fields and initialData
  const [formData, setFormData] = useState(() => {
    const data = {};
    fields.forEach(field => {
      data[field.name] = initialData[field.name] || '';
      if (field.type === 'file') {
        data[field.name] = null; // Files should always start as null
      } else if (field.type === 'checkbox') {
        data[field.name] = initialData[field.name] || false;
      }
    });
    return data;
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Validate form whenever formData changes
  useEffect(() => {
    if (isOpen && mode === "edit") {
      const data = {};
      fields.forEach(field => {
        if (field.type === 'file') {
          data[field.name] = null;
        } else if (field.type === 'checkbox') {
          data[field.name] = initialData?.[field.name] || false;
        } else {
          data[field.name] = initialData?.[field.name] || '';
        }
      });
      setFormData(data);
    }
  }, [isOpen, mode, fields.length, JSON.stringify(initialData)]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (name, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderFormControl = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className={styles.formControl}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className={styles.formControl}
            required={field.required}
            rows={field.rows || 3}
          />
        );
      
      case 'checkbox':
        return (
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name]}
              onChange={handleInputChange}
              className={styles.checkboxInput}
              required={field.required}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.checkboxText}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </span>
          </label>
        );
      
      case 'file':
        return (
          <div className={styles.resumeInputContainer}>
            <input
              type="text"
              readOnly
              value={formData[field.name] ? formData[field.name].name : ''}
              placeholder={field.placeholder || "No file chosen"}
              className={`${styles.formControl} ${styles.resumeInput}`}
            />
            <button
              type="button"
              onClick={() => fileInputRefs.current[field.name].click()}
              className={styles.uploadButton}
            >
              <Upload color='#4D007D' size={20} />
            </button>
            <input
              type="file"
              ref={el => fileInputRefs.current[field.name] = el}
              style={{ display: 'none' }}
              accept={field.accept || "*"}
              onChange={(e) => handleFileChange(field.name, e)}
              required={field.required && !formData[field.name]}
            />
          </div>
        );
      
      default:
        return (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className={styles.formControl}
            required={field.required}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{mode === 'add' ? `Add New ${title}` : `Edit ${title}`}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {fields.map((field, index) => (
                <div 
                  key={field.name} 
                  className={`${styles.formGroup} ${
                    field.type === 'checkbox' || field.type === 'file' ? styles.fullWidth : ''
                  }`}
                >
                  {field.type !== 'checkbox' && (
                    <label className={styles.inputLabel}>
                      {field.label}
                      {field.required && <span className={styles.required}>*</span>}
                    </label>
                  )}
                  {renderFormControl(field)}
                </div>
              ))}
            </div>
            <div className={styles.buttonRow}>
              <button 
                type="button" 
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`${styles.saveButton} ${isFormValid ? styles.saveButtonActive : ''}`}
                disabled={!isFormValid}
              >
                {mode === 'add' ? 'Add' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
import React from 'react';
import styles from './Logout.module.css';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.logoutModalOverlay}>
      <div className={styles.logoutModalContainer}>
        <div className={styles.logoutModalHeader}>
          <h2>Log Out</h2>
        </div>
        <div className={styles.logoutModalContent}>
          <p>Are you sure you want to log out?</p>
        </div>
        <div className={styles.logoutModalActions}>
          <button 
            className={`${styles.logoutModalButton} ${styles.cancelButton}`} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`${styles.logoutModalButton} ${styles.logoutButton}`} 
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
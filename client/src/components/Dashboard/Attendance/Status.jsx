import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./Status.module.css";

export default function Status({ status, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const statusOptions = ["Present", "Absent"]; // Define options here

  const handleStatusChange = (newStatus) => {
    onChange(newStatus);
    setIsEditing(false);
  };

  return (
    <div className={styles.statusCell}>
      {isEditing ? (
        <div className={styles.statusDropdown}>
          <div className={styles.statusDropdownMenu}>
            {statusOptions.map((option) => (
              <div
                key={option}
                className={`${styles.statusOption} ${
                  status === option ? styles.selectedStatus : ""
                }`}
                onClick={() => handleStatusChange(option)}
              >
                {option}
                {status === option && <Check className={styles.checkIcon} size={16} />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className={`${styles.statusText} ${
            status === "Present" ? styles.statusPresent : styles.statusAbsent
          }`}
          onClick={() => setIsEditing(true)}
        >
          {status}
          <ChevronDown className={styles.dropdownIcon} size={16} />
        </div>
      )}
    </div>
  );
}
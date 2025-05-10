import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from  './Status.module.css';

export default function Status({ status, onChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const statusOptions = [
    "Present",
    "Absent",
    "Medical Leave",
    "Work From Home",
  ];

  // Get the correct CSS module class for the status
  const getStatusClass = (status) => {
    const statusMap = {
      "Present": styles.statusPresent,
      "Absent": styles.statusAbsent,
      "Medical Leave": styles.statusMedicalLeave,
      "Work From Home": styles.statusWorkFromHome,
    };
    return statusMap[status] || "";
  };

  const handleStatusChange = (newStatus) => {
    onChange(newStatus);
    setIsEditing(false);
  };

  return (
    <div className={styles.statusContainer} style={{ position: "relative" }}>
      {isEditing ? (
        <div className={styles.dropdownMenu}>
          {statusOptions.map((option) => (
            <div
              key={option}
              className={`${styles.dropdownItem} ${
                status === option ? styles.selected : ""
              }`}
              onClick={() => handleStatusChange(option)}
            >
              {option}
              {status === option && <Check className={styles.checkIcon} size={16} />}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`${styles.statusText} ${getStatusClass(status)}`}
          onClick={() => setIsEditing(true)}
        >
          {status}
          <ChevronDown size={16} style={{ marginLeft: "6px" }} />
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./StatusBadge.module.css";

export default function StatusBadge({ status, statusOptions, onChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "New": return styles.statusNew;
      case "Scheduled": return styles.statusScheduled;
      case "Ongoing": return styles.statusOngoing;
      case "Selected": return styles.statusSelected;
      case "Rejected": return styles.statusRejected;
      case "Present": return styles.statusPresent;
        case "Absent": return styles.statusAbsent;
      default: return styles.statusNew;
    }
  };

  return (
    <div className={styles.statusCell}>
    {isEditing ? (
  <div className={styles.statusDropdown}>
    <div className={styles.statusDropdownMenu}>
      {statusOptions && statusOptions.map((option) => ( // Check if statusOptions is defined
        <div
          key={option}
          className={`${styles.statusOption} ${status === option ? styles.selectedStatus : ''}`}
          onClick={() => {
            onChange(option);
            setIsEditing(false);
          }}
        >
          {option}
          {status === option && <Check className={styles.checkIcon} size={16} />}
        </div>
      ))}
    </div>
  </div>
) : (
  <div 
    className={`${styles.statusBadge} ${getStatusClass(status)}`}
    onClick={(e) => {
      e.stopPropagation();
      setIsEditing(true);
    }}
  >
    {status}
    <ChevronDown className={styles.badgeIcon} />
  </div>
)}

    </div>
  );
}
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./StatusBadge.module.css";

export default function StatusBadge({ status, statusOptions, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const statusClasses = {
    New: styles.statusNew,
    Scheduled: styles.statusScheduled,
    Ongoing: styles.statusOngoing,
    Selected: styles.statusSelected,
    Rejected: styles.statusRejected
  };

  return (
    <div className={styles.statusContainer}>
      <div 
        className={`${styles.statusBadge} ${statusClasses[status] || styles.statusNew}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {status}
        <ChevronDown className={styles.chevron} />
      </div>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {statusOptions.map(option => (
            <div
              key={option}
              className={`${styles.option} ${status === option ? styles.selected : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
              {status === option && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
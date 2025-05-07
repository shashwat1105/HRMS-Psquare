import styles from "./ActionDropdown.module.css";

export default function ActionDropdown({ items, onItemClick }) {
  return (
    <div className={styles.actionDropdown}>
      {items.map((item, index) => (
        <button 
          key={index} 
          className={styles.dropdownItem}
          onClick={() => onItemClick(item)}
        >
          {item.icon && <item.icon className={styles.dropdownIcon} />}
          {item.label}
        </button>
      ))}
    </div>
  );
}
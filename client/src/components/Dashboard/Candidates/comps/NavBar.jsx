import { Mail, Bell } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({ title }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.headerIcons}>
        <button className={styles.iconButton}>
          <Mail className={styles.icon} />
        </button>
        <div className={styles.notificationWrapper}>
          <button className={styles.iconButton}>
            <Bell className={styles.icon} />
          </button>
          <span className={styles.notificationBadge}></span>
        </div>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>JD</span>
        </div>
      </div>
    </div>
  );
}
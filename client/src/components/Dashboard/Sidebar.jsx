import React from 'react';
import styles from './Sidebar.module.css';
import { LibraryBig, LogOut, Sparkles, UserPlus, Users, X } from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, activeTab, setActiveTab, setMobileMenuOpen }) => {
  const menuItems = [
    {
      title: "Recruitment",
      items: [
        { name: "Candidates", icon: <UserPlus /> }
      ]
    },
    {
      title: "Organization",
      items: [
        { name: "Employees", icon: <Users /> },
        { name: "Attendance", icon: <LibraryBig /> },
        { name: "Leaves", icon: <Sparkles /> }
      ]
    },
    {
      title: "Others",
      items: [
        { name: "Logout", icon: <LogOut /> }
      ]
    }
  ];

  const handleMenuItemClick = (itemName) => {
    setActiveTab(itemName);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.mobileHeader}>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className={styles.closeButton}
        >
          <X size={24} />
        </button>
      </div>
      
      <div className={styles.logo}>
        <div className={styles.logoSquare}></div>
        <span className={styles.logoText}>LOGO</span>
      </div>
      
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search" 
          className={styles.searchInput} 
        />
      </div>
      
      {menuItems.map((section, index) => (
        <div className={styles.menuSection} key={index}>
          <div className={styles.sectionTitle}>{section.title}</div>
          <ul className={styles.menuList}>
            {section.items.map((item, itemIndex) => (
              <li 
                key={itemIndex}
                className={`${styles.menuItem} ${activeTab === item.name ? styles.active : ''}`}
                onClick={() => handleMenuItemClick(item.name)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.menuText}>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
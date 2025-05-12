import React,{ useState } from 'react';
import styles from './Dashboard.module.css';
import { Bell, Mail, Menu, User } from 'lucide-react';
import Sidebar from '../../components/Dashboard/Sidebar';
import MainContent from '../../components/Dashboard/MainContent';

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Candidates');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mobileHeader} >
        <div className={styles.mobileHeaderLeft}>
          <button onClick={toggleMobileMenu} className={styles.menuButton}>
            <Menu size={24} />
          </button>
          <div className={styles.mobileLogo}>LOGO</div>
        </div>
        <div className={styles.mobileHeaderRight}>
          <Mail size={20} />
          <Bell size={20} />
          <User size={20} className={styles.userIcon} />
        </div>
      </div>


      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setMobileMenuOpen={setMobileMenuOpen}
        style={{ zIndex: 1000 }}
      />

      <MainContent activeTab={activeTab} onTabChange={setActiveTab}/>
    </div>
  );
}
import React, { useState } from 'react';
import styles from './Registration.module.css';
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import RegistrationForm from '../../components/Registration/RegistrationForm';


const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <LogoSection/>
      <div className={styles.contentContainer}>
        <LeftSection/>
        <div className={styles.rightSection}>
          <RegistrationForm toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          togglePasswordVisibility={togglePasswordVisibility} showPassword={showPassword}
         showConfirmPassword={showConfirmPassword}/>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
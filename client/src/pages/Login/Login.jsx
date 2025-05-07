import React, { useState } from 'react';
import styles from '../Registration/Registration.module.css'; // Using the same CSS module
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import LoginForm from '../../components/Login/LoginForm';
// import LogoSection from '../../components/Registration/LogoSection';
// import LeftSection from '../../components/Registration/LeftSection';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data submitted:', formData);
    // Add your login logic here
  };

  // Check if both email and password are filled
  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className={styles.container}>
      <LogoSection/>
      <div className={styles.contentContainer}>
        <LeftSection/>
        <div className={styles.rightSection}>
          <LoginForm isFormValid={isFormValid} handleSubmit={handleSubmit}
          togglePasswordVisibility={togglePasswordVisibility} handleChange={handleChange}/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
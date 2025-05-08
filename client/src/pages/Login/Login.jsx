import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, resetAuthState } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../Registration/Registration.module.css';
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import LoginForm from '../../components/Login/LoginForm';
import { loginUser, resetAuthState } from '../../store/slices/authSlice';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      // Handle error (show toast or something)
      console.error(error);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(resetAuthState());
  }, [user, isError, isSuccess, error, navigate, dispatch]);

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
    dispatch(loginUser(formData));
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className={styles.container}>
      <LogoSection/>
      <div className={styles.contentContainer}>
        <LeftSection/>
        <div className={styles.rightSection}>
          <LoginForm 
            isFormValid={isFormValid} 
            handleSubmit={handleSubmit}
            togglePasswordVisibility={togglePasswordVisibility} 
            handleChange={handleChange}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
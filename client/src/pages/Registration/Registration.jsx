import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { registerUser, resetAuthState } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Registration.module.css';
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import RegistrationForm from '../../components/Registration/RegistrationForm';
import { registerUser, resetAuthState } from '../../store/slices/authSlice';

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.error(error);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(resetAuthState());
  }, [user, isError, isSuccess, error, navigate, dispatch]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    };
   await dispatch(registerUser(userData));
  };

  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.password.trim() !== '' && 
                     formData.confirmPassword.trim() !== '';

  return (
    <div className={styles.container}>
      <LogoSection/>
      <div className={styles.contentContainer}>
        <LeftSection/>
        <div className={styles.rightSection}>
          <RegistrationForm 
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={formData}
            isFormValid={isFormValid}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
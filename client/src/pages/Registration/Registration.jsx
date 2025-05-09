import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Registration.module.css';
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import RegistrationForm from '../../components/Registration/RegistrationForm';
import { register } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import validator from 'validator';

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
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    await dispatch(register(userData));
  };

  const isFormValid = formData.fullName.trim() !== '' &&
                      formData.email.trim() !== '' &&
                      formData.password.trim() !== '' &&
                      formData.confirmPassword.trim() !== '';

  return (
    <div className={styles.container}>
      <LogoSection />
      <div className={styles.contentContainer}>
        <LeftSection />
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

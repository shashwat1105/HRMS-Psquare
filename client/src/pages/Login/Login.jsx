import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../Registration/Registration.module.css';
import LogoSection from '../../components/Registration/LogoSection';
import LeftSection from '../../components/Registration/LeftSection';
import LoginForm from '../../components/Login/LoginForm';
import { login, triggerLogout } from '../../store/slices/authSlice';
import validator from 'validator';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, tokenExpiry } = useSelector((state) => state.auth);

  // Handle side effects after login
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Auto-logout when token expires
  useEffect(() => {
    let timer;

    if (tokenExpiry) {
      const remainingTime = tokenExpiry - Date.now();

      if (remainingTime <= 0) {
        dispatch(triggerLogout());
        navigate('/login');
      } else {
        timer = setTimeout(() => {
          dispatch(triggerLogout());
          toast('Session expired. Logged out automatically.');
          navigate('/login');
        }, remainingTime);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tokenExpiry, dispatch, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validator.isEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    dispatch(login(formData));
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className={styles.container}>
      <LogoSection />
      <div className={styles.contentContainer}>
        <LeftSection />
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

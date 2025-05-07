import React from 'react'
import styles from '../../pages/Registration/Registration.module.css';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginForm = ({handleSubmit,handleChange,formData,showPassword,togglePasswordVisibility,isFormValid}) => {
  return (
    <div className={styles.formContainer}>
    <h2 className={styles.formTitle}>Welcome to Dashboard</h2>
    
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email Address*</label>
        <input 
          type="email" 
          id="email"
          name="email"
          className={styles.input} 
          placeholder="Email Address" 
          value={formData?.email}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password*</label>
        <div className={styles.passwordContainer}>
          <input 
            type={showPassword ? "text" : "password"}
            id="password"
            name="password" 
            className={styles.input} 
            placeholder="Password" 
            value={formData?.password}
            onChange={handleChange}
            required 
          />
          <button 
            type="button" 
            className={styles.eyeIcon} 
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
           <Eye color='#4D007D' />
            ) : (
               <EyeOff color='#4D007D'/>
            )}
          </button>
        </div>
      </div>

      <div className={styles.forgotPasswordContainer}>
        <a href="#" className={styles.forgotPassword}>Forgot password?</a>
      </div>
      
      <button 
        type="submit" 
        className={`${styles.registerButton} ${!isFormValid ? styles.disabledButton : ''}`}
        disabled={!isFormValid}
      >
        Login
      </button>
    </form>
    
    <div className={styles.loginLink}>
      Don't have an account? <Link to='/'>Register</Link>
    </div>
  </div>
  )
}

export default LoginForm
import React from 'react'
import styles from '../../pages/Registration/Registration.module.css';
import {Eye, EyeOff} from 'lucide-react'
import { Link } from 'react-router-dom';

const RegistrationForm = ({showPassword,showConfirmPassword,togglePasswordVisibility,toggleConfirmPasswordVisibility}) => {
  return (
      <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>Welcome to Dashboard</h2>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>Full name*</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    className={styles.input} 
                    placeholder="Full name" 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address*</label>
                  <input 
                    type="email" 
                    id="email" 
                    className={styles.input} 
                    placeholder="Email Address" 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>Password*</label>
                  <div className={styles.passwordContainer}>
                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password" 
                      className={styles.input} 
                      placeholder="Password" 
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
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password*</label>
                  <div className={styles.passwordContainer}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword" 
                      className={styles.input} 
                      placeholder="Confirm Password" 
                      required 
                    />
                    <button 
                      type="button" 
                      className={styles.eyeIcon} 
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                       <Eye color='#4D007D'/>
                      ) : (
                       <EyeOff color='#4D007D'/>
                      )}
                    </button>
                  </div>
                </div>
                
                <button type="submit" className={styles.registerButton}>
                  Register
                </button>
              </form>
              
              <div className={styles.loginLink}>
                Already have an account? <Link to='/login'>Login</Link>
              </div>
            </div>
  )
}

export default RegistrationForm
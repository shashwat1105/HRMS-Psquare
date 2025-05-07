import React from 'react'
import styles from '../../pages/Registration/Registration.module.css';
import img from "../../assets/0b16e7d0e54f5ea69def92a8e3982fc5f2d8a09a.png"

const LeftSection = () => {
  return (
      <div className={styles.leftSection}>
             <div className={styles.imageContainer}>
               <img 
                 src={img}
                 alt="Dashboard preview" 
                 className={styles.dashboardImage} 
               />
             </div>
             <div className={styles.textContainer}>
               <h2 className={styles.title}>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
               </h2>
               <p className={styles.description}>
                 tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                 veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                 commodo consequat.
               </p>
             </div>
             <div className={styles.dotsContainer}>
               <span className={`${styles.dot} ${styles.active}`}></span>
               <span className={styles.dot}></span>
               <span className={styles.dot}></span>
             </div>
           </div>
  )
}

export default LeftSection
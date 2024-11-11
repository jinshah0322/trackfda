import { useState } from 'react';
import styles from './ComplianceTimeline.module.css';


export default function ComplianceTimeline ( { data })  {
 if(data.length>0) { 
  return (
    <div className={styles.timelineContainer}>
    <h2 className={styles.title}>Compliance Actions</h2>
    <div className={styles.timeline}>
      {data.map((item, index) => (
        <div key={index} className={`${styles.timelineItem} ${styles.fadeIn}`}>
          <div className={styles.circle}></div>
          <div className={styles.content}>
            <div className={styles.header}>
              <h3>FDA {item.title}</h3>
              <span className={styles.date}>
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className={styles.description}>
             {item.description}
            </p>
          </div>
          {/* Render the connecting line if not the last item */}
          {index < data.length - 1 && <div className={styles.line}></div>}
        </div>
      ))}
    </div>
    </div>
  );}
  else{
    return(<>
        <div className={styles.timelineContainer}>
        <h2 className={styles.title}>No Data Available</h2>
        </div>
    </>)
  }
};



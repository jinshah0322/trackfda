export default function Loading() {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  const styles = {
    loaderContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', 
    },
    loader: {
      border: '8px solid rgba(0, 0, 0, 0.1)', 
      borderTop: '8px solid #3498db', 
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };
export const useStyles = (theme) => {
    return {
      box: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: darken background for better text contrast
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },
      icon: {
        display: 'flex', 
        alignItems: 'center', 
        pl: 1, 
        pb: 1,
        justifyContent: 'space-evenly'
      },
    }
  }
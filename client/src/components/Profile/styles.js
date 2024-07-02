export const useStyles = () => {
    return {
        container: {
            marginTop: '32px', // Fixed margin
        //   color: 'secondary.main',
        },
        paper: {
            backgroundColor: 'secondary.main',
            padding: '24px', // Fixed padding
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            m: 1,
        },
        image: {
            height: '150px',
            borderRadius: '50%',
            width: '150px',
        },
        text: {
            marginTop: '16px', // Fixed margin
        },
        button: {
            marginTop: '16px', // Fixed margin
        },
    }
}
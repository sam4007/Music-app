export const useStyles = () => {
    return {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
        },
        paper: {
            my: 3,
            p: {xs: 2, md: 4},
            px: {xs: 2, md: 10},
            backgroundColor: 'secondary.main',
            color: 'primary.dark',
        },
        formText: {
            display: 'flex',
            flexDirection: 'column',
        },
        input: {
            my: 1,
            color: 'primary.main',
        },
        fileInput: {
            '--Grid-borderWidth': '1px',
            border: 'var(--Grid-borderWidth) solid',
            borderColor: '#000000',
            borderRadius: 2,
            color: '#000000',
            backgroundColor: 'secondary.main',
        },
        submit: {
            '--Grid-borderWidth': '1px',
            border: 'var(--Grid-borderWidth) solid',
            borderColor: '#000000',
            borderRadius: 2,
            color: '#000000',
            backgroundColor: 'secondary.main',
            my: 3,
        }
    }
}
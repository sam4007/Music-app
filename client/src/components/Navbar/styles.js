export const useStyles = () => {
    return {
        logo1: {
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
        },
        logo2: {
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
        },
        navbar: {
            color: 'primary.main',
            backgroundColor: 'secondary.dark',
        },
        pages: {
            flexGrow: 1,
            display: {
                xs: 'none',
                md: 'flex',
            }
        },
    }
}
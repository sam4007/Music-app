import { Button, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <Container sx={{my: 3}}>
        <Paper sx={{backgroundColor: 'secondary.main', p: 2}}>
            <Typography variant='h3' sx={{color: 'secondary.dark'}}>Something went Wrong....</Typography>
            <Button component={Link} to='/' variant='outlined' color='inherit'>Go to Home</Button>
        </Paper>
    </Container>
  )
}

export default Error
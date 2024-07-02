import React, { useState } from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { Button, Grid, Paper, Typography, Avatar, Divider, TextField, Container, InputAdornment, IconButton } from '@mui/material'
import { app } from '../../config/firebase.config.js'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useStyles } from './styles.js'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GoogleIcon from '@mui/icons-material/Google';
import { signIn, signUp } from '../../actions/auth.js'
import { FileUploader, FileDeleter } from '../FileManager'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', imageURL: '', password: '', confirmPassword: '', token: '' });
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const firebaseAuth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const handleShowPassword = () => setShowPassword(prevShowPassword => !prevShowPassword);
    const switchMode = () => setIsSignup(prevIsSignup => !prevIsSignup);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signUp(formData, navigate));
        } else {
            dispatch(signIn(formData, navigate));
        }
    };

    const login = async () => {
        try {
            const userCred = await signInWithPopup(firebaseAuth, provider);
            const user = userCred?.user;
            const token = userCred?.user?.accessToken;
            const updatedForm = {
                ...formData,
                firstName: user.displayName,
                email: user.email,
                imageURL: user.photoURL,
                token: token,
            };
            dispatch(signUp(updatedForm, navigate));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid container item xs={12} sm={12} md={6} lg={6} direction='column' justifyContent='center' alignItems='center' spacing={1}>
                    <Paper sx={{ ...classes.paper, p: 3 }}>
                        <Grid container direction='row' spacing={2} justifyContent='center' sx={{ my: 3 }}>
                            <Grid item>
                                <Avatar sx={{ color: 'primary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                            </Grid>
                        </Grid>
                        <form onSubmit={handleSubmit}>
                            <Grid container direction='column' spacing={2} justifyContent='center'>
                                {isSignup && (
                                    <>
                                        <Grid item>
                                            <TextField sx={classes.input} placeholder='First Name' name='firstName' label="First Name" onChange={handleChange} required fullWidth />
                                        </Grid>
                                        <Grid item>
                                            <TextField sx={classes.input} placeholder='Last Name' name='lastName' label="Last Name" onChange={handleChange} required fullWidth />
                                        </Grid>
                                    </>
                                )}
                                <Grid item>
                                    <TextField sx={classes.input} placeholder='Email' name='email' label="Email" onChange={handleChange} required fullWidth type='email' />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        sx={classes.input}
                                        placeholder='Password'
                                        name='password'
                                        label="Password"
                                        onChange={handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton onClick={handleShowPassword}>
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {isSignup && (
                                    <>
                                        <Grid item>
                                            <TextField
                                                sx={classes.input}
                                                placeholder='Confirm Password'
                                                name='confirmPassword'
                                                label="Confirm Password"
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                                type={showPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position='end'>
                                                            <IconButton onClick={handleShowPassword}>
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item container justifyContent='center'>
                                            {formData.imageURL ? (
                                                <Grid item>
                                                    <FileDeleter formData={formData} setFormData={setFormData} isLoading={isImageLoading} setIsLoading={setIsImageLoading} isImage={true} />
                                                </Grid>
                                            ) : (
                                                <Grid item>
                                                    <FileUploader formData={formData} setFormData={setFormData} isLoading={isImageLoading} setIsLoading={setIsImageLoading} isImage={true} />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item>
                                <Button sx={classes.button} type='submit' fullWidth variant='contained'>{isSignup ? 'Sign Up' : 'Log In'}</Button>
                            </Grid>
                            <Divider sx={{ color: 'primary.dark', my: 2 }} />
                            <Grid item>
                                <Button sx={classes.button} startIcon={<GoogleIcon />} onClick={login} fullWidth variant='contained'>Sign In with Google</Button>
                            </Grid>
                            <Grid container justifyContent='space-evenly'>
                                <Grid item>
                                    <Button sx={{ backgroundColor: 'secondary.dark', my: 1 }} variant='outlined' onClick={switchMode}>
                                        {isSignup ? 'Already have an account?' : "Don't have an account?"}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button sx={{ backgroundColor: 'secondary.dark', my: 1 }} variant='outlined' component={Link} to='/'>
                                        Go Home
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
                <Grid item container xs={0} sm={0} md={6} lg={6} sx={{ display: { xs: 'none', md: 'flex' } }} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <Paper sx={{ backgroundColor: 'secondary.dark', px: 15, py: 10 }}>
                            <Typography variant='h1' sx={{ color: 'primary.main' }}>Log In to muSic</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};


export default Auth
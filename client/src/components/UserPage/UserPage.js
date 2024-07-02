import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useStyles } from './styles'
import { Paper, Container, Grid, CardMedia, Typography, Box, CircularProgress } from '@mui/material'
import SongCard from '../SongTile/SongTile'
import moment from 'moment'
import { getUser } from '../../actions/auth'
import { useNavigate, useParams } from 'react-router-dom'

const UserPage = () => {
    const classes = useStyles()
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getUser(id, navigate))
    }, [dispatch, id])
    
    let date = new Date(user?.data?.createdAt);
    if (!isNaN(Number(user?.data?.createdAt))) {
        date = date.toISOString();
    }
    const { isLoading } = useSelector((state) => state.auth)

    
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress sx={{ color: 'primary.main'}} />
            </Box>
        );
    }

    return (
        <Container sx={classes.container}>
            <Paper sx={classes.paper}>
                <Grid container spacing={2} justifyContent="space-evenly" alignItems="center">
                <Grid item>
                    <CardMedia
                    sx={classes.image}
                    component="img"
                    image={user?.data?.imageURL}
                    alt="User Profile"
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h3" sx={classes.text}>
                    {user?.data?.displayName}
                    </Typography>
                    <Typography variant="h6" sx={classes.text}>
                        Joined {moment(date).fromNow()}
                    </Typography>
                </Grid>
                </Grid>
            </Paper>
            <Paper sx={classes.paper}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Uploaded Songs
                </Typography>
                {user?.data?.songsUploaded && user?.data?.songsUploaded.length > 0 ? (
                <Grid container spacing={2}>
                    {user?.data?.songsUploaded.map((song) => (
                        <Grid item key={song._id} xs={12} sm={6} md={4} lg={3}>
                            <SongCard song={song} h={180} w={230} />
                        </Grid>
                    ))}
                </Grid>
                ) : (
                    <Typography>No Uploads by User</Typography>
                )}
            </Paper>
        </Container>
    )
}

export default UserPage
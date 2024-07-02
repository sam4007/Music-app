import React, { useEffect, useState } from 'react';
import { CardMedia, Container, Paper, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { getLikedSongs } from '../../actions/songs';
import SongCard from '../SongTile/SongTile';

const Profile = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      dispatch(getLikedSongs(navigate));
    }
  }, [dispatch, user]);

  const { likedSongs } = useSelector((state) => state.uploads);
  const { isLoading } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  const joinedDate = moment(user?.user?.createdAt).fromNow();

  return (
    <Container sx={classes.container}>
      <Paper sx={classes.paper}>
        <Grid container spacing={2} justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <CardMedia
              sx={classes.image}
              component="img"
              image={user?.user?.imageURL}
              alt="User Profile"
            />
          </Grid>
          <Grid item>
            <Typography variant="h3" sx={classes.text}>
              {user?.user?.displayName}
            </Typography>
            <Typography variant="h6" sx={classes.text}>
              Joined {joinedDate}
            </Typography>
            <Button
              component={Link}
              variant="outlined"
              color="inherit"
              to="/songupload"
              sx={classes.button}
            >
              Upload Song
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
          <CircularProgress sx={{ color: 'primary.main'}} />
        </Grid>
      ) : (
        <Paper sx={classes.paper}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Liked Songs
          </Typography>
          {likedSongs && likedSongs.length > 0 ? (
            <Grid container spacing={2}>
              {likedSongs.map((song) => (
                <Grid item key={song._id} xs={12} sm={6} md={4} lg={3}>
                  <SongCard song={song} h={180} w={230} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Your liked songs will show here</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Profile;

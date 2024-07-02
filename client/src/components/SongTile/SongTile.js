import React, { useEffect, useRef, useState } from 'react'
import { Card, Box, CardContent, Typography, IconButton } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSong, likeSong, playPause, playSong } from '../../actions/songs'
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../../config/firebase.config'
import { useNavigate } from 'react-router-dom'

const SongCard = ({ song, h = 200, w = 270, del=false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesC, setLikesC] = useState(isNaN(song?.likes?.length) ? 0 : song?.likes.length)
  const [isOverflowing, setIsOverflowing] = useState({
    songName: false,
    artist: false,
    album: false,
  });

  const songNameRef = useRef(null);
  const artistRef = useRef(null);
  const albumRef = useRef(null);
  useEffect(() => {
    console.log('test')
    const checkOverflow = (ref) => {
      if (ref.current) {
        return ref.current.scrollWidth > ref.current.clientWidth;
      }
      return false;
    };

    setIsOverflowing({
      songName: checkOverflow(songNameRef),
      artist: checkOverflow(artistRef),
      album: checkOverflow(albumRef),
    });
  }, [song]);

  useEffect(() => {
    if (song && Array.isArray(song.likes) && user && user.user) {
      setIsLiked(song.likes.includes(user.user._id));
    }
  }, [song, user]);

  const { isPlaying, songPlaying } = useSelector((state) => state.player)
  
  const handleLike = (e) => {
    e.stopPropagation()
    if (user) {
      if (isLiked) {
        setIsLiked(false)
        setLikesC(likesC - 1)
      } else {
        setIsLiked(true)
        setLikesC(likesC + 1)
      }
      dispatch(likeSong(song._id, navigate));
    }
  };

  const handleDelete = async(e) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      let url = song.imageURL
      let deleteRef = ref(storage, url)
      await deleteObject(deleteRef)
      url = song.songURL
      deleteRef = ref(storage, url)
      await deleteObject(deleteRef)
    } catch (error) {
      console.log('Error in deleting image', error)
    }
    dispatch(deleteSong(song._id, navigate))
  }
  
  const handlePlay = () => {
    if(isPlaying) {
      dispatch(playPause(false))
      dispatch(playSong(null))
    } else {
      dispatch(playSong(song))
      dispatch(playPause(true))
    }
  }

  return (
    <Card sx={{
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      width: w, 
      height: h, 
      backgroundImage: `url(${song.imageURL})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      color: '#fff', 
      position: 'relative'
    }} onClick={handlePlay}>
      <Box sx={classes.box}>
      <CardContent sx={{ flex: '1 0 auto', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
            <Typography
              ref={songNameRef}
              component="div"
              variant="h5"
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: isOverflowing.songName ? 'scroll 10s linear infinite' : 'none',
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
              }}
            >
              {song.songName}
            </Typography>
          </Box>
          <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
            <Typography
              ref={artistRef}
              variant="subtitle1"
              color="secondary.light"
              component="div"
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: isOverflowing.artist ? 'scroll 10s linear infinite' : 'none',
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
              }}
            >
              {song.artist}
            </Typography>
          </Box>
          <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
            <Typography
              ref={albumRef}
              variant="subtitle2"
              color="secondary.light"
              component="div"
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: isOverflowing.album ? 'scroll 10s linear infinite' : 'none',
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
              }}
            >
              {song.album}
            </Typography>
          </Box>
          {del && (
            <IconButton
              aria-label="delete"
              disabled={isDeleting}
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'secondary.main',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
          <IconButton aria-label="play/pause">
            {isPlaying && (song._id === songPlaying._id) ? (
              <PauseIcon sx={{ height: 38, width: 38, color: 'secondary.light' }} />
            ) : (
              <PlayArrowIcon sx={{ height: 38, width: 38, color: 'secondary.light' }} />
            )}
          </IconButton>
          <IconButton aria-label="like" onClick={handleLike}>
            {isLiked ? (<>
              <FavoriteIcon sx={{ height: 38, width: 38, color: 'primary.light' }} ></FavoriteIcon>
              <Typography sx={{color: 'white'}}>{likesC}</Typography>
            </>) : (<>
              <FavoriteIcon sx={{ height: 38, width: 38, color: 'secondary.light' }} ></FavoriteIcon>
              <Typography sx={{color: 'white'}}>{likesC}</Typography>
            </>)}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default SongCard;

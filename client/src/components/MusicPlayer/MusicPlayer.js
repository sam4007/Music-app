import React from 'react'
import { Container, IconButton } from '@mui/material'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close';
import { playPause, playSong } from '../../actions/songs'
import SongCard from '../SongTile/SongTile'

const MusicPlayer = () => {
    const dispatch = useDispatch()
    const { songPlaying } = useSelector((state) => state.player)
    const handleClose = () => {
        dispatch(playPause(false))
        dispatch(playSong(null))
    }
    return (
        <Container sx={{position: 'fixed', bottom: 0, right: 0, left: 0, display: 'flex'}}>
            <SongCard song={songPlaying} h={100} w={100} />
            <AudioPlayer src={songPlaying?.songURL} autoPlay={true} onPlay={() => (console.log('playing'))} />
            <IconButton onClick={handleClose}>
                <CloseIcon sx={{ color: 'secondary.dark'}} />
            </IconButton>
        </Container>
    )
}

export default MusicPlayer
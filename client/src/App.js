import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { Container } from '@mui/material'

import Auth from './components/Auth/Auth'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import UserPage from './components/UserPage/UserPage'
import Navbar from './components/Navbar/Navbar'
import SongUpload from './components/SongUpload/SongUpload'
import { useSelector } from 'react-redux'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import Album from './components/Albums/Album'
import Error from './components/Error'
import { useTheme } from './ThemeContext'


const App = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const location = useLocation()
    const { isPlaying } = useSelector((state) => state.player)

    const { isDarkMode } = useTheme();

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return (
        <Container maxWidth='xl'>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/songs' element={<Home />} />
                <Route path='/auth' element={user ? <Navigate to='/' /> : <Auth />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/songupload' element={<SongUpload />} />
                <Route path='/:id' element={<UserPage />} />
                <Route path='/allAlbum' element={<Album />} />
                <Route path='/error' element={<Error />} />
            </Routes>
            {isPlaying && (
                <MusicPlayer />
            )}
         </Container>
    )
}

export default App
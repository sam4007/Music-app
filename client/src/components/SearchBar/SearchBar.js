import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResults } from '../../actions/songs'
import { TextField, Paper, Typography, List, ListItem, ListItemText, Container, Avatar } from '@mui/material'
import SongCard from '../SongTile/SongTile'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const { searchResults } = useSelector((state) => state.uploads)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSearch = (e) => {
        const value = e.target.value
        setQuery(value)
        if (query) {
            dispatch(getSearchResults(query, navigate))
        } 
    }
    const handleUserRedirect = (id) => {
        navigate(`/${id}`)
    }
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <TextField
                fullWidth
                value={query}
                onChange={handleSearch}
                placeholder="Search songs, users, albums..."
                variant="outlined"
                sx={{backgroundColor: 'secondary.main', color: 'primary.main', mb: 3}}
            />
            {query && (
                <Paper style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1, maxHeight: '300px', overflow: 'auto', backgroundColor: 'secondary.light', color: 'secondary.light', }}>
                {searchResults.songs.length > 0 && (
                    <Container sx={{backgroundColor: 'secondary.light', p: 2}}>
                    <Typography variant="h6" sx={{backgroundColor: 'secondary.light'}}>Songs : </Typography>
                    <List>
                        {searchResults.songs.map((song) => (
                        <ListItem key={song._id} >
                            <SongCard song={song} w={500} h={80} />
                        </ListItem>
                        ))}
                    </List>
                    </Container>
                )}
                {searchResults.users.length > 0 && (
                    <Container sx={{backgroundColor: 'secondary.light', p: 2}}>
                    <Typography variant="h6" sx={{backgroundColor: 'secondary.light'}}>Users : </Typography>
                    <List sx={{backgroundColor: 'secondary.light'}}>
                        {searchResults.users.map((user) => (
                        <ListItem key={user._id} onClick={() => handleUserRedirect(user._id)}>
                            <Avatar src={user.imageURL} />
                            <ListItemText primary={user.displayName} />
                        </ListItem>
                        ))}
                    </List>
                    </Container>
                )}
                {searchResults.albums.length > 0 && (
                    <Container sx={{backgroundColor: 'secondary.light', p: 2}}>
                    <Typography variant="h6" sx={{backgroundColor: 'secondary.light'}}>Albums</Typography>
                    <List sx={{backgroundColor: 'secondary.light'}}>
                        {searchResults.albums.map((album) => (
                        <ListItem key={album._id} button>
                            <ListItemText primary={album.albumName} secondary={album.artist} />
                        </ListItem>
                        ))}
                    </List>
                    </Container>
                )}
                </Paper>
            )}
         </div>
    )
}

export default SearchBar
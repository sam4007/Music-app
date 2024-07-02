import React from 'react'
import { useStyles } from './styles'
import { Container, Paper, Typography, Grid, Box, CircularProgress } from '@mui/material'
import SongCard from '../SongTile/SongTile'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Paginate from '../Pagination'


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Album = () => {
    const query = useQuery()
    const page = query.get('page') || 1
    const classes = useStyles()
    const { albums } = useSelector((state) => state.uploads)
    const { isLoading } = useSelector((state) => state.auth)

    return (
        <Container maxWidth="xl" sx={{ my: 3 }}>
            <Paginate albumPage={page} />
            {isLoading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress sx={{ color: 'primary.main'}} />
                </Grid>
            ) : (<>
                {albums && albums.length > 0 ? (
                    albums.map((album) => (
                        <Box key={album._id}>
                            <Paper sx={classes.paper}>
                            <Typography variant='h6'>{album.albumName}</Typography>
                            <Grid container spacing={3}>
                                {album.songList && album.songList.length > 0 ? (
                                    album.songList.map((song) => (
                                        <Grid item key={song._id} xs={12} sm={6} md={4} lg={3}>
                                            <SongCard song={song} h={100} w={200}/>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography variant="h6">No songs available</Typography>
                                )}
                            </Grid>
                            </Paper>
                        </Box>
                        ))
                ) : (
                    <Typography variant="h6">No albums available</Typography>
                )}
            </>)}
        </Container>
    )
}

export default Album
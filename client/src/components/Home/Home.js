import React from 'react'
import { CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import SongCard from '../SongTile/SongTile';
import SearchBar from '../SearchBar/SearchBar';
import Paginate from '../Pagination';
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery()
  const page = query.get('page') || 1
  const { songs } = useSelector((state) => state.uploads);
  const { isLoading } = useSelector((state) => state.auth)

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <SearchBar />
      
      <Paginate page={page} />

      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
          <CircularProgress sx={{ color: 'primary.main'}} />
        </Grid>
        ) : (
        <Grid container spacing={3}>
          {songs && songs.length > 0 ? (
            songs.map((song) => (
              <Grid item key={song._id} xs={12} sm={6} md={4} lg={3}>
                <SongCard song={song} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6">No songs available</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};


export default Home
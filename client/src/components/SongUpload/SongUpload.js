import React, { useEffect, useState } from 'react';
import { useStyles } from './styles';
import { CircularProgress, Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { FileUploader, FileDeleter } from '../FileManager';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { uploadSong } from '../../actions/uploads';
import { getUploadedSongs } from '../../actions/songs';
import SongCard from '../SongTile/SongTile';

const SongUpload = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ songName: '', album: '', imageURL: '', songURL: '' });
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false)
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsUploading(true)
      dispatch(uploadSong(formData, navigate));
    };
    
  
    useEffect(() => {
      console.log('test')
      dispatch(getUploadedSongs(navigate));
    }, [dispatch]);
  
    const { uploadedSongs } = useSelector((state) => state.uploads)
    const { isLoading } = useSelector((state) => state.auth)
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
    return (
      <Container>
        <Grid container spacing={2} direction='column'>
          <Grid container item xs={12} sm={12} md={6} lg={6} direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Paper sx={classes.paper}>
              <Grid sx={{ my: 3 }} container item direction='row' spacing={2} justifyContent='center'>
                <Grid item>
                  <Typography variant="h3">Upload your songs</Typography>
                </Grid>
              </Grid>
              <form onSubmit={handleSubmit}>
                <Grid item container direction='column' spacing={2} justifyContent='center'>
                  <Grid item>
                    <TextField
                      sx={classes.input}
                      placeholder='Song Name'
                      name='songName'
                      label="Song Name"
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      sx={classes.input}
                      placeholder='Album'
                      name='album'
                      label="Album"
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item container spacing={2} direction='row' justifyContent='space-evenly'>
                    {formData.imageURL ? (
                      <Grid item>
                        <FileDeleter
                          formData={formData}
                          setFormData={setFormData}
                          isLoading={isImageLoading}
                          setIsLoading={setIsImageLoading}
                          isImage={true}
                        />
                      </Grid>
                    ) : (
                      <Grid item>
                        <FileUploader
                          formData={formData}
                          setFormData={setFormData}
                          isLoading={isImageLoading}
                          setIsLoading={setIsImageLoading}
                          isImage={true}
                        />
                      </Grid>
                    )}
                    {formData.songURL ? (
                      <Grid item>
                        <FileDeleter
                          formData={formData}
                          setFormData={setFormData}
                          isLoading={isAudioLoading}
                          setIsLoading={setIsAudioLoading}
                          isImage={false}
                        />
                      </Grid>
                    ) : (
                      <Grid item>
                        <FileUploader
                          formData={formData}
                          setFormData={setFormData}
                          isLoading={isAudioLoading}
                          setIsLoading={setIsAudioLoading}
                          isImage={false}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid item container justifyContent='flex-end'>
                    <Button sx={classes.submit} disabled={isUploading} variant='contained' type='submit'>Upload</Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item container xs={12} sm={12} md={6} lg={6} direction='column' justifyContent='center' alignItems='center'>
          {isLoading ? (
              <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                <CircularProgress sx={{ color: 'primary.main'}} />
              </Grid>
            ) : (
              <Paper sx={classes.paper}>
               <Typography variant='h3' sx={{ color: 'primary.dark', my: 3 }}>Uploads:</Typography>
                <Grid container direction='row' spacing={2} item>
                {uploadedSongs && uploadedSongs.length > 0 ? (
                  uploadedSongs.map((song) => (
                      <Grid item key={song._id}>
                        <SongCard song={song} w={300} h={110} del={true} />
                      </Grid>
                  ))
                ) : (
                  <Typography variant='h6' sx={{color: 'secondary.dark'}}>No Uploads</Typography>
                )}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  };

export default SongUpload;

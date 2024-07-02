import express from 'express'
import { getSearchResults, getAllSongs, uploadSong, getUserUploadedSongs, getUserLikedSongs, likeSong, deleteSong, getAllAlbums } from '../controllers/songs.js'
import auth from '../middleware/auth.js'


const router = express.Router()

router.get('/', getAllSongs)
router.get('/allAlbum', getAllAlbums)
router.get('/uploadedByUser', auth, getUserUploadedSongs)
router.get('/likedByUser', auth, getUserLikedSongs)
router.get('/search', getSearchResults)

router.post('/uploadsong', auth, uploadSong)

router.patch('/:id/likeSong', auth, likeSong)

router.delete('/:id/deleteSong', auth, deleteSong)

export default router

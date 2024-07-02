import axios from 'axios'

// const API = axios.create({ baseURL: 'http://localhost:5000'})
const API = axios.create({ baseURL: 'https://music-sv5c.onrender.com'})

API.interceptors.request.use(
    (req) => {
        const user = localStorage.getItem('profile');
        if (user) {
            const parsedUser = JSON.parse(user);
            req.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)

export const uploadSong = (formData) => API.post('/songs/uploadsong', formData)

export const fetchSongs = (page) => API.get(`/songs?page=${page}`)
export const fetchAlbums = (page) => API.get(`/songs/allAlbum?page=${page}`)

export const fetchUploadedSongs = () => API.get('/songs/uploadedByUser')
export const fetchLikedSongs = () => API.get('/songs/likedByUser')
export const likeSong = (id) => API.patch(`/songs/${id}/likeSong`)
export const deleteSong = (id) => API.delete(`/songs/${id}/deleteSong`)
export const getSearchResults = (query) => API.get(`/songs/search?q=${query}`)
export const getUser = (id) => API.get(`/user/${id}`)
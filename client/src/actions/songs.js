import * as api from '../api/index.js'
import { START_LOADING, STOP_LOADING, FETCH_ALL, FETCH_ALL_ALBUMS, FETCH_LIKED, FETCH_UPLOADED, LIKE, DELETE, PLAYSTOP, GET_SONG, SEARCH } from '../constants/actionTypes.js';



export const getSongs = (page, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING})
        const { data } = await api.fetchSongs(page);
        dispatch({ type: FETCH_ALL, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    } finally {
        dispatch({ type: STOP_LOADING})
    }
}

export const getAlbums = (page, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING})
        const { data } = await api.fetchAlbums(page);
        dispatch({ type: FETCH_ALL_ALBUMS, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    } finally {
        dispatch({ type: STOP_LOADING})
    }
}

export const getUploadedSongs = (navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING})
        const { data } = await api.fetchUploadedSongs();
        dispatch({ type: FETCH_UPLOADED, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    } finally {
        dispatch({ type: STOP_LOADING})
    }
}

export const getLikedSongs = (navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING})
        const { data } = await api.fetchLikedSongs();
        dispatch({ type: FETCH_LIKED, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    } finally {
        dispatch({ type: STOP_LOADING})
    }
}

export const likeSong = (id, navigate) => async (dispatch) => {
    try {
        const { data } = await api.likeSong(id)
        dispatch({ type: LIKE, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    }
}

export const deleteSong = (id, navigate) => async (dispatch) => {
    try {
        await api.deleteSong(id)
        dispatch({ type: DELETE, payload: id})
        navigate('/profile')
    } catch (error) {
        console.log(error)
        navigate('/error')
    }
}

export const playPause = (play) => async (dispatch) => {
    try {
        dispatch({ type: PLAYSTOP, payload: play})
    } catch (error) {
        console.log(error)
    }
}

export const playSong = (song) => async (dispatch) => {
    try {
        // console.log(song)
        dispatch({ type: GET_SONG, payload: song})
    } catch (error) {
        console.log(error)
    }
}

export const getSearchResults = (query, navigate) => async (dispatch) => {
    try {
        const { data } = await api.getSearchResults(query)
        dispatch({ type: SEARCH, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    }
}
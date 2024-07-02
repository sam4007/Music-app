import { CREATE, DELETE, FETCH_ALL, FETCH_ALL_ALBUMS, FETCH_LIKED, FETCH_UPLOADED, LIKE, SEARCH } from "../constants/actionTypes"

const uploadsReducer = (state = { albums: [], songs: [], uploadedSongs: [], likedSongs: [], searchResults: { songs: [], users: [], albums: [] } }, action) => {
    switch(action.type) {
        case CREATE:
            return { ...state, songs: [ ...state.songs, action.payload]}
        case FETCH_ALL:
            return { ...state, 
                        songs: action.payload.data,
                        currentPage: action.payload.currentPage,
                        numberOfPages: action.payload.numberOfPages,
                    }
        case FETCH_ALL_ALBUMS:
            return { ...state, 
                        albums: action.payload.data,
                        currentAlbumPage: action.payload.currentPage,
                        numberOfAlbumPages: action.payload.numberOfPages,
                    }
        case FETCH_UPLOADED:
            return { ...state, uploadedSongs: action.payload.data}
        case FETCH_LIKED:
            return { ...state, likedSongs: action.payload.data}
        case SEARCH:
            return { ...state, searchResults: action.payload}
        case DELETE:
            return { ...state, songs: state.songs.filter((song) => song._id !== action.payload)}
        case LIKE:
            return { ...state, songs: state.songs.map((song) => song._id === action.payload._id ? action.payload : song)}
        default:
            return state
    }
}

export default uploadsReducer
import { GET_SONG, PLAYSTOP } from "../constants/actionTypes"

const playerReducer = ( state = { isPlaying: false, songPlaying: {} }, action) => {
    switch(action.type) {
        case PLAYSTOP:
            return { ...state, isPlaying: action.payload }
        case GET_SONG:
            return { ...state, songPlaying: action.payload }
        default:
            return state
    }
}

export default playerReducer
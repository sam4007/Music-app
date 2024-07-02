import { AUTH, GET_USER, LOGOUT, START_LOADING, STOP_LOADING } from "../constants/actionTypes";

const authReducer = (state = { authData: null, user: {}, isLoading: false, error: null }, action) => {
    switch(action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data}));
            return { ...state, authData: action?.data }
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null}
        case GET_USER:
            return { ...state, user: action.payload }
        case START_LOADING:
            return { ...state, isLoading: true}
        case STOP_LOADING:
            return { ...state, isLoading: false}
        default:
            return state
    }
}

export default authReducer
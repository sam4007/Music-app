import * as api from '../api/index.js'
import { AUTH, GET_USER, START_LOADING, STOP_LOADING } from '../constants/actionTypes.js';

export const signIn = (formData, navigate) => async(dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
    } catch (error) {
        console.log(error);
        navigate('/error')
    }
}

export const signUp = (formData, navigate) => async(dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
    } catch (error) {
        console.log(error);
        navigate('/error')
    }
}

export const getUser = (id, navigate) => async(dispatch) => {
    try {
        dispatch({ type: START_LOADING})
        const { data } = await api.getUser(id)
        dispatch({ type: GET_USER, payload: data})
    } catch (error) {
        console.log(error)
        navigate('/error')
    } finally {
        dispatch({ type: STOP_LOADING})
    }
}
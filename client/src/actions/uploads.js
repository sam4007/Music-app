import * as api from '../api/index.js'
import { CREATE } from '../constants/actionTypes.js'

export const uploadSong = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.uploadSong(formData)
        dispatch({ type: CREATE, payload: data})
        navigate('/profile')
    } catch (error) {
        console.log(error)
        navigate('/error')
    }
}
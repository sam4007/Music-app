import mongoose, { Schema } from 'mongoose'

const songSchema = mongoose.Schema({
    songName: {
        type: String,
        required: true,
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album'
    },
    imageURL: {
        type: String,
        required: true,
    },
    songURL: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

const Song = mongoose.model('Song', songSchema)
export default Song
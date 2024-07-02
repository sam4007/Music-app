import mongoose, { Schema } from "mongoose"

const albumSchema = mongoose.Schema({
    albumName: {
        type: String,
        required: true,
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    songList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }
    ]
}, { timestamps: true})

const Album = mongoose.model('Album', albumSchema)
export default Album
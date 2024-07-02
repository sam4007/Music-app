import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose'

const userSchema = mongoose.Schema({
    displayName: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true
    },
    password: { 
        type: String, 
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    songsUploaded: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    songsLiked: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User
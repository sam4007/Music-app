import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Album from "../models/album.js";
import Song from "../models/song.js";
import User from "../models/user.js";

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User not existing"})
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "invalid Credentials "});
    
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "1h"});
    
        res.status(200).json({ user: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Someting went wrong.' });
    }
}

export const signUp = async (req, res) => {
    const { firstName, lastName, email, imageURL, password, confirmPassword, token } = req.body;
    if (token) {
        try {
            const existingUser = await User.findOne({ email });
    
            
            if (existingUser){
                const tokenNew = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "1h"})
                return res.status(200).json({ user: existingUser, token: tokenNew})
            }
            
            const hashedPassword = await bcrypt.hash('test', 12)
    
            const user = await User.create({ email, imageURL, password: hashedPassword, displayName: `${firstName} ${lastName}`, songsUploaded: [], songsLiked: [] });
            const tokenNew = jwt.sign({ email: user.email, id: user._id}, 'test', { expiresIn: "1h"})
            res.status(200).json({ user, token: tokenNew })
        } catch (error) {
            res.status(500).json({ message: 'Someting went wrong.', error: error.message });
        }
    } else {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(404).json({ message: "User already exists"});
            }
    
            if (password !== confirmPassword) return res.status(400).json({ message: " Password don't match "});
    
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.create({ email, imageURL, password: hashedPassword, displayName: `${firstName} ${lastName}`, songsUploaded: [], songsLiked: [] });
    
            const tokenNew = jwt.sign({ email: user.email, id: user._id}, 'test', { expiresIn: "1h"});
    
            res.status(200).json({ user, token: tokenNew});
        } catch (error) {
            res.status(500).json({ message: 'Someting went wrong.', error: error.message });
        }
    }
}

export const getUser = async(req, res) => {
    try {
        const { id } = req.params
    
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const songsWithDetails = await Promise.all(
            user.songsUploaded.map(async (id) => {
                try {
                    const song = await Song.findById(id);
                    const album = await Album.findById(song.album);
                    return {
                        ...song.toObject(),
                        artist: user?.displayName,
                        album: album?.albumName,
                    };
                } catch (error) {
                    console.error(`Error fetching song with id ${id}:`, error.message);
                    return null;
                }
            })
        );
    
        // Filter out any null values (songs that couldn't be fetched)
        const validSongs = songsWithDetails.filter(song => song !== null);
        const resultUser = { ...user.toObject(), songsUploaded: validSongs}
    
        res.status(200).json({ data: resultUser })
    } catch (error) {
        res.status(500).json({ message: 'Someting went wrong.', error: error.message });
    }
}
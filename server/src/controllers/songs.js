import Album from "../models/album.js";
import Song from "../models/song.js";
import User from "../models/user.js";


export const getAllSongs = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1) * LIMIT
        const total = await Song.countDocuments({})
        const songs = await Song.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        // Use Promise.all to fetch artist and album details in parallel
        const songsWithDetails = await Promise.all(
            songs.map(async (song) => {
                const artist = await User.findById(song?.artist);
                const album = await Album.findById(song?.album);

                // Return a new object with the updated details
                return {
                    ...song._doc,
                    artist: artist?.displayName,
                    album: album?.albumName,
                };
            })
        );
        res.status(200).json({ data: songsWithDetails, currentPage: Number(page), numberOfPages: Math.ceil(total/ LIMIT) });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const getAllAlbums = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 4
        const startIndex = (Number(page) - 1) * LIMIT
        const total = await Album.countDocuments({})
        const albums = await Album.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        const albumWithDetails = await Promise.all(
            albums.map(async (album) => {
                const artist = await User.findById(album?.artist);

                const songsWithDetails = await Promise.all(
                    album?.songList.map(async (id) => {
                        const song = await Song.findById(id);
                        return {
                            ...song.toObject(),
                            artist: artist?.displayName,
                            album: album?.albumName,
                        };
                    })
                );

                return {
                    ...album.toObject(),
                    artist: artist?.displayName,
                    songList: songsWithDetails
                };
            })
        );

        res.status(200).json({ data: albumWithDetails, currentPage: Number(page), numberOfPages: Math.ceil(total/ LIMIT) });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getUserUploadedSongs = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const songsWithDetails = await Promise.all(
            user?.songsUploaded.map(async (id) => {
                try {
                    const song = await Song.findById(id);
                    const album = await Album.findById(song?.album);
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

        res.status(200).json({ data: validSongs });
    } catch (error) {
        console.error('Error getting uploaded songs:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const getUserLikedSongs = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch all songs liked by the user in parallel
        const songsWithDetails = await Promise.all(
            user?.songsLiked.map(async (id) => {
                try {
                    const song = await Song.findById(id);
                    const album = await Album.findById(song?.album);
                    const artist = await User.findById(song?.artist)
                    return {
                        ...song.toObject(),
                        artist: artist?.displayName,
                        album: album?.albumName,
                    };
                } catch (error) {
                    // console.error(`Error fetching song with id ${id}:`, error.message);
                    return null;
                }
            })
        );
        // Filter out any null values (songs that couldn't be fetched)
        const validSongs = songsWithDetails.filter(song => song !== null);

        res.status(200).json({ data: validSongs });
    } catch (error) {
        console.error('Error getting liked songs:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const uploadSong = async (req, res) => {
    const { songName, album, imageURL, songURL } = req.body;

    if (!songName || !album || !imageURL || !songURL) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let existingAlbum = await Album.findOne({ albumName: album, artist: user._id });

        if (!existingAlbum) {
            existingAlbum = new Album({ albumName: album, artist: user?._id, songList: [] });
            await existingAlbum.save();
        }

        const newSong = new Song({
            songName,
            album: existingAlbum?._id,
            artist: user?._id,
            imageURL,
            songURL
        });

        await newSong.save();

        existingAlbum.songList.push(newSong._id);
        await existingAlbum.save();

        user.songsUploaded.push(newSong._id);
        await user.save();
        const resultSong = { 
                        ...newSong,
                        album: existingAlbum?.albumName,
                        artist: user?.displayName,
                    }
        res.status(201).json(resultSong);
    } catch (error) {
        console.error('Error uploading song:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const likeSong = async (req, res) => {
    try {
        const { id } = req.params; // ID of the song
        const userId = req.userId; // ID of the user

        // Find the song by ID
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already liked the song
        const isLiked = song?.likes?.includes(userId);

        if (isLiked) {
            // If the song is already liked, unlike it
            song.likes = song?.likes?.filter((id) => id.toString() !== userId);
            user.songsLiked = user?.songsLiked?.filter((songId) => songId.toString() !== id);
        } else {
            // If the song is not liked, like it
            song.likes.push(userId);
            user.songsLiked.push(song._id);
        }

        // Save the updated user
        await user.save();

        // Update the song's likes and return the updated song
        const updatedSong = await Song.findByIdAndUpdate(id, { likes: song?.likes }, { new: true });

        const artist = await User.findById(song?.artist);
        const album = await Album.findById(song?.album);

        const resultSong = { ...updatedSong,
                                artist: artist?.displayName,
                                album: album?.albumName,
                            }
        res.status(200).json(resultSong);
    } catch (error) {
        console.error('Error liking song:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

export const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const album = await Album.findById(song.album);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        // Remove song from user's uploaded songs
        user.songsUploaded = user?.songsUploaded.filter((songId) => songId.toString() !== id);
        await user.save();

        // Remove song from album's song list
        album.songList = album?.songList.filter((songId) => songId.toString() !== id);
        if (album.songList.length === 0) {
            // Delete album if it has no more songs
            await Album.findByIdAndDelete(album._id);
        } else {
            await album.save();
        }

        await Promise.all(song.likes.map(async (likeId) => {
            const userWhoLiked = await User.findById(likeId);
            if (userWhoLiked) {
                userWhoLiked.songsLiked = userWhoLiked.songsLiked.filter((songId) => songId.toString() !== id);
                await userWhoLiked.save();
            }
        }));

        // Delete the song
        await Song.findByIdAndDelete(id);

        res.json({ message: 'Song Deleted' });
    } catch (error) {
        console.error('Error deleting song:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const getSearchResults = async (req, res) => {
    const query = req.query.q

    if (!query) return res.status(400).json({ message: 'Query missing'})

    try {
        let songs = await Song.find({ songName: new RegExp(query, 'i') })
        const users = await User.find({ displayName: new RegExp(query, 'i') })
        const albums = await Album.find({ albumName: new RegExp(query, 'i')})
        const songsWithDetails = await Promise.all(
            songs.map(async (song) => {
                try {
                    const user = await User.findById(song.artist);
                    const album = await Album.findById(song.album);
                    return {
                        ...song.toObject(),
                        artist: user?.displayName,
                        album: album?.albumName,
                    };
                } catch (error) {
                    // console.error(`Error fetching song with id ${id}:`, error.message);
                    return null;
                }
            })
        );
        const albumWithDetails = await Promise.all(
            albums.map(async (album) => {
                try {
                    const user = await User.findById(album.artist)
                    return {
                        ...album.toObject(),
                        artist: user?.displayName,
                    }
                } catch (error) {
                    return null;
                }
            })
        )
        // Filter out any null values (songs that couldn't be fetched)
        const validSongs = songsWithDetails.filter(song => song !== null);
        res.status(200).json({ songs: validSongs, users, albums: albumWithDetails })
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}



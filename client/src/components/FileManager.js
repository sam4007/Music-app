import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { storage } from '../config/firebase.config';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { useStyles } from './SongUpload/styles';

export const FileUploader = ({ formData, setFormData, isLoading, setIsLoading, isImage }) => {
    const classes = useStyles()
    const [uploadProgress, setUploadProgress] = useState(0)
    
    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `${isImage ? 'Images' : 'Audio'}/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setIsLoading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Optional: You can handle progress updates here if needed
                setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
            },
            (error) => {
                console.log('File Upload Failed', error);
                setIsLoading(false);
            },
            async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    if (isImage) {
                        setFormData({ ...formData, imageURL: url });
                    } else {
                        setFormData({ ...formData, songURL: url });
                    }
                } catch (error) {
                    console.log('Error getting download URL', error);
                } finally {
                    setIsLoading(false);
                }
            }
        );
    };

    return (
        <>
            <Button sx={classes.fileInput} variant='contained' startIcon={<UploadIcon />} disabled={isLoading}>
                <label>
                    {isLoading ? (
                        <div>{`${uploadProgress} %`}</div>
                    ) : (
                    <div>
                        Upload {isImage ? 'Image' : 'Song'}
                        <input type="file" style={{maxHeight: 0, maxWidth: 0}} name="upload-file" accept={isImage ? 'image/*' : 'audio/*'} onChange={uploadFile} />
                    </div>)}
                </label>
            </Button>
        </>
    );
};

export const FileDeleter = ({ formData, setFormData, isLoading, setIsLoading, isImage }) => {
    const classes = useStyles()
    const deleteFile = async (e) => {
        setIsLoading(true);
        let url = isImage ? formData.imageURL : formData.songURL;

        const deleteRef = ref(storage, url);

        try {
            await deleteObject(deleteRef);
            if (isImage) {
                setFormData((prevData) => ({ ...prevData, imageURL: '' }));
            } else {
                setFormData((prevData) => ({ ...prevData, songURL: '' }));
            }
        } catch (error) {
            console.log('File deletion failed', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div>
                <Button sx={classes.fileInput} variant='contained' startIcon={<DeleteIcon />} onClick={deleteFile} disabled={isLoading}>Delete {isImage ? 'Image' : 'Song'}</Button>
            </div>
        </>
    )
};



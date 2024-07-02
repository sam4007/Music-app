import React, { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { PaginationItem, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbums, getSongs } from '../actions/songs';



const Paginate = ({page = false, albumPage = false}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()


    useEffect(() => {
        if (page)
            dispatch(getSongs(page, navigate))
        if (albumPage)
            dispatch(getAlbums(albumPage, navigate))
    }, [dispatch, page, albumPage]); // Add dispatch and page as dependencies

    const { numberOfPages, numberOfAlbumPages } = useSelector((state) => state.uploads);
    const { isLoading } = useSelector((state) => state.auth)

    
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress sx={{ color: 'primary.main'}} />
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" mb={3}>
            {page && <Pagination
                    count={numberOfPages}
                    page={Number(page) || 1}
                    variant="outlined"
                    color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            {...item}
                            component={Link}
                            to={`/songs?page=${item.page}`}
                        />
                    )}
                />
            }
            {albumPage && <Pagination
                    count={numberOfAlbumPages}
                    page={Number(albumPage) || 1}
                    variant="outlined"
                    color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            {...item}
                            component={Link}
                            to={`/allAlbum?page=${item.page}`}
                        />
                    )}
                />
            }
        </Box>
    );
}

export default Paginate
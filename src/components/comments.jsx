import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material ui imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';


/*
    info object stuff:
    infoObject{
        ownComment: boolean value for whether or not this is own comment
        authorKey: author id for comment,
        authorName: first name of author,
        body: comment body,
        commentKey: self explanatory,
    }
*/
const CommentBox = ({ infoObject, handleCommentDelete, handleCommentUpdate }) => {

    const [newBody, setNewBody] = useState(infoObject.body);


    return (
        <Box>
            {infoObject.ownComment &&
                <TextField
                    multiline
                    rows={2}
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                />

            }
            {!infoObject.ownComment && <h3> {infoObject.body}</h3>}
            <p>{infoObject.authorName} </p>
            {infoObject.ownComment &&
                <Box>
                    <Button onClick={() => (handleCommentUpdate(infoObject.authorKey, infoObject.authorName, infoObject.commentKey, newBody))}>Update Comment</Button>
                    <Button onClick={() => (handleCommentDelete(infoObject.commentKey))}>Delete Comment</Button>
                </Box>
            }
        </Box>
    )
}

export default CommentBox;
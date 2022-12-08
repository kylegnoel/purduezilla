import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';


//style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(-44.8px, 40.8px, 0px);"

const NotificationsBox = (notifications) => {
    const navigate = useNavigate();

    return (
        /*
        {notification[0].sourcePath}
                    {notification[0].body}
                    {notification[0].type}
                    {notification[0].timeMade}
                    {notification[1]}
        <div style={{
            color: "black",
            border: "1px",
            borderStyle: "solid",
            zIndex: 10,
            position: "absolute",
            inset: "80px 0vw 0 0",
            margin: "0px",
            opacity: "solid",
            width: "auto"
        }}
        >
            notif <br></br>
            notif <br></br>
            notif <br></br>
            notif <br></br>
        </div>
        {comments.map((comment) => (
                                <CommentBox
                                    infoObject={{
                                        ownComment: user.key === comment[0].author,
                                        authorKey: comment[0].author,
                                        authorName: comment[0].firstName,
                                        body: comment[0].body,
                                        commentKey: comment[1],
                                    }}
                                    handleCommentDelete={deleteComment}
                                    handleCommentUpdate={updateComment}
                                ></CommentBox>
                            ))}
            */
        <div>

            {notifications.notifications.map((notification) => (
                <Box>
                    <Button onClick={(e) => {
                        e.preventDefault();

                        navigate(`/${notification[0].type}/${notification[0].sourcePath}`);
                    }}>
                        {notification[0].body}</Button>
                    <p>{notification[0].timeMade}</p>
                </Box>
            ))}
        </div>

    )
}


export default NotificationsBox;
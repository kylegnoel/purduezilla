const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const e = require('cors');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'purduezilla@gmail.com',
        pass: 'pbcjctdntqiibrfn'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        const dest = req.body.dest;

        const mailOptions = {
            from: 'PurdueZilla Team <purduezilla@gmail.com>',
            to: dest,
            subject: 'TESTING', 
            html: 'THIS BETTER WORK'
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sent');
        });
    });    
});

/*
 *  This function will be uploaded to Google Cloud Function.
 *  It gets triggered whenever there is a new task being created.  
 */
exports.sendMailToAddedTaskOwnersAndAssignedUsers = functions.database.ref('tasks/{taskId}')
        .onCreate((snapshot, context) => {
            const taskData = snapshot.val();
            const taskName = taskData.name;
            const auEmail = taskData.assignedUserId[1].email;
            const ownerId = taskData.ownerId;
            
            console.log('assigned user email: ' + auEmail);
            // send email notif to au
            transporter.sendMail(generaeteTaskAssignedUserNotificationEmail(auEmail, taskName), (error, info) => {
                if (error) {
                    console.log('messed up the assigned user email ' + error.toString());
                } else {
                    console.log('sent')
                }
            });

            // send email notif to owner
            return admin.database().ref('users/' + ownerId).once('value', (ss) => {
                const userInfo = ss.val();
                transporter.sendMail(generateTaskOwnerNotificationEmail(userInfo.email, taskName), (error, info) => {
                    if (error) {
                        console.log('messed up' + error.toString());
                    } else {
                        console.log('sent');
                    }
                });
            })
})


exports.sendMailToNewGroupMember = functions.database.ref('groups/{groupId}/memberId/{memberId}')
        .onCreate(snapshot => {
            const memberId = snapshot.val();
            const groupNameRef = snapshot.ref.parent.parent.child('name');            
            console.log('group name: ' + groupNameRef);
            groupNameRef.once('value', (data) => {
                admin.database().ref('users/' + memberId).once('value', (ss) => {
                    const userInfo = ss.val();
                    transporter.sendMail(generateNewGroupMemberEmail(userInfo.email, data.val()), (error, info) => {
                        if (error) {
                            console.log('messed up' + error.toString());
                        } else {
                            console.log('sent');
                        }
                    });
                })
            })

})

// subject: USER1 commented on your TASK
// content: COMMENT 
exports.sendMailToTaggedUser = functions.database.ref('users/{userId}/tagged/{tagId}')
        .onCreate(snapshot => {
            const taggedData = snapshot.val();
            const authorId = taggedData.author;
            const comment = taggedData.body;
            const taskId = taggedData.taskKey;

            const receiverEmailRef = snapshot.ref.parent.parent.child('email');

            receiverEmailRef.once('value', (email) => {
                admin.database().ref('users/'+authorId).once('value', (authorData) => {
                    const author = authorData.val().firstName;
                    admin.database().ref('tasks/'+taskId).once('value', (taskData) => {
                        const td = taskData.val();
                        const taskName = td.name;
                        transporter.sendMail(generateTaggedUserEmail(email.val(), author, comment, taskName), (error) => {
                            if (error) {
                                console.log(error.toString());
                            } else {
                                console.log('sent');
                            }
                        })
                    })
                })
            })
        })

const generateTaskOwnerNotificationEmail = (dest, taskName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: "You now own task: " + taskName,
        html: 'please get it done a$ap'
    }
}

const generaeteTaskAssignedUserNotificationEmail = (dest, taskName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: 'You are now assigned to do ' + taskName,
        html: 'Get working'
    }
}

const generateNewGroupMemberEmail = (dest, groupName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: 'Welcome to ' + groupName,
        html: 'better start contributing'
    }
}

const generateNewProjectMemberEmail = (dest, projectName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: 'You are now member of ' + projectName,
        html: 'be nice to each other'
    }
}

const generateTaggedUserEmail = (dest, commenter, comment, taskName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: commenter + ' commented on ' + taskName,
        html: comment
    }
}
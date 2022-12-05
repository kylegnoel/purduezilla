
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

exports.sendMailToAddedTaskOwners = functions.database.ref('tasks/{taskId}')
        .onCreate((snapshot, context) => {
            const taskData = snapshot.val();
            const taskName = taskData.name;
            console.log(taskName)
            const owners = taskData.owners;
            owners.forEach(owner => {
                console.log("This is how owner looks like " + owner);
                const ownerInfo = owner[1];
                console.log("owner info " + ownerInfo);
                const ownerEmail = ownerInfo.email;
                console.log(ownerEmail)
                transporter.sendMail(generateTaskOwnerNotificationEmail(ownerEmail, taskName), (error, inf) => {
                    if (!error) {
                        console.log('sent')
                    }
                    console.log('you done messed up' + error.toString())
                })
            });
})

const generateTaskOwnerNotificationEmail = (dest, taskName) => {
    return {
        from: 'PurdueZilla Team <purduezilla@gmail.com>',
        to: dest,
        subject: "You now own task: " + taskName,
        html: 'please get it done a$ap'
    }
}
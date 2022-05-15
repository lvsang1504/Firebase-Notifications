//import firebase functions modules
const functions = require('firebase-functions');
//import admin module
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.pushNotification = functions.database.ref('/FallDetector/{pushId}').onWrite((change, context) => {
    console.log('Push notification event triggered');

    //  Get the current value of what was written to the Realtime Database.
    const value = change.after.val();
    console.log('The liveurl value is now', value);

    // Create a notification
    const payload = {
        notification: {
            title: "Phát hiện té ngã",
            body:"Cảnh báo phát hiện té ngã lúc: " + value,
            badge: "1",
            sound:"et_o_et.mp3"
        },
        data:{
            message:"Phát hiện té ngã! "
         }
    };

    //Create an options object that contains the time to live for the notification and the priority
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    return admin.database().ref('fcmToken').once("value").then(allToken => {
        if (allToken.val()) {
            const token = Object.keys(allToken.val());
            return admin.messaging().sendToDevice(token, payload, options).then(response => { });
        }
    });
});
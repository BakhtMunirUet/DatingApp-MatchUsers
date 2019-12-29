const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.matchfunction = functions.firestore.document(
    'like_page/{currentUserId1}/{currentUserId2}/{otherUserId}'
).onCreate((snapshot, context) => {
    var userInfo = snapshot.data();

    console.log("The user found in like trigger function");
    console.log(userInfo.userId);
    console.log(userInfo.fromUserId);
    console.log(userInfo.distanceBetween);

    var likeUserObj = {
        fromUserId: userInfo.fromUserId,
        otherUserId: userInfo.userId,
        distanceBetween : userInfo.distanceBetween,
        userToken: userInfo.userToken
    }

    var notificationUser1 = {
        fromUserId: userInfo.fromUserId,
        otherUserId: userInfo.userId,
        userToken: userInfo.userToken,
        notification: "on",
        block: "unblock"
    }

    var userNewId1 = {
        userId : userInfo.fromUserId,
    }

    var countMessages1 = {
        userId : userInfo.fromUserId,
        currentCount :  "0",
        readdUnread : "1"
    }

    var wholeCount1 = {
        userId : userInfo.fromUserId,
        wholeCount :  "0"
    }

    db.collection('like_page').doc(userInfo.userId).collection(userInfo.userId).get().then((likeUser) => {
        if (likeUser.empty) {
            console("not found in this documents");
        }
        else {
            for (var likeUserData of likeUser.docs) {
                if (userInfo.fromUserId == likeUserData.data().userId
                    && userInfo.userId == likeUserData.data().fromUserId) {
                    
                    console.log("We have found your match");
                    console.log(likeUserData.data().userId);
                    console.log(likeUserData.data().fromUserId);
                    console.log(likeUserData.data().distanceBetween);

                    var otherLikeUserObj = {
                        otherUserId: likeUserData.data().userId,
                        fromUserId: likeUserData.data().fromUserId,
                        distanceBetween: likeUserData.data().distanceBetween,
                        userToken: likeUserData.data().userToken,
                    }

                    var notificationUser2 = {
                        otherUserId: likeUserData.data().userId,
                        fromUserId: likeUserData.data().fromUserId,
                        userToken: likeUserData.data().userToken,
                        notification: "on",
                        block: "unblock"

                    }

                    var userNewId2 = {
                        userId : likeUserData.data().fromUserId
                    }

                    var countMessages2 = {
                        userId : likeUserData.data().fromUserId,
                        currentCount :  "0",
                        readdUnread : "1"
                    }
                    var wholeCount2 = {
                        userId : likeUserData.data().fromUserId,
                        wholeCount :  "0"
                    }

                    db.collection('matches_page').doc(userInfo.fromUserId).set(userNewId1);
                    db.collection('matches_page').doc(userInfo.fromUserId).collection(userInfo.fromUserId).doc(userInfo.userId).set(likeUserObj);
                    db.collection('matches_page').doc(userInfo.userId).set(userNewId2);
                    db.collection('matches_page').doc(userInfo.userId).collection(userInfo.userId).doc(userInfo.fromUserId).set(otherLikeUserObj);
                    db.collection('notification_on_off').doc(userInfo.fromUserId).set(userNewId1);
                    db.collection('notification_on_off').doc(userInfo.fromUserId).collection(userInfo.fromUserId).doc(userInfo.userId).set(notificationUser1);
                    db.collection('notification_on_off').doc(userInfo.userId).set(userNewId2);
                    db.collection('notification_on_off').doc(userInfo.userId).collection(userInfo.userId).doc(userInfo.fromUserId).set(notificationUser2);
                    db.collection('inbox_id').doc(userInfo.fromUserId).set(userNewId1);
                    db.collection('inbox_id').doc(userInfo.userId).set(userNewId2);
                    db.collection('count_messeages').doc(userInfo.fromUserId).set(wholeCount1);
                    db.collection('count_messeages').doc(userInfo.fromUserId).collection(userInfo.fromUserId).doc(userInfo.userId).set(countMessages1);
                    db.collection('count_messeages').doc(userInfo.userId).set(wholeCount2);
                    db.collection('count_messeages').doc(userInfo.userId).collection(userInfo.userId).doc(userInfo.fromUserId).set(countMessages2);
                }
            }
        }
    });

});

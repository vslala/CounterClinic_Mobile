import firebase from 'react-native-firebase';


const registerToken = () => {
    firebase.messaging().getToken()
    .then( (token) => {
        console.log("Token: ", token);
    })
    .catch(error => {
        console.log(error);
    })
}

export {
    registerToken
}
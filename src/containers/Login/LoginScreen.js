import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, withTheme } from 'react-native-paper';
import Toast from '../../components/ToastAndroid/Toast';
import AsyncStorage from '@react-native-community/async-storage';
// import { TextInput } from 'react-native-gesture-handler';
import { style } from "../../styles/Stylesheet";
import { Api, handleErrors, constants } from '../../utils/ApiUtil';


function LoginScreen(props) {

    const  { navigate } = props.navigation;

    const checkLoginState = async () => {
        let accessToken = await AsyncStorage.getItem('accessToken');
        let loggedInUser = JSON.parse(await AsyncStorage.getItem('loggedInUser'));
        if (accessToken && loggedInUser) {
            console.log("Logged In User:", loggedInUser);
            if (loggedInUser.roles.includes(constants.userRole.doctor)) {
                navigate('DoctorDashboard', {loggedInUser: loggedInUser});
                return;
            }
            navigate('Dashboard', {loggedInUser: loggedInUser, accessToken: accessToken});
            return;
        }
        return;
    }
    useEffect(() => {
        checkLoginState();
    }, []);

    const ref = useRef({
        navigationOptions: {
            title: 'Welcome',
        }
    });

    const [toastState, setToastState] = useState({
        message: '',
        visible: false
    });

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (name) => (value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleLogin = () => {
        console.log("Logging into the system");
        fetch(Api.online.loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TimezoneOffset': new Date().getTimezoneOffset()
            },
            body: JSON.stringify(formData)
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(data => {
            console.log("Login Successful! ", data);
            console.log("Access Token:", data.accessToken);

            // persist logged in user and access token
            AsyncStorage.setItem('accessToken', data.accessToken)
            .then( () => AsyncStorage.setItem('loggedInUser', JSON.stringify(data.user) ))
            .catch( (error) => console.log("Error persisting data:", error) );
            
            // show success message
            setToastState({
                ...toastState,
                message: "You've been logged in successfully!",
                visible: true
            });
            
            if (data.user.roles.includes(constants.userRole.doctor)) {
                navigate('DoctorDashboard', { loggedInUser: data.user });
                return;
            }
            navigate('Dashboard', { loggedInUser: data.user });
        })
        .catch(error => {
            console.log("Error encountered while trying to login into the system. Error cause: ", error);
            setToastState({
                ...toastState,
                message: "Error while trying to login.",
                visible: true
            })
        })
        .then( () => {
            setToastState({
                ...toastState,
                visible: false
            })
        });
    }

    return (
        <View style={{padding: 30, flex:1, justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <Toast message={toastState.message} visible={toastState.visible} />
            <View style={style.formControl}>
                {/* <Text style={style.formLabel}>
                    Username
                </Text> */}
                <TextInput 
                    label="Username"
                    editable={true}
                    mode="outlined"
                    // style={style.formInput}
                    value={formData.username} 
                    // placeholder="Username"
                    onChangeText={handleChange('username')}
                />
            </View>

            <View style={style.formControl}>
                {/* <Text style={{alignSelf: "flex-start"}}>
                    Password
                </Text> */}
                <TextInput 
                    secureTextEntry={ true }
                    editable={ true }
                    mode="outlined"
                    // style={style.formInput}
                    value={ formData.password } 
                    placeholder="Password"
                    onChangeText={ handleChange('password') }
                />
            </View>

            <View style={style.formControl} onTouchEnd={handleLogin}>
                <Button 
                    // title="Login"
                    style={{alignSelf:"stretch"}}
                    accessibilityLabel="Click here to Login"
                    mode="contained"
                    dark={true}
                    disabled={formData.username == '' || formData.password == ''}>
                        Login
                </Button>
            </View>
            <View style={style.formControl}>
                <Text style={style.link}
                    onPress={() => { console.log("Navigating to Register Screen!"); navigate('Register');} }
                >
                    Register Here!
                </Text>
            </View>
        </View>
    );
}

LoginScreen.navigationOptions = ({ navigation }) => ({
    title: "Login Here!"
});

export default withTheme(LoginScreen);


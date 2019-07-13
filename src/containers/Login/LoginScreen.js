import React, { useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Toast from '../../components/ToastAndroid/Toast';
import AsyncStorage from '@react-native-community/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { style } from "../../styles/Stylesheet";


function LoginScreen(props) {

    const  { navigate } = props.navigation;

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
        fetch('http://206.189.30.73:8084/api/v1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TimezoneOffset': new Date().getTimezoneOffset()
            },
            body: JSON.stringify(formData)
        })
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
            
            navigate('Dashboard', { loggedInUser: data.user });
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
                    editable={true}
                    style={style.formInput}
                    value={formData.username} 
                    placeholder="Username"
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
                    style={style.formInput}
                    value={ formData.password } 
                    placeholder="Password"
                    onChangeText={ handleChange('password') }
                />
            </View>

            <View style={style.formControl}>
                <Button 
                    title="Login"
                    onPress={handleLogin}
                    accessibilityLabel="Click here to Login"
                    disabled={formData.username == '' || formData.password == ''}
                />
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

export default LoginScreen;


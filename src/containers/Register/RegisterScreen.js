import React, { useState } from 'react';
import { Text, Button, View, ScrollView, ProgressBarAndroid } from 'react-native';
import { style } from '../../styles/Stylesheet';
import { TextInput } from 'react-native-gesture-handler';
import Toast from '../../components/ToastAndroid/Toast';
import { Api } from '../../utils/ApiUtil';

function RegisterScreen(props) {

    const { navigate } = props.navigation;

    const [toastState, setToastState] = useState({visible: false, message: ''});

    const [progressState, setProgressState] = useState({animating: false});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        preferredLanguage: 'ENGLISH',
        roles: ['PATIENT']
    });

    const handleChange = (name) => (value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleRegistration = () => {
        console.log("Registering patient: ", formData);
        setProgressState({...progressState, animating: true});
        fetch(Api.online.registrationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(user => {
            console.log("Registration successful!", user);
            setProgressState({...progressState, animating: false});
            setToastState({
                ...toastState,
                message: "You've been registered successfully!",
                visible: true
            });
            
            // navigate to login
            navigate('Login', {registeredUser: user});
        })
    }

    return (
        <View style={style.container}>
            <Toast visible={toastState.visible} message={toastState.message} />

            <ScrollView style={{alignSelf: "stretch"}}>
            {
                [
                    {placeholder: "First Name", name: "firstName", value: formData.firstName, type: "givenName"},
                    {placeholder: "Last Name", name: "lastName", value: formData.lastName, type: "givenName"},
                    {placeholder: "Email Address", name: "email", value: formData.email, type: "emailAddress"},
                    {placeholder: "Mobile", name: "mobile", value: formData.mobile, type: "telephoneNumber"},
                    {placeholder: "Username", name: "username", value: formData.username, type: "username"},
                    {placeholder: "Password", name: "password", value: formData.password, type: "password"},
                ].map( (item, index) => (
                    <View style={style.formControl} key={index}>
                        <TextInput 
                            style={style.formInput}
                            secureTextEntry={item.name == 'password'}
                            textContentType={item.type}
                            placeholder={item.placeholder}
                            onChangeText={handleChange(item.name)}
                            value={item.value}
                        />
                    </View>
                ) )
            }
                <Button
                    title="Register"
                    onPress={handleRegistration}
                    accessibilityLabel="Click here to register"
                />

                <Text style={style.link}
                    onPress={() => { console.log("Navigating to Login Screen!"); navigate('Login');} }
                >
                    Already have an account. Login Here!
                </Text>

                <ProgressBarAndroid styleAttr="Horizontal" style={{alignSelf: "stretch"}} animating={progressState.animating} />

            </ScrollView>
        </View>
    );
}

RegisterScreen.navigationOptions = ({navigation}) => ({
    title: "Register Here"
});

export default RegisterScreen;
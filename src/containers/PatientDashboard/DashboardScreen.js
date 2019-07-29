import React, { useState, useRef } from 'react';
import { Text, Button, View, ScrollView, ProgressBarAndroid, TouchableOpacity, ToolbarAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';
import { NavigationActions } from 'react-navigation';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import { constants } from '../../utils/ApiUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

function DashboardScreen(props) {

    const { navigate } = props.navigation;     
    const { params } = props.navigation.state;
    
    const logoutAction = async () => {
        AsyncStorage.removeItem(constants.accessToken);
        navigate('LoginScreen');
    }


    return (
        <View style={style.container} >
            <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                <ClickBox accessible={true} accessibilityLabel="Book Appointment" boxText={["Book Appointment"]} onClick={() => navigate('BookAppointment')} />
                <ClickBox accessible={true} accessibilityLabel="View Appointments" boxText={["View Appointments"]} onClick={() => navigate('OnlineAppointments', {loggedInUser: params.loggedInUser, accessToken: params.accessToken})} />
            </View>

        </View>
    );
}

DashboardScreen.navigationOptions = ({navigate}) => ({
    title: "My Dashboard",
    header: props => (
        <CustomHeader title="Dashboard" {...props} />
    ),
});

export default DashboardScreen;
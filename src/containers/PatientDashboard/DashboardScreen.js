import React, { useState, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';
import AsyncStorage from '@react-native-community/async-storage';
import { constants } from '../../utils/ApiUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import { withTheme } from 'react-native-paper';

function DashboardScreen(props) {

    const { navigate } = props.navigation;     
    const { params } = props.navigation.state;
    
    const logoutAction = async () => {
        AsyncStorage.removeItem(constants.accessToken);
        navigate('LoginScreen');
    }

    const handleQRScan = () => {
        console.log("Scanning QR Code...");
    }


    return (
        <View style={style.container} >
            <ScrollView style={{alignSelf: "stretch"}}>
                <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                    <ClickBox boxWidth={250} accessible={true} accessibilityLabel="Book Appointment" boxText={["Book Appointment"]} onClick={() => navigate('BookAppointment')} />
                    <ClickBox boxWidth={250} accessible={true} accessibilityLabel="View Appointments" boxText={["View Appointments"]} onClick={() => navigate('OnlineAppointments', {loggedInUser: params.loggedInUser, accessToken: params.accessToken})} />
                    {/* <ClickBox boxWidth={250} accessible={true} accessibilityLabel="Scan QR Code" boxText={["Scan QR Code"]} onClick={handleQRScan} /> */}
                    <ClickBox boxWidth={250} accessible={true} accessibilityLabel="Appointment Status" boxText={["Appointment Status"]} onClick={() => navigate('WalkInAppointmentInfoForm', {loggedInUser: params.loggedInUser, accessToken: params.accessToken})} />
                </View>
            </ScrollView>

        </View>
    );
}

DashboardScreen.navigationOptions = ({navigate}) => ({
    title: "My Dashboard",
    header: props => (
        <CustomHeader title="Dashboard" {...props} />
    ),
});

export default withTheme(DashboardScreen);
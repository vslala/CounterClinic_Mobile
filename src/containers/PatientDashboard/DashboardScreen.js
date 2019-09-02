import React, { useState, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';
import AsyncStorage from '@react-native-community/async-storage';
import { constants } from '../../utils/ApiUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import {withTheme, List, Divider} from 'react-native-paper';

function DashboardScreen(props) {

    const { navigate } = props.navigation;     
    const { params } = props.navigation.state;
    
    const logoutAction = async () => {
        AsyncStorage.removeItem(constants.accessToken);
        navigate('LoginScreen');
    }


    function navigateTo(screen) {
        return () => navigate(screen, {
            loggedInUser: params.loggedInUser,
            accessToken: params.accessToken
        });
    }

    return (
        <View style={style.container} >
            <ScrollView style={{alignSelf: "stretch"}}>
                {
                    [
                        {title: 'Book Appointment', description: '', onClick: () => navigate('BookAppointment'), icon: 'schedule'},
                        {title: 'View Appointments', description: '', onClick: navigateTo('OnlineAppointments'), icon: 'list'},
                        {title: 'Scan QR Code', description: '', onClick: navigateTo('QRCodeScanner'), icon: 'scanner'},
                        {title: 'Appointment Status', description: '', onClick: navigateTo('WalkInAppointmentInfoForm'), icon: 'notifications'  },
                        {title: 'Contact Clinic', description: '', onClick: navigateTo('ContactClinic'), icon: 'contacts'},
                    ].map((listItem, index) => (
                        <View key={index}>
                            <List.Item
                                title={listItem.title}
                                description={listItem.description}
                                left={() => <List.Icon icon={listItem.icon} />}
                                onPress={listItem.onClick}
                            />
                            <Divider/>
                        </View>
                    ))
                }
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
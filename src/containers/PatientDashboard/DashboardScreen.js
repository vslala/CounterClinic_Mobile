import React from 'react';
import { Text, Button, View, ScrollView, ProgressBarAndroid, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';

function DashboardScreen(props) {

    const { navigate } = props.navigation;

    return (
        <View style={style.container} >

            <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                <ClickBox accessible={true} accessibilityLabel="Book Appointment" boxText={["Book Appointment"]} onClick={() => navigate('BookAppointment')} />
                <ClickBox accessible={true} accessibilityLabel="View Appointments" boxText={["View Appointments"]} onClick={() => navigate('ViewAppointments')} />
            </View>

        </View>
    );
}

DashboardScreen.navigationOptions = ({navigate}) => ({
    title: "My Dashboard",
    headerLeft: null
});

export default DashboardScreen;
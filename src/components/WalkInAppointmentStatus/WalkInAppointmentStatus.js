import React from 'react';
import {View } from 'react-native';
import { withTheme } from 'react-native-paper';
import { WebView} from 'react-native-webview';
import { style } from '../../styles/Stylesheet';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

function WalkInAppointmentStatus(props) {

    const { selectedDoctor, appointmentId } = props.navigation.state.params;

    console.log(props.navigation);
    console.log(`Selected Doctor: ${selectedDoctor.userId}, AppointmentID: ${appointmentId}`);

    const uri = `http://192.168.0.101:3000/walk-in/appointment-status?doctorId=${selectedDoctor.userId}&appointmentId=${appointmentId}`;

    console.log("URL: ", uri);

    return (
        <WebView
            source={{ uri: uri }}
            style={{marginTop: 20}}
        />
    );
}

WalkInAppointmentStatus.navigationOptions = ({navigation}) => ({
    title: "Appointment Status",
    header: (props) => (
        <CustomHeader backButton={true} title="Book Appointment" {...props} />
    )
})

export default withTheme(WalkInAppointmentStatus);
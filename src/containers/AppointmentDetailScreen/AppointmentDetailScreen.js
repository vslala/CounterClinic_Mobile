import React from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Api } from '../../utils/ApiUtil';
import AppointmentDetail from '../../components/AppointmentDetail/AppointmentDetail';
import moment from 'moment';
import '../../utils/DateUtil';
import { style } from '../../styles/Stylesheet';
import { LOCAL_DATE_FORMAT, LOCAL_TIME_FORMAT, LOCAL_12_HOUR_FORMAT } from '../../utils/DateUtil';

function AppointmentDetailScreen(props) {

    console.log("Navigation Params: ", [props.navigation.state.params]);
    const { navigate } = props.navigation;
    const { bookedAppointmentDetail } = props.navigation.state.params;

    const handleOnSuccess = () => {
        navigate('Login');
    }

    return (
        <View style={style.container}>
            <ScrollView style={{alignSelf: "stretch"}}>
            <AppointmentDetail 
                doctorName={bookedAppointmentDetail.selectedDoctor.fullName}  
                appointmentDate={moment(bookedAppointmentDetail.selectedDate).format(LOCAL_DATE_FORMAT)}
                appointmentTime={moment(bookedAppointmentDetail.selectedSlot.startTime, LOCAL_TIME_FORMAT).format(LOCAL_12_HOUR_FORMAT)}
                onSuccess={handleOnSuccess}
            />
            </ScrollView>
        </View>
    );
}

AppointmentDetailScreen.propTypes = {
    bookedAppointmentDetail: PropTypes.object
}

AppointmentDetailScreen.navigationOptions = ({navigation}) => ({
    title: "Appointment Details"
});

export default AppointmentDetailScreen;
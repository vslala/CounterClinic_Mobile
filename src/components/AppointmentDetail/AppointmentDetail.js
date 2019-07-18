import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';
import { style } from '../../styles/Stylesheet';

function AppointmentDetail(props) {

    console.log("Appointment Detail: ", props);

    return (
        <View style={{...style.container, borderWidth: 1, borderColor: 'grey', borderRadius: 10, padding: 5}}>
            <View style={{...style.container, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                <Text style={{...style.formLabel, fontSize: 18}}>
                    Booked Appointment Detail
                </Text>
            </View>
            {
                [
                    {itemKey: "Doctor Name", itemValue: props.doctorName},
                    {itemKey: "Appointment Date", itemValue: props.appointmentDate},
                    {itemKey: "Appointment Time", itemValue: props.appointmentTime},
                ].map( (item, index) => (
                    <View key={index} style={{flex: 1, flexDirection: "row", alignSelf: "stretch", alignItems: "center", justifyContent: "center"}}>
                        <View style={style.container}>
                            <Text style={style.formLabel}>{item.itemKey}</Text>
                        </View>
                        <View style={{...style.container}}>
                            <Text style={style.formLabel}>{item.itemValue}</Text>
                        </View>
                    </View>
                ))
            }
            <View style={style.formControl}>
                <Text>Thank you for booking an appointment with us. The appointment receipt will be emailed to you shortly.</Text>
            </View>
            <View style={style.formControl}>
                <Button title="Okay" style={style.formInput} onPress={props.onSuccess} />
            </View>
        </View>
    );
}

AppointmentDetail.navigationOptions = ({navigate}) => ({
    title: 'Appointment Details'
});

AppointmentDetail.propTypes = {
    doctorName: PropTypes.string.isRequired,
    appointmentDate: PropTypes.string.isRequired,
    appointmentTime: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
}

export default AppointmentDetail;
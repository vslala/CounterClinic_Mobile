import React, { useState, useEffect } from 'react';
import { View , Modal } from 'react-native';
import { style } from '../../styles/Stylesheet';
import { handleErrors, Api, constants } from '../../utils/ApiUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Divider, Button, Text, Portal, DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import moment from 'moment';
import '../../utils/DateUtil';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LOCAL_DATE_TIME_FORMAT, LOCAL_12_HOUR_FORMAT, formatLocalTimeTo12HourFormat } from '../../utils/DateUtil';

function ViewAppointments(props) {

    useEffect(() => {
        fetchBookedAppointments();
    }, []);

    const {navigate, goBack} = props.navigation;

    const [bookedAppointments, setBookedAppointments] = useState([]);

    const fetchBookedAppointments = async () => {
        console.log("Fetching booked appointments of a user");
        let loggedInUser = JSON.parse(await AsyncStorage.getItem(constants.loggedInUser));
        let accessToken = await AsyncStorage.getItem(constants.accessToken);
        console.log("Logged In User: ", loggedInUser);
        let fetchUrl = `${Api.online.fetchAppointments}?patientId=${loggedInUser.userId}`;
        console.log(`Access Token: ${accessToken}, Fetch Url: ${fetchUrl}`);
        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(handleErrors)
        .then((response) => response.json())
        .then((bookedAppointments) => {
            console.log("Fetched Booked Appointments of the patients: ", bookedAppointments);
            setBookedAppointments(bookedAppointments);
        })
        .catch(error => {
            console.log("Encountered Error while trying to fetch booked appointments for the patient. Error: ", error);
            console.log("Error message: ", error.message);
        });
    }

    const [modalState, setModalState] = useState({
        visible: false,
        bookedAppointment: {
            doctorFirstName: '',
            doctorLastName: '',
            appointmentDate: '',
            slot: {},
            amountPaid: '00'
        },
        onDismiss: () => setModalState({...modalState, visible: false})
    });
    const showAppointmentInfo = (bookedAppointment) => () => {
        console.log("showing appointment info!")
        setModalState({modalState, visible: true, bookedAppointment: bookedAppointment});
    }

    

    return (
        <View style={style.container}>
            <Modal visible={modalState.visible} 
                animationType="slide"
                transparent={false}
                onPress={modalState.onDismiss}
                presentationStyle="overFullScreen"
                >
                <DataTable style={{padding: 10}}>
                    <DataTable.Header>
                        <DataTable.Title>Booked Appointment Info</DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>Doctor</DataTable.Cell>
                        <DataTable.Cell>{modalState.bookedAppointment.doctorFirstName} {modalState.bookedAppointment.doctorLastName}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Appointment Date</DataTable.Cell>
                        <DataTable.Cell>{modalState.bookedAppointment.appointmentDate}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Appointment Time</DataTable.Cell>
                        <DataTable.Cell>{formatLocalTimeTo12HourFormat(modalState.bookedAppointment.slot.startTime)}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Doctor Fees</DataTable.Cell>
                        <DataTable.Cell>{modalState.bookedAppointment.amountPaid}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
                <View style={style.container} onTouchEnd={() => setModalState({...modalState, visible: false})}>
                    <Button style={{alignSelf:"stretch"}}
                        accessibilityLabel="Click here to Close"
                        mode="contained"
                        dark={true}
                    >
                        Close
                    </Button>
                </View>
            </Modal>

            <ScrollView style={{alignSelf: "stretch"}}>
                <List.Section>
                {
                    bookedAppointments.map( (bookedAppointment, index) => {
                        let formattedDateUtc = formatLocalTimeTo12HourFormat(bookedAppointment.slot.startTime);
                        console.log("Formatted Date: ", formattedDateUtc);

                        // let utcDate = moment.utc(formattedDateUtc).toDate();
                        let appointmentInfo = () => (
                            <View style={{flex: 1, flexDirection: "column"}}>
                                <View style={{flex: 1, flexDirection:"row"}}>
                                    <Text style={style.formLabel}><Icon name="person" size={15} color="blue" />{bookedAppointment.doctorFirstName} {bookedAppointment.doctorLastName}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection:"row"}}>
                                    <Text style={style.formLabel}><Icon name="access-time" size={15} color="blue" />{formattedDateUtc}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection:"row"}}>
                                    <Text style={style.formLabel}>Amount Paid: <Icon name="attach-money" size={15} color="blue" />{bookedAppointment.amountPaid}</Text>
                                </View>
                            </View>
                        );
                        return (
                            <View key={index}>
                                <List.Item 
                                    title={bookedAppointment.appointmentDate}
                                    description={appointmentInfo}
                                    left={() => <List.Icon icon="event" color="blue" />}
                                    right={() => <View onTouchEnd={showAppointmentInfo(bookedAppointment)}><List.Icon icon="info" color="blue" /></View>}
                                />
                                <Divider />
                            </View>
                        );
                    })
                }
                </List.Section>
            </ScrollView>
        </View>
    );
}

ViewAppointments.navigationOptions = ({navigation}) => ({
    title: "My Appointments",
    header: props => (
        <CustomHeader backButton={true} title="My Appointments" {...props} />
    )
});

export default ViewAppointments;
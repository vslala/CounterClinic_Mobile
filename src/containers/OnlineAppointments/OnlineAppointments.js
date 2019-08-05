import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { style } from '../../styles/Stylesheet';
import { constants, Api, handleErrors } from '../../utils/ApiUtil';
import AsyncStorage from '@react-native-community/async-storage';
import ShowList from '../../components/ShowList/ShowList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LOCAL_DATE_TIME_FORMAT, LOCAL_12_HOUR_FORMAT, formatLocalTimeTo12HourFormat } from '../../utils/DateUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import { List, DataTable, Button, Divider, withTheme } from 'react-native-paper';
import SearchBar from '../../components/SearchBar/SearchBar';

function OnlineAppointments(props) {

    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = (queryStr, accessToken) => {
        let url = `${Api.online.fetchAppointments}?${queryStr}`;
        console.log("Url: ", url);
        fetch(url)
        .then(handleErrors)
        .then(response => response.json())
        .then(appointments => {
            console.log("Fetched all online appointments for the user");
            setAppointments(appointments);
            setViewData(appointments);
        })
        .catch(error => {
            console.log("Encountered Error while trying to fetch appointments.", error);
            setAppointments([]);
        });
    }

    const { params } = props.navigation.state;

    const fetchUserAppointments = async () => {
        let loggedInUser = await AsyncStorage.getItem(constants.loggedInUser);
        let accessToken = await AsyncStorage.getItem(constants.accessToken);

        loggedInUser = params.loggedInUser;
        accessToken = params.accessToken;

        console.log(`loggedInUser: `, loggedInUser);
        if (loggedInUser.roles.includes(constants.userRole.doctor)) {
            fetchAppointments(`doctorId=${loggedInUser.userId}`, accessToken);
        } else {
            fetchAppointments(`patientId=${loggedInUser.userId}`, accessToken);
        }
    }
    useEffect(() => {
        fetchUserAppointments()
    }, [])

    const handleItemClick = (item) => {
        console.log("Selected Item: ", item);
        setModalState({...modalState, visible: true, bookedAppointment: item});
    }

    var getSearchName = (item) => {
        let name = '';
        if (params.loggedInUser.roles.includes(constants.userRole.doctor)) {
            name = item.patientFirstName + ' ' + item.patientLastName;
        } else {
            name = item.doctorFirstName + ' ' + item.doctorLastName;
        }
        return name;
    }

    const buildDescription = (item) => {
        let name = getSearchName(item);

        

        let formattedDateUtc = formatLocalTimeTo12HourFormat(item.slot.startTime);
        return (
            <View style={{flex: 1, flexDirection: "column"}}>
                <View style={{flex: 1, flexDirection:"row"}}>
                    <Text style={style.formLabel}><Icon name="person" size={15} color="blue" />{name}</Text>
                </View>
                <View style={{flex: 1, flexDirection:"row"}}>
                    <Text style={style.formLabel}><Icon name="access-time" size={15} color="blue" />{formattedDateUtc}</Text>
                </View>
                <View style={{flex: 1, flexDirection:"row"}}>
                    <Text style={style.formLabel}>Amount Paid: <Icon name="attach-money" size={15} color="blue" />{item.amountPaid}</Text>
                </View>
            </View>
        );
    }

    const [modalState, setModalState] = useState({
        visible: false,
        onPress: () => {setModalState({...modalState, visible: false})},
        bookedAppointment: {
            slot: {}
        }
    });
    const modal = (
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
    );

    const [viewData, setViewData] = useState([]);
    const handleSearch = (query) => {
        // console.log("searching for: ", query);
        const appointmentsCopy = [ ...appointments ];
        
        setViewData(
            appointmentsCopy.reduce( (prev, curr) => {
                let name = getSearchName(curr);

                if ( name.includes(query) ) {
                    prev.push(curr);
                }
                return prev;
            }, [])
        );
    }

    return (
        <View style={style.container}>
            {modal}
            <SearchBar handleSearch={handleSearch} searchBarPlaceholderText = "Search by doctor name" />
            <Divider />
            <ShowList 
                buildTitle={(item) => item.appointmentDate }
                buildDescription={buildDescription}
                data={viewData}
                leadingIcon={"event"}
                tailIcon="info"
                iconColor={"blue"}
                onItemClick={handleItemClick}
            />
        </View>
    );

}

OnlineAppointments.navigationOptions = ({navigation}) => ({
    title: "My Appointments",
    header: props => (
        <CustomHeader backButton={true} title="My Appointments" {...props} />
    )
});

export default withTheme(OnlineAppointments);
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Picker, PickerItem, DatePickerAndroid, ProgressBarAndroid, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';
import Toast from '../../components/ToastAndroid/Toast';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import moment from 'moment';
import * as DateUtil from '../../utils/DateUtil';
import { Api, handleErrors } from '../../utils/ApiUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import { Divider, TextInput as PaperTextInput, withTheme } from 'react-native-paper';
import { Colors, ProgressBar } from 'react-native-paper';
import * as Progress from 'react-native-progress';

async function DatePicker(props) {
    try {
        if (props.open) {
            return await DatePickerAndroid.open({
                date: new Date()
            });
        }
        return null;
    } catch({code, message}) {
        console.warn('Cannot open date picker', message);
    }
    return null;
}

function BookAppointment(props) {

    const { navigate } = props.navigation;

    const [toastState, setToastState] = useState({visible: false, message: ''});
    const [progressBarState, setProgressBarState] = useState({
        animating: false,
        indeterminate: true,
        progress: 0
    });

    const [doctors, setDoctors] = useState([]);

    const [availableSlots, setAvailableSlots] = useState([]);

    const [formData, setFormData] = useState({
        selectedDoctor: '',
        selectedDate: new Date(),
        selectedSlot: '',
        additionalComments: ''
    });

    const fetchDoctors = async () => {
        console.log("Fetching doctors from url: ", Api.walkin.getAllDoctors);
        fetch(Api.walkin.getAllDoctors, {
            method: 'GET',
            headers: {
                'Authorization': await AsyncStorage.getItem('accessToken')
            }
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(doctorList => {
            console.log("List of doctors:", doctorList);
            setDoctors(doctorList);
        })
        .catch( error => console.log(error));
    }

    useEffect(() => {
        fetchDoctors();
    }, [])

    const handleChange = name => value => {
        // console.log("Selected Value: ", value);
        if (name == 'selectedDoctor') {
            setToastState({
                ...toastState,
                visible: false,
                message: 'Please select doctor first'
            });
        }
        
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const fetchAvailableSlots = async (doctorId, selectedDate) => {
        setProgressBarState({...progressBarState, animating: true});
        console.log("Fetching available slots for the selected doctor");
        let formattedDate = moment(selectedDate).format(DateUtil.LOCAL_DATE_FORMAT);
        let url = `${Api.online.availableDoctorSlots}?doctorId=${encodeURIComponent(doctorId)}&appointmentDate=${encodeURIComponent(formattedDate)}`;
        let accessToken = await AsyncStorage.getItem('accessToken');
        console.log("Calling url: " + url + ", Access Token: " + accessToken);
        fetch(url, {
            headers: {
                'Authorization': accessToken
            }
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(slots => {
            setProgressBarState({...progressBarState, animating: false});
            console.log("Available Slots:", slots);
            setAvailableSlots(slots);
        })
        .catch(error => {
            setProgressBarState({...progressBarState, animating: false});
            console.log(error);
            console.log(error.message);
            setAvailableSlots([]); // empty slots
            // show error snackbar here
            setToastState({...toastState, visible: true, message: "No slots available for the selected date."});
        })
        .then(() => {
            setToastState({...toastState, visible: false});
        })
    }

    const selectDate = async () => {
        if (formData.selectedDoctor === '') {
            setToastState({
                ...toastState,
                visible: true,
                message: 'Please select doctor first'
            });
            return;
        }
        
        try {
            const {action, year, month, day } = await DatePickerAndroid.open({date: formData.selectedDate});
            if (action !== DatePickerAndroid.dismissedAction) {
                let selectedDate = new Date(year, month, day);
                console.log("Selected Date: ", selectedDate);
                setFormData({
                    ...formData,
                    selectedDate: selectedDate
                });
                fetchAvailableSlots(formData.selectedDoctor.userId, selectedDate);
            }
        } catch ({code, message}) {
            console.warn("Date picker cannot open.", message);
        }
        
    }

    const handleBookAppointment = async () => {
        console.log("Booking appointment for:", formData);
        
        let data = {
            additionalComments: formData.additionalComments,
            appointmentDate: moment(formData.selectedDate).format(DateUtil.LOCAL_DATE_FORMAT),
            doctorId: formData.selectedDoctor.userId,
            slotId: formData.selectedSlot.slotId
        };

        let accessToken = await AsyncStorage.getItem('accessToken');
        console.log('Access Token: ', accessToken);
        fetch(Api.online.bookAppointment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(data)
        })
        .then(handleErrors)
        .then(response => console.log("Response: ", response))
        .then(data => {
            setProgressBarState({...progressBarState, animating: false});
            console.log("Appointment booked successfully!", data);
            setToastState({...toastState, visible: true, message: "The appointment has been booked successfully!"});
            navigate('AppointmentDetailScreen', {bookedAppointmentDetail: formData});
        })
        .catch(error => {
            setProgressBarState({...progressBarState, animating: false});
            console.log(error);
            // TODO: Uncomment below line of code
            setToastState({...toastState, visible: true, message: "There was some error trying to book the appointment."});
            // navigate('AppointmentDetailScreen', {bookedAppointmentDetail: formData});
        })
        .then(() => {
            setToastState({...toastState, visible: false});
        })
    }

    const chooseDateBox = [
        <Text style={{fontSize: 12}}>Choose Appointment Date</Text>,
        <Divider style={{width: 150, height: 5}} />,
        <Text style={style.body2}>{formData.selectedDate.toDateString()}</Text>
    ];
    
    return (
        <View style={ style.container }>
            <Toast visible={toastState.visible} message={toastState.message} />
            <View style={ style.formControl}>
                <Text style={{...style.formLabel, fontSize: 16, margin: 5, color: "grey"}}>
                    Please use below form to book an appointment. Make sure you fill the form in the right order (top-to-bottom) for best experience.
                </Text>
                <Divider />
            </View>
            <ScrollView style={{alignSelf: "stretch"}}>
            
            <View style={ style.formControl }>
                <Text style={style.formLabel}>Select Your Doctor</Text>
                <Picker style={ style.formInput }
                    selectedValue={formData.selectedDoctor}
                    onValueChange={handleChange('selectedDoctor')}
                >
                    <Picker.Item label="None" value="" />
                    {
                        doctors.map( (doctor, index) => (
                            <Picker.Item key={index} label={doctor.fullName} value={doctor} />
                        ))
                    }
                </Picker>
                <Divider />
            </View>
            
            <View >
                <ClickBox boxText={chooseDateBox} accessible={formData.selectedDoctor != ''} accessibilityLabel="Choose Appointment Date" onClick={selectDate} />
                <Divider />
            </View>
            <View style={style.formControl}>
                <Text style={style.formLabel}>Select Appointment Slot</Text>
                <Picker style={style.formInput}
                    selectedValue={formData.selectedSlot}
                    onValueChange={handleChange('selectedSlot')}
                >
                    <Picker.Item label="None" value="" />
                    {
                        availableSlots.map( (slot,index) => (
                            <Picker.Item key={index} 
                            label={DateUtil.formatLocalTimeTo12HourFormat(slot.startTime) + ' - ' + DateUtil.formatLocalTimeTo12HourFormat(slot.endTime)} 
                            value={slot} />
                        ))
                    }
                </Picker>
                <Divider />
            </View>
            <View style={style.formControl}>
                {/* <Text style={style.formLabel}>Any additional comments for the clinic</Text> */}
                <PaperTextInput 
                    multiline={true}
                    label="Any additional comments for the clinic"
                    mode="outlined"
                    // style={{...style.formInput, height: 100}}
                    value={formData.additionalComments}
                    placeholder="Please tell us everything we should know..."
                    onChangeText={handleChange('additionalComments')}
                />
                <Divider />
            </View>
            <View style={style.formControl}>
                <Button 
                    title="Book Appointment"
                    onPress={() => {
                        setProgressBarState({...progressBarState, animating: true}); 
                        handleBookAppointment();
                    }}
                />
            </View>
            {
                progressBarState.animating ? (
                    <View style={style.formControl}>
                        <Progress.Bar indeterminate={true} width={300} />
                    </View>
                ) : false 
            }
            </ScrollView>
        </View>
    );
}

BookAppointment.navigationOptions = ({navigation}) => ({
    title: "Book Appointment",
    header: props => (
        <CustomHeader backButton={true} title="Book Appointment" {...props} />
    )
});

export default withTheme(BookAppointment);
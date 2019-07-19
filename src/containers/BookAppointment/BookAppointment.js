import React, { useState, useEffect } from 'react';
import { View, Text, Button, Picker, PickerItem, DatePickerAndroid, ProgressBarAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';
import Toast from '../../components/ToastAndroid/Toast';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import moment from 'moment';
import * as DateUtil from '../../utils/DateUtil';
import { Api, handleErrors } from '../../utils/ApiUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

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
        indeterminate: true
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

    const showLoader = () => {
        setProgressBarState({...progressBarState, animating: true});
    }

    const hideLoader = () => {
        setProgressBarState({...progressBarState, animating: false});
    }

    const fetchAvailableSlots = async (doctorId, selectedDate) => {
        showLoader();
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
            hideLoader();
            console.log("Available Slots:", slots);
            setAvailableSlots(slots);
        })
        .catch(error => {
            hideLoader();
            console.log(error);
            console.log(error.message);
            // show error snackbar here
            setToastState({...toastState, visible: true, message: error.message});
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
        showLoader();
        console.log("Booking appointment for:", formData);
        // navigate('AppointmentDetailScreen', {bookedAppointmentDetail: formData});
        // return;
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
            hideLoader();
            console.log("Appointment booked successfully!", data);
            setToastState({...toastState, visible: true, message: "The appointment has been booked successfully!"});
            navigate('AppointmentDetailScreen', {bookedAppointmentDetail: formData});
        })
        .catch(error => {
            hideLoader();
            console.log(error);
            // TODO: Uncomment below line of code
            setToastState({...toastState, visible: true, message: "There was some error trying to book the appointment."});
            // navigate('AppointmentDetailScreen', {bookedAppointmentDetail: formData});
        })
    }

    const chooseDateBox = [
        "Choose Appointment Date",
        formData.selectedDate.toDateString()
    ];
    
    return (
        <View style={ style.container }>
            <Toast visible={toastState.visible} message={toastState.message} />
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
            </View>
            <View style={style.formControl}>
                <ClickBox boxText={chooseDateBox} boxHeight={50} accessible={formData.selectedDoctor != ''} accessibilityLabel="Choose Appointment Date" onClick={selectDate} />
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
            </View>
            <View style={style.formControl}>
                <Text style={style.formLabel}>Any additional comments for the clinic</Text>
                <TextInput 
                    multiline={true}
                    style={{...style.formInput, height: 100}}
                    value={formData.additionalComments}
                    placeholder="Please tell us everything we should know..."
                    onChangeText={handleChange('additionalComments')}
                />
            </View>
            <View style={style.formControl}>
                <Button 
                    title="Book Appointment"
                    onPress={handleBookAppointment}
                />
            </View>
            <View style={style.formControl}>
                <ProgressBarAndroid animating={progressBarState.animating} indeterminate={progressBarState.indeterminate} key="progressBar"  />
            </View>
            </ScrollView>
        </View>
    );
}

BookAppointment.navigationOptions = ({navigation}) => ({
    title: "Book Appointment",
    header: props => (
        <CustomHeader title="Book Appointment" {...props} />
    )
});

export default BookAppointment;
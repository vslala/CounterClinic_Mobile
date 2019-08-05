import React, {useState, useEffect} from 'react';
import { View, Button, Picker } from 'react-native';
import { Text, TextInput, Title, Divider } from 'react-native-paper';
import {style} from '../../styles/Stylesheet';
import Toast from '../../components/ToastAndroid/Toast';
import { fetcher } from '../../utils/ApiUtil';
import moment from 'moment';
import '../../utils/DateUtil';
import { LOCAL_DATE_TIME_FORMAT } from '../../utils/DateUtil';
import CustomHeader from '../../components/CustomHeader/CustomHeader';


function WalkInAppointmentInfoForm(props) {

    const {navigate} = props.navigation;

    const [walkInAppointmentInfoForm, setWalkInAppointmentInfoForm] = useState({
        selectedDoctor: {},
        appointmentId: 0
    })
    const handleChange = (name) => (value) => {
        setWalkInAppointmentInfoForm({...walkInAppointmentInfoForm, [name]: value});
    }

    const handleFormSubmit = () => {
        console.log("Navigating to Appointment Status Screen");
        fetcher.walkInAppointment(walkInAppointmentInfoForm.appointmentId)
        .then(appointmentInfo => {
            let createdAt = appointmentInfo.walkInAppointment.createdAt;
            if (moment().isAfter(moment(createdAt, LOCAL_DATE_TIME_FORMAT), 'day')) { // if appointment creation date is before today
                showSnackbar("Your appointment has passed. Contact reception.");
                return;
            }
            navigate('WalkInAppointmentStatus', {selectedDoctor: walkInAppointmentInfoForm.selectedDoctor, appointmentId: walkInAppointmentInfoForm.appointmentId});
        })
        .catch(error => {
            console.log("Encountered Error: ", error);
            showSnackbar("The appointment is invalid. Please contact receptionist.");
        })
        
    }

    const [snackbar, setSnackbar] = useState({open:false, message: ''});
    const showSnackbar = (message) => {
        setSnackbar({...snackbar, open: true, message: message});
        setTimeout(()=>{
            setSnackbar({...snackbar, open: false});
        }, 6000);
    }

    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        fetcher.allDoctors.then(doctors => {
            setDoctors(doctors);
        })
        .catch(error => {
            console.log("Encountered Error while fetch doctors: ", error);
        }) ;

    }, [])
    
    return (
        <View style={style.container}>
            <Toast 
                visible={snackbar.open}
                message={snackbar.message}
            />
            <View style={style.formControl}>
                <Title>Enter below info to get live status</Title>
            </View>
            <View style={ style.formControl }>
                <Text style={style.formLabel}>Select Your Doctor</Text>
                <Picker style={ style.formInput }
                    selectedValue={walkInAppointmentInfoForm.selectedDoctor}
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
            <View style={style.formControl}>
                <TextInput 
                    label="Appointment Id"
                    keyboardType="number-pad"
                    value={`${walkInAppointmentInfoForm.appointmentId}`}
                    style={style.formInput}
                    onChangeText={handleChange('appointmentId')}
                    mode="flat"
                />
                <Divider />
            </View>
            <View style={style.formControl} onTouchEnd={handleFormSubmit}>
                <Button 
                    title="Show Status"
                />
            </View>
        </View>
    );
}

WalkInAppointmentInfoForm.navigationOptions = ({navigation}) => ({
    title: "Walk-In Appointment Status",
    header: props => (
        <CustomHeader backButton={true} title="Walk-In Appointment Status" {...props} />
    )
});

export default WalkInAppointmentInfoForm;
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Picker, PickerItem, DatePickerAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { style } from '../../styles/Stylesheet';
import ClickBox from '../../components/Box/ClickBox';

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

    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        selectedDoctor: '',
        selectedDate: new Date(),
        selectedSlot: '',
        additionalComments: ''
    });

    const fetchDoctors = async () => {
        
        fetch('http://192.168.0.100:8080/user/all/DOCTOR', {
            method: 'GET',
            headers: {
                'Authorization': await AsyncStorage.getItem('accessToken')
            }
        })
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
        console.log("Selected Value: ", value);
        if (formData.selectedDoctor && name == 'selectedDate') {
            // fetch available slots of a doctor.
            
        }
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const selectDate = async () => {
        try {
            const {action, year, month, day } = await DatePickerAndroid.open({date: formData.selectedDate});
            if (action !== DatePickerAndroid.dismissedAction) {
                console.log("Selected Date: ", new Date(year, month, day));
                setFormData({
                    ...formData,
                    selectedDate: new Date(year, month, day)
                });
            }
        } catch ({code, message}) {
            console.warn("Date picker cannot open.", message);
        }
        
    }
    
    return (
        <View style={ style.container }>
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
                <ClickBox boxText={formData.selectedDate.toDateString()} accessible={true} accessibilityLabel="Choose Appointment Date" onClick={selectDate} />
            </View>
        </View>
    );
}

BookAppointment.navigationOptions = ({navigation}) => ({
    title: "Book Appointment"
});

export default BookAppointment;
import React from 'react';
import { View } from 'react-native';
import { style } from '../../styles/Stylesheet';
import { ScrollView } from 'react-native-gesture-handler';
import ClickBox from '../../components/Box/ClickBox';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import { Divider } from 'react-native-paper';

function DoctorDashboard(props) {

    const { navigate } = props.navigation;
    const { params } = props.navigation.state;

    const navigateTo = (to) => {
        console.log("Navigating to WalkInAppointment Screen");
        navigate(to, { loggedInUser:  params.loggedInUser, accessToken: params.accessToken})
    }

    return (
        <View style={style.container}>
            <ScrollView style={{alignSelf: "stretch"}}>
                <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                    <ClickBox 
                        boxText={["Walk In Appointments"]}
                        onClick={() => navigateTo('WalkInAppointments') }
                    /> 
                    <ClickBox 
                        boxText={["Online Appointments"]}
                        onClick={() => navigateTo('OnlineAppointments')}
                    /> 
                </View>
            </ScrollView>
        </View>
    );
}

DoctorDashboard.navigationOptions = ({navigate}) => ({
    title: "My Dashboard",
    header: props => (
        <CustomHeader title="Doctor Dashboard" {...props} />
    ),
});

export default DoctorDashboard;
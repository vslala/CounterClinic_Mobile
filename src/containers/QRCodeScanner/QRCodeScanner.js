import React from 'react';
import { View } from 'react-native';
import { withTheme, Title } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

function QRCodeScanner(props) {

    const { navigate } = props.navigation;

    const onSuccess = (e) => {
        let data = JSON.parse(e.data);
        console.log("QRCode Data: ", data);
        navigate('WalkInAppointmentStatus', {selectedDoctor: {"userId": data.appointedDoctorId}, appointmentId: data.appointmentId});
    }

    return (
        <QRCodeScanner
            onRead={this.onSuccess}
            topContent={<Title>Scan the QRCode displayed on the Screen.</Title>}
        />
    );
}

QRCodeScanner.navigationOptions = ({navigate}) => ({
    title: "Scan QR Code",
    header: props => (
        <CustomHeader backButton={true} title="Scan QR Code" {...props} />
    ),
});

export default withTheme(QRCodeScanner);
import React, {Fragment} from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './src/containers/Login/LoginScreen';
import RegisterScreen from './src/containers/Register/RegisterScreen';
import DashboardScreen from './src/containers/PatientDashboard/DashboardScreen';
import BookAppointment from './src/containers/BookAppointment/BookAppointment';
import AppointmentDetailScreen from './src/containers/AppointmentDetailScreen/AppointmentDetailScreen';
import DoctorDashboard from './src/containers/DoctorDashboard/DoctorDashboard';
import ViewAppointments from './src/containers/ViewAppointments/ViewAppointments';
import { firebaseMessaging } from './src/services';
import OnlineAppointments from './src/containers/OnlineAppointments/OnlineAppointments';
import WalkInAppointmentInfoForm from './src/containers/WalkInAppointmentInfoForm/WalkInAppointmentInfoForm';
import WalkInAppointmentStatus from './src/components/WalkInAppointmentStatus/WalkInAppointmentStatus';
import ContactClinicScreen from './src/containers/ContactClinicScreen/ContactClinicScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';

firebaseMessaging.registerToken();

const AuthNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
});

const MainNavigator = createStackNavigator({
  Dashboard: {screen: DashboardScreen },
  BookAppointment: {screen: BookAppointment },
  AppointmentDetailScreen: {screen: AppointmentDetailScreen},
  ViewAppointments: {screen: ViewAppointments},
  DoctorDashboard: {screen: DoctorDashboard},
  OnlineAppointments: {screen: OnlineAppointments},
  WalkInAppointmentInfoForm: {screen: WalkInAppointmentInfoForm},
  WalkInAppointmentStatus: {screen: WalkInAppointmentStatus},
  ContactClinic: {screen: ContactClinicScreen},
  QRCodeScanner: {screen: QRCodeScanner},
});

const App = createAppContainer(createSwitchNavigator({
  Auth: AuthNavigator,
  Main: MainNavigator
}));

export default App;

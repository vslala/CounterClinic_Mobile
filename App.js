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
  OnlineAppointments: {screen: OnlineAppointments}
});

const App = createAppContainer(createSwitchNavigator({
  Auth: AuthNavigator,
  Main: MainNavigator
}));

export default App;

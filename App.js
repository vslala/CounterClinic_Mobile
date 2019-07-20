import React, {Fragment} from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './src/containers/Login/LoginScreen';
import RegisterScreen from './src/containers/Register/RegisterScreen';
import DashboardScreen from './src/containers/PatientDashboard/DashboardScreen';
import BookAppointment from './src/containers/BookAppointment/BookAppointment';
import AppointmentDetailScreen from './src/containers/AppointmentDetailScreen/AppointmentDetailScreen';
import ViewAppointments from './src/containers/ViewAppointments/ViewAppointments';

const AuthNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
});

const MainNavigator = createStackNavigator({
  Dashboard: {screen: DashboardScreen },
  BookAppointment: {screen: BookAppointment },
  AppointmentDetailScreen: {screen: AppointmentDetailScreen},
  ViewAppointments: {screen: ViewAppointments}
});

const App = createAppContainer(createSwitchNavigator({
  Auth: AuthNavigator,
  Main: MainNavigator
}));

export default App;

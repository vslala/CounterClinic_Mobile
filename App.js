import React, {Fragment} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './src/containers/Login/LoginScreen';
import RegisterScreen from './src/containers/Register/RegisterScreen';
import DashboardScreen from './src/containers/PatientDashboard/DashboardScreen';
import BookAppointment from './src/containers/BookAppointment/BookAppointment';

const MainNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Dashboard: {screen: DashboardScreen },
  BookAppointment: {screen: BookAppointment }
});

const App = createAppContainer(MainNavigator);

export default App;

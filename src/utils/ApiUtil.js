import AsyncStorage from "@react-native-community/async-storage";


COUNTER_CLINIC_ONLINE_URL = 'http://206.189.30.73:8081';
// COUNTER_CLINIC_WALKIN_URL = 'http://206.189.30.73:9090';
COUNTER_CLINIC_WALKIN_URL = 'http://192.168.0.101:8080';

export const Api = {
    online: {
        bookAppointment: COUNTER_CLINIC_ONLINE_URL + '/api/v1/appointments/book',
        loginUrl: COUNTER_CLINIC_ONLINE_URL + '/api/v1/users/login',
        registrationUrl: COUNTER_CLINIC_ONLINE_URL + '/api/v1/users/register',
        availableDoctorSlots: COUNTER_CLINIC_ONLINE_URL + '/api/v1/appointments/doctors/availableSlots',
        fetchAppointments: COUNTER_CLINIC_ONLINE_URL + '/api/v1/appointments',
    },
    walkin: {
        getAllDoctors: COUNTER_CLINIC_WALKIN_URL + '/user/all/doctor',
        getAllPatients: COUNTER_CLINIC_WALKIN_URL + '/user/all/patient',
        getAllReceptionists: COUNTER_CLINIC_WALKIN_URL + '/user/all/receptionist',
        getAllAdmins: COUNTER_CLINIC_WALKIN_URL + '/user/all/admin',
        getAllSuperAdmins: COUNTER_CLINIC_WALKIN_URL + '/user/all/super_admin',
        fetchAppointmentById: COUNTER_CLINIC_WALKIN_URL + '/walk-in-appointment/wrapped/id',
    }
}

export const constants = {
    accessToken: "accessToken",
    loggedInUser: "loggedInUser",
    userRole: {
        doctor: "DOCTOR",
        patient: "PATIENT",
        receptionist: "RECEPTIONIST",
        admin: "ADMIN",
        superAdmin: "SUPER_ADMIN",
    }
}

export const fetcher = {
    allDoctors: new Promise( async (resolve, reject) => {
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
            resolve(doctorList);
        })
        .catch( error => {
            console.log(error);
            reject(error);
        });
    }),

    walkInAppointment: (appointmentId) => new Promise((resolve, reject) => {
        fetch(`${Api.walkin.fetchAppointmentById}/${appointmentId}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(appointmentInfo => {
            resolve(appointmentInfo);
        })
        .catch(error => {
            reject(error);
        });
    })
}

export const handleErrors = (response) => {
    if (! response.ok) {
        throw new Error("Encountered Error: " + response.type + ", Status: " + response.status);
    }
    console.log(response);
    return response;
}

export const handleLogout = async (navigate) => {
    await AsyncStorage.removeItem(constants.accessToken);
    navigate('Login');
}



COUNTER_CLINIC_ONLINE_URL = 'http://206.189.30.73:8084';
COUNTER_CLINIC_WALKIN_URL = 'http://10.131.126.36:8080';

export const Api = {
    online: {
        bookAppointment: COUNTER_CLINIC_ONLINE_URL + '/api/v1/appointment/book',
        loginUrl: COUNTER_CLINIC_ONLINE_URL + '/api/v1/user/login',
        registrationUrl: COUNTER_CLINIC_ONLINE_URL + '/api/v1/user/register',
        availableDoctorSlots: COUNTER_CLINIC_ONLINE_URL + '/api/v1/appointment/doctor/availableSlots',
    },
    walkin: {
        getAllDoctors: COUNTER_CLINIC_WALKIN_URL + '/user/all/doctor',
        getAllPatients: COUNTER_CLINIC_WALKIN_URL + '/user/all/patient',
        getAllReceptionists: COUNTER_CLINIC_WALKIN_URL + '/user/all/receptionist',
        getAllAdmins: COUNTER_CLINIC_WALKIN_URL + '/user/all/admin',
        getAllSuperAdmins: COUNTER_CLINIC_WALKIN_URL + '/user/all/super_admin',
    }
}

export const handleErrors = (response) => {
    if (! response.ok) {
        throw new Error("Encountered Error: " + response.type + ", Status: " + response.status);
    }
    console.log(response);
    return response;
}


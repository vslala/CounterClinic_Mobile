import moment from 'moment';

export const LOCAL_DATE_FORMAT = "YYYY-MM-DD";
export const LOCAL_TIME_FORMAT = "hh:mm:ss";
export const LOCAL_12_HOUR_FORMAT = "h:mm A";
export const LOCAL_DATE_TIME_FORMAT = LOCAL_DATE_FORMAT + ' ' + LOCAL_TIME_FORMAT;

export const formatLocalTimeTo12HourFormat = (localTime) => {
    return moment(localTime, LOCAL_TIME_FORMAT).format(LOCAL_12_HOUR_FORMAT);
}

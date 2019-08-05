import React from 'react';
import PropTypes from 'prop-types';
import { ToastAndroid } from 'react-native';

function Toast(props) {
    if (props.visible) {
        ToastAndroid.show(
            props.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        );
        return null;
    }
    return null;
}

Toast.propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
}

export default Toast;
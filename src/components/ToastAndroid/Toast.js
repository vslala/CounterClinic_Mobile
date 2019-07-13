import React from 'react';
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

export default Toast;
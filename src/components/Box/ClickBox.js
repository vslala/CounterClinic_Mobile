import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

function ClickBox(props) {

    return (
        <TouchableOpacity accessible={props.accessible} accessibilityLabel={props.accessibilityLabel} onPressOut={props.onClick}>
            <View 
                style={{padding: 50, borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "stretch", minHeight: 100}}
            >
                <Text>{ props.boxText }</Text>
            </View>
        </TouchableOpacity>
    );
}

ClickBox.propTypes = {
    accessible: PropTypes.bool.isRequired,
    accessibilityLabel: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    boxText: PropTypes.string.isRequired
}

export default ClickBox;
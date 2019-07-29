import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { style } from '../../styles/Stylesheet';

function ClickBox(props) {

    return (
        <TouchableOpacity accessible={props.accessible} accessibilityLabel={props.accessibilityLabel} onPressOut={props.onClick}>
            <View 
                style={{margin: 10, padding: 50, borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "stretch", minHeight: props.boxHeight > 0 ? props.boxHeight : 100}}
            >
            {
                props.boxText.map( (text, index) => (
                    <Text key={index} style={{alignSelf: "stretch"}}>{ text }</Text>
                ))
            }
            
            </View>
        </TouchableOpacity>
    );
}

ClickBox.propTypes = {
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    boxText: PropTypes.arrayOf(PropTypes.any).isRequired,
    boxHeight: PropTypes.number
}

export default ClickBox;
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { style } from '../../styles/Stylesheet';
import { Text, withTheme, Subheading, Headline } from 'react-native-paper';


function ClickBox(props) {

    return (
        <TouchableOpacity accessible={props.accessible} accessibilityLabel={props.accessibilityLabel} onPressOut={props.onClick}>
            <View style={[{...style.clickBox}, props.style]}>
            {
                props.boxText.map( (text, index) => (
                    <Headline key={index}>{text}</Headline>
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
    boxHeight: PropTypes.number,
    boxWidth: PropTypes.number,
    style: PropTypes.any
}

export default withTheme(ClickBox);
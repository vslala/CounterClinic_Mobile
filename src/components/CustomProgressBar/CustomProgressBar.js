import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import PropTypes from 'prop-types';

function CustomProgressBar(props) {

    var interval = useRef(null);

    const [progress, setProgress] = useState(0);

    if (props.open) {
        interval = setInterval(
            () => {
                console.log("Progress: ", progress);
                setProgress(progress > 1 ? 0 : (progress + 0.25));
            }, 250
        )
    }

    if (!props.open) {
        clearInterval(interval);
        return <View></View>
    }

    return (
        <ProgressBar 
            animating={true}
            progress={progress}
        />
    );
}

CustomProgressBar.propTypes = {
    open: PropTypes.bool.isRequired,
}

export default CustomProgressBar;
import * as React from 'react';
import { Appbar, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { handleLogout } from '../../utils/ApiUtil';

function CustomHeader(props) {

    const { state, navigate, goBack } = props.navigation;

    console.log("Navigation option: ", props.navigation);

    const backButton = () => {
        if (props.backButton) {
            console.log("Back button should be present!");
            return (
                <Appbar.BackAction onPress={() => goBack(null)}></Appbar.BackAction>
            );
        }
    }

    return (
        <Appbar dark={true}>
            { backButton() }
        <Appbar.Content
            title={props.title}
        />
        <Appbar.Action icon="exit-to-app" onPress={() => handleLogout(navigate)} />
        </Appbar>
    );

}

CustomHeader.propTypes = {
    title: PropTypes.string.isRequired,
    backButton: PropTypes.bool,
}

export default withTheme(CustomHeader);
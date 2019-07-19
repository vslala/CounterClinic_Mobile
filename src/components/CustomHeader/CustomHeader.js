import * as React from 'react';
import { Appbar } from 'react-native-paper';
import PropTypes from 'prop-types';
import { handleLogout } from '../../utils/ApiUtil';

function CustomHeader(props) {

    const { goBack } = props.navigation;
    const { navigate } = props.navigation;

    console.log("Navigation option: ", props.navigation);

    return (
        <Appbar dark={true}>
        <Appbar.Content
            title={props.title}
        />
        <Appbar.Action icon="exit-to-app" onPress={() => handleLogout(navigate)} />
        </Appbar>
    );

}

CustomHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default CustomHeader;
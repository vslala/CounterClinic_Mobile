import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Title, Subheading, Card, Divider } from 'react-native-paper';
import { Avatar } from 'react-native-paper';


function ContactCard(props) {

    const contact = {
        email: props.email,
        mobile: props.mobile
    }

    return (
        <Card>
            <Card.Title title="Contact Card" left={() => <Avatar.Icon size={50} color="white" {...props} icon="contact-mail" />} />
            <Divider />
            <Card.Content>
                
                    <Title>Email Address</Title>
                    <Subheading onPress={() => Linking.openURL(`mailto:${contact.email}`)}>{contact.email}</Subheading>

                    <Title>Mobile</Title>
                    <Subheading onPress={() => Linking.openURL(`tel:${contact.mobile}`)}>{contact.mobile}</Subheading>
                
            </Card.Content>
        </Card>
    );
}

ContactCard.propTypes = {
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired
}

export default ContactCard;
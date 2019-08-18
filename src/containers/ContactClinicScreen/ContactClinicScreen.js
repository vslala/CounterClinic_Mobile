import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Api, fetcher } from  '../../utils/ApiUtil';
import { withTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import ContactCard from '../../components/ContactCard/ContactCard';

const images = {
    paperTexture: `${Api.walkin.context}/images/paper_texture.jpg`
}

function ContactClinicScreen(props) {

    console.log("Paper Image: ", images.paperTexture);
    const [contact, setContact] = useState({
        email: 'Loading...',
        mobile: 'Loading...'
    });

    const fetchContactInfo = () => {
        fetcher.contactInfo("contactEmail")
        .then(contactEmail => {
            fetcher.contactInfo("contactMobile")
            .then(contactMobile => {
                setContact({
                    email: contactEmail.settingValue,
                    mobile: contactMobile.settingValue
                })
            })
        })
        .catch(error => {
            console.log("Encountered Error!", error);
        })
    }

    useEffect(() => {
        fetchContactInfo();
    }, [])

    return (
        
        // <ImageBackground source={{uri: images.paperTexture}} style={{width: 'auto', height: '100%', padding: 20}}>
            <View style={{padding: 50}}>
                <ContactCard email={contact.email} mobile={contact.mobile} />
            </View>    
        // </ImageBackground>
    );
}

ContactClinicScreen.navigationOptions = ({navigate}) => ({
    title: "Contact",
    header: props => (
        <CustomHeader backButton={true} title="Contact" {...props} />
    ),
});

export default withTheme(ContactClinicScreen);
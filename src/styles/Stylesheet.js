import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    container: {
        padding: 30,
        flex:1, 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column"
    },
    formControl: {
        margin: 20, 
        alignSelf: 'stretch'
    },
    formLabel: {
        alignSelf: "flex-start"
    },
    formInput: {
        padding: 5, 
        borderBottomWidth: 1, 
        alignSelf: 'stretch', 
        borderBottomColor: 'gray' 
    },
    link: {
        margin: 5,
        color: '#2196f3',
    },
    modal: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'lightgrey'
    },
    clickBox: {
        margin: 10, 
        padding: 50, 
        borderColor: "gray", 
        borderWidth: 1, 
        borderRadius: 10, 
        justifyContent: "center", 
        alignItems: "center", 
        alignSelf: "stretch", 
        minWidth: 300,
        maxWidth: 360,
    },
    body2: {
        fontSize: 24,
        fontFamily: 'Roboto',
        alignItems: "center",
    }
});
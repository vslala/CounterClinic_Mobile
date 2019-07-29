import React, {useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Divider } from 'react-native-paper';
import { style } from '../../styles/Stylesheet';

function ShowList(props) {

    const [list, setList] = useState([]);

    return (
        <ScrollView style={{alignSelf: "stretch"}}>
            <List.Section>
                {
                    props.data.map( (item,index) => {
                        let title = props.buildTitle(item);
                        return (
                            <View key={index} style={{flex: 1, flexDirection: "column"}}>
                                <List.Item 
                                    title={title}
                                    description={() => props.buildDescription(item)}
                                    left={() => props.leadingIcon ? <List.Icon icon={props.leadingIcon} style={{scaleX: props.scale ? props.scale.x : 1, scaleY: props.scale ? props.scale.y : 1}} color={props.iconColor ? props.iconColor : 'black'} /> : null}
                                    right={() => props.onItemClick ? <View onTouchEnd={() => props.onItemClick(item)}><List.Icon style={{scaleX: props.scale ? props.scale.x : 1, scaleY: props.scale ? props.scale.y : 1}} icon={props.tailIcon} color={props.iconColor} /></View> : null}
                                />
                                <Divider />
                            </View>
                        );
                    } )
                }
            </List.Section>
        </ScrollView>
    );
}

ShowList.propTypes = {
    data: PropTypes.array.isRequired,
    buildTitle: PropTypes.func.isRequired,
    buildDescription: PropTypes.func.isRequired,
    leadingIcon: PropTypes.string,
    tailIcon: PropTypes.string,
    onItemClick: PropTypes.func,
    iconColor: PropTypes.string,
    scale: PropTypes.object,
}

export default ShowList
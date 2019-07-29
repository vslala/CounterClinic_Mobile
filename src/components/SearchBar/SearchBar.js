import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button, TextInput, Searchbar } from 'react-native-paper';
import { style } from '../../styles/Stylesheet';

function SearchBar(props) {

    const [searchBar, setSearchBar] = useState({
        searchText: null,
    });

    const handleOnChange = (name) => (value) => {
        setSearchBar({...searchBar, [name]: value});
        props.handleSearch(value);
    }

    return (

            <Searchbar
                placeholder="Search by doctor name"
                onChangeText={handleOnChange("searchText")}
                value={searchBar.searchText}
                onSubmitEditing={(e) => { e.preventDefault(); }}
            />

    );
}

SearchBar.propTypes = {
    searchBarPlaceholderText: PropTypes.string.isRequired,
    handleSearch: PropTypes.func.isRequired

}

export default SearchBar;
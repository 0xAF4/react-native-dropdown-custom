import React, { Component, useCallback, useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View, Platform, Text, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import NoData from './NoData';
import defaultTheme from '../theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Dropdown(props) {
    let selectedValue = props.value;
    let data = props.data;
    let onChange = props.onChange;
    let newTheme = props.theme;

    const [isShowPicker, setShowPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [theme, setTheme] = useState({});

    useEffect(() => {
        //load theme on load
        const _newT = _.merge(defaultTheme, newTheme);
        //console.log('_newT', _newT);
        setTheme(_newT);
    }, [newTheme]);

    useEffect(() => {
        chooseByValue(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const chooseByValue = useCallback((newValue) => {
        if (data && data.length > 0) {
            data.forEach((item, key) => {
                let itemVal = getValue(item);
                if (itemVal == newValue) {
                    console.log("OK Selected");
                    onChange(itemVal);
                    setSelectedItem(item);
                }
            });
        }
    }, [data, onChange]);

    const getValue = useCallback((item) => {
        return item.id;
    }, []);

    const getLabel = useCallback((item) => {
        return item.label;
    }, []);

    const openPicker = useCallback(() => {
        setShowPicker(true);
    }, []);

    return (
        <View style={[styles.container, theme.containerStyle]}>
            {props.label != null && (
                <Text style={[styles.label, theme.labelStyle]}>{props.label}</Text>
            )}

            {/* {(props.error != "" && props.error != null) && (
                <Text style={styles.errorText}>{props.error}</Text>
            )} */}
            <TouchableOpacity onPress={openPicker}
                activeOpacity={0.7}
                style={[styles.pickerWrapper, theme.boxStyle]}>
                <Text style={[styles.textContent, theme.textContentStyle]}>{selectedItem ? selectedItem.label : '(Please Select)'}</Text>
                <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    style={[styles.rightIcon, theme.rightIconStyle]}
                />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isShowPicker}
                onRequestClose={() => setShowPicker(false)}>
                <TouchableOpacity
                    onPress={() => setShowPicker(false)}
                    activeOpacity={1}
                    style={[styles.modalRoot, theme.modalRootStyle]}>
                    <View style={[styles.modalContent, theme.modalContentStyle]}>
                        <View style={[styles.searchBarStyle, theme.searchWrapperStyle]}>
                            <MaterialIcons
                                name='search'
                                size={24}
                                style={[styles.searchIcon, theme.searchIconStyle]}
                            />
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <TextInput
                                    onChangeText={(term) => {
                                        setSearch(term);
                                    }}
                                    value={search}
                                    style={[styles.searchInput, theme.searchInputStyle]}
                                    placeholder={"Search "}
                                    placeholderTextColor={props.placeholderTextColor}
                                />
                            </View>
                        </View>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            // style={{ flex:1, alignSelf:'center' }}
                            keyboardShouldPersistTaps='handled'>
                            {filteredData.length == 0 && (
                                <NoData>No Data Available</NoData>
                            )}
                            {filteredData.map((item, index) => {
                                let styleModalItem = styles.modalItem;
                                if (filteredData.length - 1 == index) {
                                    styleModalItem = styles.modalItemNoBorder;
                                }
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styleModalItem, theme.listStyle]}
                                        onPress={() => {
                                            setShowPicker(false);
                                            onChange(getValue(item));
                                            setSelectedItem(item);
                                        }}>
                                        <Text style={[styles.modalText, theme.listTextStyle]}>{getLabel(item)}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = {
    container: {
        //backgroundColor: 'blue',
    },
    pickerWrapper: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 8,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    label: {
        color: '#000',
        marginBottom: 5,
        fontSize: 14,
    },
    searchInput: {
        marginLeft: 10,
    },
    searchBarStyle: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#eee',
        borderRadius: 5
    },
    textContent: {
        fontSize: 16,
        flex: 1,
    },
    rightIcon: {
        color: '#000',
    },
    searchIcon: {
        color: '#000',
    },

    modalRoot: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: SCREEN_WIDTH - 32,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 10,
        maxHeight: SCREEN_HEIGHT - 100
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
    },
    modalItemNoBorder: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    modalText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    }
};
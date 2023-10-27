import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable, Keyboard, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown'
import { Input, ButtonGroup, Button } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Database from "../Database";

export const EditHikeScreen = ({ route, navigation }) => {
    const { hike } = route.params;
    const [name, setName] = useState(hike.name);
    const [description, setDescription] = useState(hike.description);
    const [location, setLocation] = useState(hike.location);
    const [date, setDate] = useState(new Date(hike.date.split("/").reverse().join("-")));
    const [level, setLevel] = useState(hike.level);
    const [length, setLength] = useState(hike.length);
    const [hasParking, setHasParking] = useState(hike.parking);
    const [show, setShow] = useState(false);
    const countries = ["Easy", "Medium", "Hard"]

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const handleEditHike = async () => {
        if (!name || !description || !location || !date || !level || !length) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }
        await Database.updateHike(hike.id, name, description, location, date.toLocaleDateString(), level, length, hasParking);
        navigation.navigate("Home");
    };

    return (
        <ScrollView onTouchStart={() => {
            Keyboard.dismiss()
        }} style={styles.container} automaticallyAdjustKeyboardInsets={true}>
            <Text style={styles.formTitle}>Edit Hike</Text>
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                inputContainerStyle={{}}
                // errorMessage="Oops! that's not correct."
                value={name}
                onChangeText={setName}
                label="Hike Name"
                leftIcon={<Icon name="account-outline" size={20} />}
                placeholder="Enter Name"
            />
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                inputContainerStyle={{}}
                // errorMessage="Oops! that's not correct."
                value={location}
                onChangeText={setLocation}
                label="Hike Location"
                leftIcon={<Icon name="account-outline" size={20} />}
                placeholder="Enter Location"
            />
            <Pressable onPress={() => setShow(true)}>
                <View pointerEvents="none">
                    <Input
                        disabledInputStyle={{ background: "#ddd" }}
                        value={date.toLocaleDateString()}
                        label="Hike Date"
                        leftIcon={<Icon name="account-outline" size={20} />}
                        placeholder="Enter Date"
                    />
                </View>
            </Pressable>
            {show && (<DateTimePicker
                value={date}
                style={{ position: "absolute", top: 175, left: 15, zIndex: 999, backgroundColor: "#d3d3d3", borderRadius: 10, overflow: "hidden" }}
                mode="date"
                display="inline"
                is24Hour={true}
                onChange={onChange}
            />)}
            <View style={{ display: "flex", flexDirection: 'row', marginRight: 10 }}>
                <View style={{ flex: 3 }} >
                    <Text style={styles.labelMargin} >Parking Status</Text>
                    <ButtonGroup
                        buttons={['Not Available', 'Available']}
                        selectedIndex={hasParking}
                        onPress={(value) => {
                            setHasParking(value);
                        }}
                        containerStyle={{ marginBottom: 20 }}
                    />
                </View>
                <View style={{ flex: 2 }} >
                    <Text style={styles.label}>Hike Level</Text>
                    <SelectDropdown
                        buttonStyle={{ height: 40, width: "100%", borderWidth: 1, borderColor: "#d3d3d3", borderRadius: 5, marginTop: 5, backgroundColor: "white" }}
                        buttonTextStyle={{ fontSize: 15, fontWeight: "bold" }}
                        data={countries}
                        defaultValue={"Easy"}
                        onSelect={(selectedItem, index) => {
                            setLevel(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                    />
                </View>
            </View>
            <Input
                onTouchStart={(e) => {
                    e.stopPropagation()
                }}
                disabledInputStyle={{ background: "#ddd" }}
                onChangeText={setLength}
                value={length}
                keyboardType="numeric"
                label="Hike Length"
                leftIcon={<Icon name="account-outline" size={20} />}
                placeholder="Enter Length"
            />
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                onChangeText={setDescription}
                value={description}
                label="Hike Description"
                leftIcon={<Icon name="account-outline" size={20} />}
                placeholder="Enter Description"
            />
            <Button
                title="Update"
                loading={false}
                loadingProps={{ size: 'small', color: 'white' }}
                buttonStyle={{
                    backgroundColor: 'rgba(111, 202, 186, 1)',
                    borderRadius: 5,
                }}
                titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
                containerStyle={{
                    height: 50,
                    width: "calc(100% - 10px)",
                    marginVertical: 10,
                    marginHorizontal: 10
                }}
                onPress={handleEditHike}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    formTitle: {
        fontSize: 25,
        fontWeight: "bold",
        marginHorizontal: 127,
        marginVertical: 15
    },
    label: {
        fontSize: 16,
        color: "#89939E",
        fontWeight: "bold",
        paddingBottom: 5
    },
    labelMargin: {
        fontSize: 16,
        color: "#89939E",
        fontWeight: "bold",
        marginLeft: 10,
        paddingBottom: 5
    },
    addButton: {
        backgroundColor: "green",
        padding: 16,
        borderRadius: 4,
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});


import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable, Keyboard, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown'
import { Input, ButtonGroup, Button, Image } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
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
    const [error, setError] = useState(null);
    const [image, setImage] = useState(hike.image_uri);
    const countries = ["Easy", "Medium", "Hard"]

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const handleEditHike = async () => {
        if (!name || !location || !date || !level || !length) {
            setError("You have to fill this required field!");
            return;
        }
        await Database.updateHike(hike.id, name, description, location, date.toLocaleDateString(), level, length, hasParking, image);
        navigation.navigate("Home");
    };

    return (
        <ScrollView onTouchStart={() => {
            Keyboard.dismiss()
        }} style={styles.container} automaticallyAdjustKeyboardInsets={true}>
            <Text style={styles.formTitle}>Edit Hike</Text>
            <Text style={styles.labelMargin}>Hike image</Text>
            <View style={{ marginLeft: 10}}>
                <Image onPress={pickImage} source={image ? {uri: image} : require('./../assets/photo.png')} style={{ width: 340 , height: 200, objectFit: "fill", marginBottom: 15, marginTop: 10, borderRadius: 10 }} />
            </View>
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                errorMessage={(error && !name) && error}
                value={name}
                onChangeText={setName}
                label={<Text style={styles.customLabel}>Hike name <Icon name="star" size={12} color={"red"} /></Text>}
                leftIcon={<Icon name="align-horizontal-left" size={20} />}
                placeholder="Enter Name"
            />
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                errorMessage={(error && !location) && error}
                value={location}
                onChangeText={setLocation}
                label={<Text style={styles.customLabel}>Hike location <Icon name="star" size={12} color={"red"} /></Text>}
                leftIcon={<Icon name="directions" size={20} />}
                placeholder="Enter Location"
            />
            <Pressable onPress={() => setShow(true)}>
                <View pointerEvents="none">
                    <Input
                        errorMessage={(error && !date) && error}
                        disabledInputStyle={{ background: "#ddd" }}
                        value={date.toLocaleDateString()}
                        label={<Text style={styles.customLabel}>Hike date <Icon name="star" size={12} color={"red"} /></Text>}
                        leftIcon={<Icon name="calendar-today" size={20} />}
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
                    <Text style={styles.labelMargin}>Parking status <Icon name="star" size={12} color={"red"} /></Text>
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
                    <Text style={styles.label}>Hike level <Icon name="star" size={12} color={"red"} /></Text>
                    <SelectDropdown
                        buttonStyle={{ height: 40, width: "100%", borderWidth: 1, borderColor: "#d3d3d3", borderRadius: 5, marginTop: 5, backgroundColor: "white" }}
                        buttonTextStyle={{ fontSize: 15, fontWeight: "bold" }}
                        data={countries}
                        defaultValue={hike.level}
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
                errorMessage={(error && !length) && error}
                disabledInputStyle={{ background: "#ddd" }}
                onChangeText={setLength}
                value={length}
                keyboardType="numeric"
                label={<Text style={styles.customLabel}>Hike length <Icon name="star" size={12} color={"red"} /></Text>}
                leftIcon={<Icon name="gesture" size={20} />}
                placeholder="Enter Length"
            />
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                onChangeText={setDescription}
                value={description}
                label="Hike Description"
                leftIcon={<Icon name="format-align-justify" size={20} />}
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
    customLabel: {
        fontSize: 16,
        color: "#89939E",
        fontWeight: "bold",
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


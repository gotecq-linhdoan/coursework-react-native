import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { SpeedDial, ListItem, Icon, Button } from '@rneui/base';
import Database from "../Database";

export const HikeScreen = ({ navigation }) => {
    const [hikes, setHikes] = useState([]);
    const isFocused = useIsFocused();
    const [open, setOpen] = React.useState(false);

    const fetchData = async () => {
        try {
            const data = await Database.getHikes();
            setHikes(data);
        } catch (error) {
            console.log("Error fetching hikes", error);
        }
    };

    useEffect(() => {
        fetchData();
        setOpen(false);
    }, [isFocused]);


    const deleteAllHike = async () => {
        try {   
            await Database.deleteAllHikes();
            fetchData();
        } catch (error) {
            console.log("Error delete hike", error);
        }
    }

    const deleteHike = async (id) => {
        try {
            await Database.deleteHike(id);
            fetchData();
        } catch (error) {
            console.log("Error delete hike", error);
        }
    }

    const renderHikeItem = ({ item }) => (
        <ListItem.Swipeable
            style={styles.hikeItem}
            rightStyle={{ height: 66 }}
            onPress={() => navigation.navigate("Detail", { hike: item })}
            leftWidth={0}
            rightWidth={65}
            minSlideWidth={40}
            rightContent={(action) => (
                <Button
                    containerStyle={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "#d0342c",
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10
                    }}
                    type="clear"
                    icon={{ name: "delete-outline", color: "#fff" }}
                    onPress={() => deleteHike(item.id)}
                />
            )}
        >
            <Icon name="brightness-high" type="material" />
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.location} - {item.length}m</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.formTitle}>Hike List</Text>
            <FlatList
                data={hikes}
                renderItem={renderHikeItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <SpeedDial
                isOpen={open}
                icon={{ name: 'edit', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
            >
                <SpeedDial.Action
                    titleStyle={styles.titleStyle}
                    icon={{ name: 'add', color: '#fff' }}
                    title="Add new Hike"
                    onPress={() => navigation.navigate("Entry")}
                />
                <SpeedDial.Action
                    titleStyle={styles.titleStyle}
                    icon={{ name: 'delete', color: '#fff' }}
                    title="Delete all Hike"
                    onPress={deleteAllHike}
                />
            </SpeedDial>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    hikeItem: {
        borderLeftWidth: 4,
        borderLeftColor: "red",
        overflow: "hidden",
        marginBottom: 10
    },
    titleStyle: {
        overflow: "hidden",
        fontWeight: 600,
        color: "white",
        backgroundColor: "#9F2757"
    },
    formTitle: {
        fontSize: 25,
        fontWeight: "bold",
        marginHorizontal: 124,
        marginBottom: 20
    },
});


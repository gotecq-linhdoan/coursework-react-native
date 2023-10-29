import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Card, SpeedDial } from "@rneui/base";
import Database from "../Database";

export const HikeDetailScreen = ({ route, navigation }) => {
    const { hike } = route.params;
    const [open, setOpen] = React.useState(false);

    const deleteHike = async () => {
        try {
            await Database.deleteHike(hike.id);
            navigation.navigate("Home");
        } catch (error) {
            console.log('Delete hike erros', error);
        }
    }

    return (
        <>
            <Card containerStyle={{ borderRadius: 10 }}>
                <Card.Title style={{ fontSize: 18 }}>{hike.name}</Card.Title>
                <Card.Divider />
                {hike.image_uri && <View style={{ alignItems: "center", overflow: 'hidden' }}>
                    <Image
                        style={{ width: "100%", height: 250, borderRadius: 10, overflow: "hidden" }}
                        resizeMode="cover"
                        source={{ uri: hike.image_uri }}
                    />
                </View>}

                <View
                    style={{
                        position: "relative",
                    }}
                >
                    <Text style={styles.hikeText}>Location: {hike.location}</Text>
                    <Text style={styles.hikeText}>Date of the Hike: {hike.date}</Text>
                    <Text style={styles.hikeText}>Parking status: {hike.parking === 1 ? "Available" : "Not Available"}</Text>
                    <Text style={styles.hikeText}>Hike statistic: {hike.length}m - {hike.level} Level</Text>
                    <Text style={styles.hikeText}>Description: {hike.description}</Text>
                </View>
            </Card>
            <SpeedDial
                isOpen={open}
                icon={{ name: 'clear-all', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
            >
                <SpeedDial.Action
                    titleStyle={styles.titleStyle}
                    icon={{ name: 'edit', color: '#fff' }}
                    title="Edit Hike"
                    onPress={() => navigation.navigate("Edit", { hike: hike })}
                />
                <SpeedDial.Action
                    titleStyle={styles.titleStyle}
                    icon={{ name: 'delete', color: '#fff' }}
                    title="Delete Hike"
                    onPress={deleteHike}
                />
            </SpeedDial>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: "hidden",
        margin: 15,
        borderWidth: 2,
        borderColor: "#d3d3d3"
    },
    hikeText: {
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15
    },
    titleStyle: {
        overflow: "hidden",
        fontWeight: 600,
        color: "white",
        backgroundColor: "#9F2757"
    },
});

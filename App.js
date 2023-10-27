import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HikeDetailScreen } from "./screens/HikeDetailScreen";
import { HikeEntryScreen } from "./screens/HikeEntryScreen";
import { HikeScreen } from "./screens/HikeScreen";
import { EditHikeScreen } from "./screens/EditHikeScreen";
import Database from "./Database";
const Stack = createStackNavigator();

const App = () => {
    useEffect(() => {
        Database.initDatabase();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HikeScreen} />
                <Stack.Screen name="Entry" component={HikeEntryScreen} />
                <Stack.Screen name="Detail" component={HikeDetailScreen} />
                <Stack.Screen name="Edit" component={EditHikeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
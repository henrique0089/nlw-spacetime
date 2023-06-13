import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

export function Button() {
    return (
        <TouchableOpacity 
            onPress={() => Alert.alert('escreva o seu nome!')}
            className="h-10 w-30 bg-purple-700"
        >
            <Text className="text-white font-bold">Button</Text>
        </TouchableOpacity>
    )
}
import React from "react"
import {  Text, Pressable, PressableProps, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

type Props = PressableProps & {
    data: {
        data: string
        descricao: string
    }
    onDelete: () => void
}


export function Compra({ data, onDelete, ...rest}: Props) {
    return (
        <Pressable style={ 
            {backgroundColor: "#CECECE", padding: 24, borderRadius: 5, gap: 12, flexDirection: "row"} } 
            {...rest}>
            <Text>
                {data.data} {data.descricao}
            </Text>

        <TouchableOpacity onPress ={onDelete}>
            <MaterialIcons name = "delete" size={24} color="red" />
        </TouchableOpacity>

        </Pressable>
    )
}
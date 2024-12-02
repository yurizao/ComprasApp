import React from "react"
import {  Text, Pressable, PressableProps, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

type Props = PressableProps & {
    data: {
        id: string | number
        data: string
        descricao: string
    }
    onDelete: () => void
    onOpen: () => void
}

export function Compra({ data, onDelete, onOpen, ...rest}: Props) {

    return (
        <Pressable style={ 
            {backgroundColor: "#CECECE", padding: 24, borderRadius: 5, gap: 12, flexDirection: "row"} } 
            {...rest}>
            <Text>
                {data.descricao}
            </Text>

        <TouchableOpacity onPress ={onDelete}>
            <MaterialIcons name = "delete" size={24} color="red" />
        </TouchableOpacity>

            
        <TouchableOpacity onPress ={onOpen}>
            <MaterialIcons name = "visibility" size={24} color="blue" />
        </TouchableOpacity>

 

        </Pressable>
    )
}
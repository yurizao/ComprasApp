import React from "react"
import {  Text, Pressable, PressableProps, } from "react-native"

type Props = PressableProps & {
    data: {
        nome: string
        quantidade: number
        valor: number
    }
}


export function Product({ data, ...rest}: Props) {
    return (
        <Pressable style={ 
            {backgroundColor: "#CECECE", padding: 24, borderRadius: 5, gap: 12, flexDirection: "row"} } 
            {...rest}>
            <Text>
                {data.nome} {data.quantidade} {data.valor}
            </Text>

        </Pressable>
    )
}
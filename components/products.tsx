import React from "react"
import {  Text, Pressable, PressableProps, } from "react-native"

type Props = PressableProps & {
    data: {
        nome: string
        descricao: string
        valor: number
    }
}


export function Product({ data, ...rest}: Props) {
    return (
        <Pressable style={ 
            {backgroundColor: "#CECECE", padding: 24, borderRadius: 5, gap: 12, flexDirection: "row"} } 
            {...rest}>
            <Text>
                {data.nome} - {data.descricao} {data.valor}
            </Text>

        </Pressable>
    )
}
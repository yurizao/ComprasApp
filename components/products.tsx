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
        <Pressable {...rest}>
            <Text>
                {data.nome} - {data.descricao} {data.valor}
            </Text>

        </Pressable>
    )
}
import { View, Button, Alert } from 'react-native';
import { Input } from "@/components/input";
import React, { useState } from 'react';
import { useProductDatabase } from "@/src/database/useProductDatabase";
import Decimal from 'decimal.js';

const Home = () => {
  const [id, setId] = useState(""); 
  const [nome, setNome] = useState(""); 
  const [descricao, setDescricao] = useState(""); 
  const [valor, setValor] = useState(""); 

  const { create } = useProductDatabase();

  const createProduct = async () => {
    const productData = {
      nome,
      descricao,
      valor: new Decimal(valor.replace(',', '.')).toNumber()
    };

    try {
      await create(productData);
      Alert.alert("Sucesso!", "Produto cadastrado com sucesso."); // Alerta de sucesso
      //Limpar os campos após o cadastro
      setNome('');
      setDescricao('');
      setValor('');
    } catch (error) {
      console.log(error);
      Alert.alert("Erro!", "Não foi possível cadastrar o produto."); // Alerta de erro
    }
  };

  async function list() {
    try {
    } catch (error){
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <Input placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
      <Button title="Cadastrar" onPress={createProduct} />
    </View>
  );
};

export default Home;

import { View, Button, Alert, FlatList } from 'react-native';
import { Input } from "@/components/input";
import React, { useEffect, useState } from 'react';
import { useProductDatabase, ProductDatabase } from "@/src/database/useProductDatabase";
import Decimal from 'decimal.js';
import { Product } from '@/components/products';

const Home = () => {
  const [id, setId] = useState(""); 
  const [nome, setNome] = useState(""); 
  const [search, setSearch] = useState(""); 
  const [quantidade, setQuantidade] = useState(""); 
  const [valor, setValor] = useState(""); 
  const [products, setProducts] = useState<ProductDatabase[]>([]);

  const { create, searchByName } = useProductDatabase();

  const createProduct = async () => {
    const productData = {
      nome,
      quantidade: parseInt(quantidade, 10),
      valor: new Decimal(valor.replace(',', '.')).toNumber(),
      compra_id: 0,
    };

    try {
      await create(productData);
      Alert.alert("Sucesso!", "Produto cadastrado com sucesso.");
      setNome('');
      setQuantidade('');
      setValor('');

      list ()
      
    } catch (error) {
      console.log(error);
      Alert.alert("Erro!", "Não foi possível cadastrar o produto.");
    }
  };

  async function list() {
    try {
      const response = await searchByName(search);
      setProducts(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    list();
  }, [search]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <Input placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
      <Button title="Cadastrar" onPress={createProduct} />

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}  // Convertendo ID para String
        renderItem={({ item }: { item: ProductDatabase }) => (  // Tipagem explícita do item
          <Product data={item} />  // Passando o item para o componente Product
        )}
      />
    </View>
  );
};

export default Home;

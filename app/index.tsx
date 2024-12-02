import { View, Button, Alert, FlatList } from 'react-native';
import { Input } from "@/components/input";
import React, { useEffect, useState } from 'react';
import { useProductDatabase, ProductDatabase } from "@/src/database/useProductDatabase";
import Decimal from 'decimal.js';
import { Product } from '@/components/products';
import { useCompraDatabase, CompraDatabase } from "@/src/database/useCompraDatabase";

const Home = () => {
  const [id, setId] = useState(""); 
  const [nome, setNome] = useState(""); 
  const [search, setSearch] = useState(""); 
  const [quantidade, setQuantidade] = useState(""); 
  const [valor, setValor] = useState(""); 
  const [products, setProducts] = useState<ProductDatabase[]>([]);
  const [compras, setCompras] = useState<CompraDatabase[]>([]);
  const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);

  const { create, searchByName } = useProductDatabase();
  const { searchByName: searchCompras } = useCompraDatabase();

  const createProduct = async (compraId: number) => {
    if (!compraId) {
      Alert.alert("Erro", "Selecione uma compra antes de adicionar o produto.");
      return;
    }
    
    const productData = {
      nome,
      quantidade: parseInt(quantidade, 10),
      valor: new Decimal(valor.replace(',', '.')).toNumber(),
      compra_id: compraId,
    };

    console.log("Produto a ser cadastrado:", productData);
  
    try {
      await create(productData);
      Alert.alert("Sucesso!", "Produto cadastrado com sucesso.");
      setNome('');
      setQuantidade('');
      setValor('');
      list();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro!", "Não foi possível cadastrar o produto.");
    }
  };

  async function list() {
    try {
      const productResponse = await searchByName(search);
      setProducts(productResponse);
      const compraResponse = await searchCompras(search);
      setCompras(compraResponse);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    list();
  }, [search]);
  
  useEffect(() => {
    list();
  }, [compras]);
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <Input placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />

      <Input 
        placeholder="Selecione uma Compra" 
        value={selectedCompraId ? `Compra ID: ${selectedCompraId}` : ""}
        editable={false}
      />
      <FlatList
         data={compras}
         keyExtractor={(item) => String(item.id)}
         renderItem={({ item }) => (
      <Button 
         title={`Selecionar Compra ${item.id}`} 
         onPress={() => {
         setSelectedCompraId(item.id);
         console.log("Compra selecionada:", item.id);
      }} 
    />
  )}
/>
      <Button 
        title="Cadastrar Produto"
        onPress={async () => {
          if (selectedCompraId !== null && selectedCompraId !== undefined) {
            await createProduct(selectedCompraId);
          } else {
            Alert.alert("Erro", "Selecione uma compra primeiro.");
          }
        }}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Product data={item} /> 
        )}
      />
    </View>
  );
};

export default Home;
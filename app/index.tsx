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
  const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);  // Estado para armazenar o ID da compra selecionada

  const { create, searchByName } = useProductDatabase();
  const { searchByName: searchCompras } = useCompraDatabase();  // Função de busca de compras

  const createProduct = async (compraId: number) => {
    if (!compraId) {
      Alert.alert("Erro", "Selecione uma compra antes de adicionar o produto.");
      return;
    }
    
    const productData = {
      nome,
      quantidade: parseInt(quantidade, 10),
      valor: new Decimal(valor.replace(',', '.')).toNumber(),
      compra_id: compraId,  // Aqui você passa o compra_id da compra já registrada
    };

    console.log("Produto a ser cadastrado:", productData);
  
    try {
      // Criação do produto com o compra_id correto
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

  // Função para listar produtos e compras
  async function list() {
    try {
      const productResponse = await searchByName(search);
      setProducts(productResponse);
      const compraResponse = await searchCompras(search);  // Buscando compras
      setCompras(compraResponse);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    list();
  }, [search]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Campos de entrada para cadastro de produto */}
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <Input placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />

      {/* Seleção de compra */}
      <Input 
        placeholder="Selecione uma Compra" 
        value={selectedCompraId ? `Compra ID: ${selectedCompraId}` : ""}
        editable={false}  // Apenas para visualização
      />
      {/* Lista de compras */}
      <FlatList
         data={compras}
         keyExtractor={(item) => String(item.id)}
         renderItem={({ item }) => (
      <Button 
         title={`Selecionar Compra ${item.id}`} 
         onPress={() => {
         setSelectedCompraId(item.id);
         console.log("Compra selecionada:", item.id);  // Adicionando um log para verificar o ID da compra
      }} 
    />
  )}
/>

      {/* Botão para cadastrar produto */}
      <Button 
        title="Cadastrar Produto"
        onPress={async () => {
          if (selectedCompraId !== null && selectedCompraId !== undefined) {
            await createProduct(selectedCompraId);  // Passa o compraId selecionado
          } else {
            Alert.alert("Erro", "Selecione uma compra primeiro.");
          }
        }}
      />

      {/* Lista de produtos */}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}  // Convertendo ID para String
        renderItem={({ item }) => (
          <Product data={item} />  // Passando o item para o componente Product
        )}
      />
    </View>
  );
};

export default Home;
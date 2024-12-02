import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCompraDatabase } from "@/src/database/useCompraDatabase";
import { useProductDatabase } from "@/src/database/useProductDatabase";
import { ProductDatabase } from "@/src/database/useProductDatabase";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export default function Details() {
  const { show } = useCompraDatabase();
  const { searchByCompraId, removeProduct } = useProductDatabase();
  const params = useLocalSearchParams<{ id: string }>();

  const [compraData, setCompraData] = useState({
    data: "",
    descricao: "",
  });

  const [products, setProducts] = useState<ProductDatabase[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (params.id) {
      const fetchData = async () => {
        const compra = await show(Number(params.id));

        if (compra) {
          setCompraData({
            data: formatDate(compra.data),
            descricao: compra.descricao,
          });

          const productsResponse = await searchByCompraId(Number(params.id));
          setProducts(productsResponse);

          const total = productsResponse.reduce((sum, product) => sum + (product.valor * product.quantidade), 0);
          setTotalValue(total);
        } else {
          setCompraData({
            data: "Compra não encontrada",
            descricao: "",
          });
        }
      };
      fetchData();
    }
  }, [params.id, show, searchByCompraId]);

  const handleRemoveProduct = async (productId: number) => {
    try {
      await removeProduct(productId);
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter(product => product.id !== productId);
        
        const newTotalValue = updatedProducts.reduce((sum, product) => sum + (product.valor * product.quantidade), 0);
        setTotalValue(newTotalValue);

        return updatedProducts;
      });
      Alert.alert("Sucesso", "Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover o produto:", error);
      Alert.alert("Erro", "Não foi possível remover o produto.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32 }}>ID: {params.id}</Text>
      <Text style={{ fontSize: 24 }}>Data: {compraData.data}</Text>
      <Text style={{ fontSize: 32 }}>Descrição: {compraData.descricao}</Text>

      <Text style={{ fontSize: 24, marginTop: 20 }}>Produtos:</Text>
      <FlatList
        data={products}
        keyExtractor={(prod) => String(prod.id)}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nome} - Quantidade: {item.quantidade} - Valor: {item.valor}</Text>
            <Button 
              title="Remover Produto"
              onPress={() => handleRemoveProduct(item.id)}
            />
          </View>
        )}
      />
      
      <Text style={{ fontSize: 24, marginTop: 20 }}>Valor Total: R$ {totalValue.toFixed(2)}</Text>
    </View>
  );
}
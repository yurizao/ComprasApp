import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCompraDatabase } from "@/src/database/useCompraDatabase";
import { useProductDatabase } from "@/src/database/useProductDatabase";
import { ProductDatabase } from "@/src/database/useProductDatabase";

export default function Details() {
  const { show } = useCompraDatabase();
  const { searchByCompraId } = useProductDatabase();  // Buscar produtos por compra_id
  const params = useLocalSearchParams<{ id: string }>();

  const [compraData, setCompraData] = useState({
    data: "",
    descricao: "",
  });

  const [products, setProducts] = useState<ProductDatabase[]>([]);  // Especificando o tipo do estado como ProductDatabase[]

  useEffect(() => {
    if (params.id) {
      const fetchData = async () => {
        // Buscar os dados da compra
        const compra = await show(Number(params.id));

        if (compra) {
          setCompraData({
            data: compra.data,
            descricao: compra.descricao,
          });

          // Buscar os produtos associados a essa compra
          const productsResponse = await searchByCompraId(Number(params.id));
          setProducts(productsResponse);  // Agora o estado é atualizado com o tipo correto
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32 }}>ID: {params.id}</Text>
      <Text style={{ fontSize: 24 }}>Data: {compraData.data}</Text>
      <Text style={{ fontSize: 32 }}>Descrição: {compraData.descricao}</Text>

      <Text style={{ fontSize: 24, marginTop: 20 }}>Produtos:</Text>
      <FlatList
        data={products}
        keyExtractor={(prod) => String(prod.id)}  // 'id' agora está sendo reconhecido
        renderItem={({ item }) => (
          <Text>{item.nome} - {item.quantidade}</Text>  // 'nome' e 'quantidade' também são reconhecidos
        )}
      />
    </View>
  );
}
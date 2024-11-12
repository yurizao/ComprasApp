import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Product } from '@/components/products';
import { useProductDatabase } from "@/src/database/useProductDatabase"; 

const Produtos = () => {
    const { products } = useProductDatabase();

    return (
      <View>
        <Text>Produtos</Text>
        <FlatList
          data={products} // Use a lista de produtos
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Product data={item} />} // Renderiza o componente Product
        />
      </View>
    );
  };


export default Produtos;
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Platform, FlatList, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from "@/components/input";
import { useCompraDatabase, CompraDatabase } from "@/src/database/useCompraDatabase";
import { Compra } from '@/components/compras'
import { useRouter } from 'expo-router';
import Camera from "@/components/camera";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR'); 
};

const Compras = () => {
  const [data, setData] = useState(new Date());
  const [descricao, setDescricao] = useState("");
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(""); 
  const [compras, setCompras] = useState<CompraDatabase[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false); 

  const { create, searchByName, remove } = useCompraDatabase();
  const router = useRouter();

  const handleOpenDetails = (itemId: number) => {
    const path = `/details/${itemId}`;
    router.push(path);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
      const currentDate = selectedDate || data;
      setShow(Platform.OS === 'ios' ? true : false);
      setData(currentDate);
  };

  const createCompra = async () => {
    const compraData = {
      data: data.toISOString(),
      descricao,
    };

    try {
      const result = await create(compraData);
      const compraId = result.insertedRowId;

      Alert.alert("Sucesso!", "Compra cadastrada com sucesso.");
      setDescricao(''); 
      list(); 
    } catch (error) {
      console.log(error);
      Alert.alert("Erro!", "Não foi possível cadastrar a compra.");
    }
  };

  async function list() {
      try {
        const compraResponse = await searchByName(search); 
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text>Data Selecionada: {data.toLocaleDateString()}</Text>
      <Button title="Selecionar Data" onPress={() => setShow(true)} />
      
      {show && (
          <DateTimePicker
              value={data}
              mode="date" 
              display="default" 
              onChange={handleDateChange} 
          />
      )}

      <Input placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <Button title="Cadastrar" onPress={createCompra} />

      <FlatList
          data={compras}
          keyExtractor={(item) => String(item.id)}  
          renderItem={({ item }) => (
              <View>
                  <Text style={{ fontSize: 18 }}>
                    Data da Compra: {formatDate(item.data)}
                  </Text>
                  <Compra data={item} onDelete={() => remove(item.id)} onOpen={() => handleOpenDetails(item.id)} />

            
                  <TouchableOpacity onPress={() => setIsCameraOpen(true)}>
                    <MaterialIcons name="photo-camera" size={30} color="black" />
                  </TouchableOpacity>


                  {isCameraOpen && (
                    <Camera compraId={item.id} onClose={() => setIsCameraOpen(false)} />
                  )}
              </View>
          )}
      />
    </View>
  );
};

export default Compras;
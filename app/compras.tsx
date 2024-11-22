import React, { useState, useEffect } from 'react';
import { View, Button, Text, Platform, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from "@/components/input";
import { useCompraDatabase, CompraDatabase } from "@/src/database/useCompraDatabase";
import { Compra } from '@/components/compras';


const Compras = () => {
    const [data, setData] = useState(new Date());
    const [descricao, setDescricao] = useState("");
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState(""); 
    const [compras, setCompras] = useState<CompraDatabase[]>([]);
    
    const { create, searchByName, remove } = useCompraDatabase();

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || data;
        setShow(Platform.OS === 'ios' ? true : false);
        setData(currentDate);
    };
    
    const createCompra = async () => {
        const compraData = {
          data: data.toISOString(), 
          descricao
        };
        console.log('Compra cadastrada:', compraData);

        try {
            await create(compraData);
            Alert.alert("Sucesso!", "Compra cadastrada com sucesso.");
            setDescricao('');
      
            list ()
            
          } catch (error) {
            console.log(error);
            Alert.alert("Erro!", "Não foi possível cadastrar a compra.");
          }
        };

    async function list() {
        try {
          const response = await searchByName(search);
          setCompras(response);
        } catch (error) {
          console.log(error);
        }
      }

    async function removeCompra(id: number) {
      try{
        await remove(id)
        await list()
      } catch (error) {
        console.log(error)
      }
    }
    

    useEffect(() => {
        list();
      }, [search]);
    

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
        renderItem={({ item }: { item: CompraDatabase }) => (  
          <Compra 
          data={item} 
          onDelete={() => removeCompra(item.id)} 
          />  
        )}
      />

     </View>
    );
  };

export default Compras;
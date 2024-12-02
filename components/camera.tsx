import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

type CameraComponentProps = {
  compraId: number; 
  onClose: () => void;  
};

export default function CameraComponent({ compraId, onClose }: CameraComponentProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<any>(null);

  const cameraRef = useRef<typeof Camera | null>(null); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);

      await handleProductIdentification(photo.uri, compraId.toString());
    }
  };


  const handleProductIdentification = async (photoUri: string, selectedCompraId: string) => {
    const labels = await analyzeImage(photoUri);

    if (labels && labels.length > 0) {
      const productName = labels[0].description;
      const productPrice = getEstimatedPrice(productName);

      await createProduct({
        nome: productName,
        quantidade: 1,
        valor: productPrice,
        compra_id: selectedCompraId,
      });

      Alert.alert("Produto Identificado", `Produto: ${productName} - Preço estimado: ${productPrice}`);
    } else {
      Alert.alert("Erro", "Produto não identificado corretamente.");
    }
  };

  if (hasPermission === null) {
    return <View />; 
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Button title="Tirar Foto" onPress={takePicture} />
          <Button title="Fechar" onPress={onClose} />
        </View>
      </Camera>

      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  photoContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
import axios from 'axios';

const API_KEY = 'AIzaSyAZAe7rJ5r-53dCPC6KqETl0xZtRF1PVOU';

const analyzeImage = async (imageUri: string) => {
  const base64Image = await getBase64(imageUri);  // Função para converter a imagem em base64

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'LABEL_DETECTION',  // Detecção de rótulos (produtos, objetos)
            maxResults: 10,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      requestBody
    );
    console.log('Resposta da API:', response.data);
    return response.data.responses[0].labelAnnotations;  // Retorna os rótulos identificados
  } catch (error) {
    console.error('Erro na requisição para o Google Vision:', error);
  }
};

// Função para converter imagem para base64
const getBase64 = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
};
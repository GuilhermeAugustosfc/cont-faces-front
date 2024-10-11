import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [faceCount, setFaceCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Por favor, selecione uma imagem primeiro.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/detectar_rostos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFaceCount(response.data.quantidade_rostos);
      setProcessedImage(
        `data:image/png;base64,${response.data.imagem_processada}`
      );
    } catch (error) {
      console.error("Erro ao processar a imagem:", error);
      alert(
        "Ocorreu um erro ao processar a imagem. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Detector de Rostos</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : "Enviar"}
        </button>
      </form>
      {faceCount > 0 && <p>Número de rostos detectados: {faceCount}</p>}
      {processedImage && (
        <div>
          <h2>Imagem Processada</h2>
          <img src={processedImage} alt="Rostos detectados" />
        </div>
      )}
    </div>
  );
}

export default App;

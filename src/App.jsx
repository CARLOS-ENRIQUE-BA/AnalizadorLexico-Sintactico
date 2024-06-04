import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Button from "./components/Button";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

function App() {
  const [code, setCode] = useState("");
  const [lexicalAnalysis, setLexicalAnalysis] = useState([]);
  const [syntaxErrors, setSyntaxErrors] = useState(null);

  const onCodeChange = (event) => {
    setCode(event.target.value);
  };

  const onFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Por favor, seleccione un archivo");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:3003/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.status === 404) {
        toast.error(data.error);
      } else {
        setLexicalAnalysis(data.lexical_analysis);
        setSyntaxErrors(data.for_validation.valid ? null : data.for_validation.message);
        if (data.for_validation.valid) {
          toast.success("Tu archivo ha sido analizado con éxito");
        } else {
          toast.error(data.for_validation.message);
        }
        // Agregar aquí la respuesta de la API del código 1
        setResponse(data); // Asegúrate de que setResponse esté definido
      }
    } catch (error) {
      toast.error("Error al subir el archivo");
    }
  };

  const onCodeFormSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      toast.error("Por favor, introduce código");
      return;
    }
    try {
      const response = await fetch("http://localhost:3003/analyze", {
        method: "POST",
        body: code,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setLexicalAnalysis(data.lexical_analysis || []);
      setSyntaxErrors(data.for_validation.valid ? null : data.for_validation.message);
      if (data.for_validation.valid) {
        toast.success("Tu código ha sido analizado con éxito");
      } else {
        toast.error(data.for_validation.message);
      }
      // Agregar aquí la respuesta de la API del código 1
      setResponseOnCode(data); // Asegúrate de que setResponseOnCode esté definido
    } catch (error) {
      toast.error("Error al analizar el código");
    }
  };

  return (
    <div className="app">
      <h1>Analizador Léxico y Sintáctico</h1>
      <div className="input-section">
        <input type="file" className="upload-btn" onChange={onFileUpload} />
        <textarea
          placeholder="Introduzca el código a analizar"
          className="code-input"
          onChange={onCodeChange}
          value={code}
        />
        <Button text="Ejecutar" onClick={onCodeFormSubmit} />
      </div>
      <div className="analysis-section">
        <div className="lexical-analysis">
          <h2>Análisis Léxico</h2>
          {lexicalAnalysis.length > 0 ? (
            <ul>
              {lexicalAnalysis.map((token) => (
                <li key={token.id}>
                  Línea: {token.linea}, Tipo: {token.type}, Valor: {token.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin análisis léxico</p>
          )}
        </div>
        <div className="errors">
          <h2>Errores</h2>
          <p>{syntaxErrors ? syntaxErrors : "Sin errores"}</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

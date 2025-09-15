// App.js
import React, { useState } from 'react';
import { getTideData, getAISummary } from "./service"; 
import './App.css';

function App() {
  const [cidade, setCidade] = useState("olinda");
  const [estado, setEstado] = useState("pernambuco");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSummary("");

      const tideData = await getTideData(cidade, estado);
      const aiResponse = await getAISummary(tideData.htmls, cidade);

      setSummary(aiResponse.result);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar informações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌊 Surfboy App</h1>
        <p>Descubra as melhores condições para surfar</p>
      </header>
      
      <main className="main-content">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Digite o nome da cidade (ex: Olinda)"
              disabled={loading}
            />
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Digite o estado (ex: PE)"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Consultando...' : 'Ver Condições'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}
        
        {summary && (
          <div className="result-card">
            <h2>Condições em {cidade.toUpperCase()}, {estado.toUpperCase()}</h2>
            <div className="ai-analysis">
              <h3>Análise da IA</h3>
              <p>{summary}</p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Desenvolvido para facilitar a vida dos surfistas 🏄‍♂️</p>
      </footer>
    </div>
  );
}

export default App;

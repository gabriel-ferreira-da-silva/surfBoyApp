const API_BASE = "http://localhost:3001/api";

export async function getTideData(cidade, estado) {
  cidade = cidade.toLowerCase();
  estado = estado.toLowerCase();
  
  const response = await fetch(`${API_BASE}/tide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cidade, estado }),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da maré");
  }

  return response.json(); 
}

export async function getAISummary(htmls, cidade) {
  const response = await fetch(`${API_BASE}/aisurvey`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ htmls, cidade }),
  });

  if (!response.ok) {
    throw new Error("Erro ao consultar a AI");
  }

  return response.json();
}
import React from "react";

function ResponseTable({ response }) {
  if (!response) return null;
  return (
    <ul>
      {response.map((token) => (
        <li key={token.id}>
          Línea: {token.linea}, Tipo: {token.type}, Valor: {token.value}
        </li>
      ))}
    </ul>
  );
}

export default ResponseTable;

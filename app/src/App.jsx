import axios from "axios";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { API_URL } from "./core/constants";

function App() {
  const [transferencias, setTransferencias] = useState([]);
  const [operador, setOperador] = useState("");
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  function handleDateInicio(event) {
    setDataInicio(event.target.value);
  }

  function handleDateFinal(event) {
    setDataFinal(event.target.value);
  }

  const ItensDaPaginaAtual = transferencias.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  async function pesquisarDadosBanco() {
    let url = `${API_URL}/transferencias`;

    if (dataInicio && dataFinal && operador) {
      const inicio = `${dataInicio}T00:00:00`;
      const fim = `${dataFinal}T00:00:00`;

      url += `?dataInicial=${encodeURIComponent(
        inicio
      )}&dataFinal=${encodeURIComponent(fim)}&nomeOperador=${encodeURIComponent(
        operador
      )}`;
    } else if (dataInicio && dataFinal) {
      const inicio = `${dataInicio}T00:00:00`;
      const fim = `${dataFinal}T00:00:00`;

      url += `?dataInicial=${encodeURIComponent(
        inicio
      )}&dataFinal=${encodeURIComponent(fim)}`;
    } else if (operador) {
      url += `?nomeOperador=${encodeURIComponent(operador)}`;
    }

    console.log(url);
    const response = await axios.get(url);
    setTransferencias(response.data);

    const saldoTotal = response.data.reduce(
      (acc, transferencia) => acc + transferencia.valor,
      0
    );
    setSaldoTotal(saldoTotal);

    setOperador("");
    setDataFinal("");
    setDataInicio("");
  }

  console.log(ItensDaPaginaAtual);

  return (
    <main>
      <section className="entrada-dados">
        <label>
          Data de início
          <input value={dataInicio} onChange={handleDateInicio} type="date" />
        </label>
        <label>
          Data de fim
          <input value={dataFinal} onChange={handleDateFinal} type="date" />
        </label>
        <label>
          Nome do operador transacionado
          <input
            value={operador}
            type="text"
            onChange={(event) => setOperador(event.target.value)}
          />
        </label>
      </section>

      <div className="button-pesquisa">
        <button onClick={pesquisarDadosBanco}>Pesquisar</button>
      </div>

      <section className="table-dados">
        <table>
          <thead>
            <tr>
              <td colSpan={4}>
                <div>
                  <span>Saldo Total: R$ {saldoTotal.toFixed(2)}</span>
                  <span>Saldo no período: R$ {saldoTotal.toFixed(2)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Nome do Operador</th>
            </tr>
          </thead>
          <tbody>
            {ItensDaPaginaAtual.map((transferencia, index) => (
              <tr key={index}>
                <td>
                  {new Date(
                    transferencia.dataTransferencia
                  ).toLocaleDateString()}
                </td>
                <td>{transferencia.valor}</td>
                <td>{transferencia.tipo}</td>
                <td>{transferencia.nomeOperadorTransacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transferencias.length > itensPorPagina && (
          <div className="pagination">
            {Array.from({
              length: Math.ceil(transferencias.length / itensPorPagina),
            }).map((item, index) => (
              <button
                key={index}
                onClick={() => setPaginaAtual(index + 1)}
                className={index + 1 === paginaAtual ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

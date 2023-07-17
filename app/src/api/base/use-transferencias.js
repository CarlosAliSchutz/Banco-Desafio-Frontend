import { API_URL } from "../../core/constants";
import axios from "axios";

export async function filtrarTransferencias(
  dataInicial,
  dataFinal,
  nomeOperador
) {
  const response = await axios.get(
    `${API_URL}/transferencias?dataInicial=${dataInicial}&dataFinal=${dataFinal}&nomeOperador=${nomeOperador}`
  );
  return response.data;
}

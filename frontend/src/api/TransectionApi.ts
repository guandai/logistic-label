import { GetTransactionsReq, GetTransactionsRes } from "@ddlabel/shared";
import axios from "axios";
import { BE_URL } from "../env_var";

export class TransactionApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	getTransactions = async (params?: GetTransactionsReq) => (await axios.get<GetTransactionsRes>(`${BE_URL}/transactions`, { ...this.config, params })).data
	getTransactionById = async (id: string) => (await axios.get(`${BE_URL}/transactions/${id}`, this.config)).data
}

const api = new TransactionApi();
export default api;

import axios from "axios";
import { ZipInfo } from "@ddlabel/shared";
import { BE_URL } from "../env_var";

export class ZipCodeApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	private path = `${BE_URL}/zipcodes`;
	getZipInfo = async (zip: string) => (await axios.get<ZipInfo>(`${this.path}/${zip}`, this.config)).data;
}

const api = new ZipCodeApi();
export default api;

import { GetZoneRes, GetPostalZoneRes, GetPostalZoneReq, GetZoneReq } from "@ddlabel/shared";
import axios from "axios";
import { BE_URL } from "../env_var";

export class PostalZoneApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	private path = `${BE_URL}/postal_zones`;
	getPostalZone = async (params: GetPostalZoneReq) => (await axios.get<GetPostalZoneRes>(`${this.path}/get_postal_zone`, {
		...this.config,
		params,
	})).data;

	getZone = async ( params: GetZoneReq ) => 
		(await axios.get<GetZoneRes>(`${this.path}/get_zone`,{ ...this.config, params })).data;
}

const api = new PostalZoneApi()
export default api;

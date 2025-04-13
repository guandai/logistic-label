// frontend/src/external/beansApi.ts
import axios from "axios";
import { GetStatusLogRes, GetStatusLogReq, BeansAI } from "@ddlabel/shared";
import { BEANS_API_KEY, BEANS_API_URL } from "../env_var";
// https://isp.beans.ai/enterprise/v1/lists/itemsdocumentation/ky15d3jqrqf2dr49mgqgl?returnEmptyIfMissing=true
export class BeansAiApi {
	private path = BEANS_API_URL;
	private config = { headers: { Authorization: `${BEANS_API_KEY}` } };
	public async getStatusLog(req: GetStatusLogReq) {
		const params = {
			tracking_id: req.trackingNo,
			readable:true,
			include_pod:true,
			include_item:true,};
		return (await axios.get<GetStatusLogRes>(`${this.path}/status_logs`, {...this.config, params})).data;
	}
	public async getPod(itemId: string) {
		return (await axios.get<BeansAI.Pod>(`${this.path}/itemsdocumentation/${itemId}?returnEmptyIfMissing=true`, {...this.config})).data;
	}
	// New method to get routes
	public async getRoutes(updatedAfter?: number) {
		const params = updatedAfter ? { updatedAfter } : {};
		return (await axios.get<BeansAI.RouteList>(`${this.path}/routes`, { ...this.config, params })).data;
	}
	public async getRoutesItems(listRouteId: string, updatedAfter=0) {
		const params = updatedAfter ? { updatedAfter } : {};
		return (await axios.get<BeansAI.ItemList>(`${this.path}/routes/${listRouteId}/items`, { ...this.config, params })).data;
	}

	// New method to get items
	public async getItems(updatedAfter?: number) {
		const params = updatedAfter ? { updatedAfter } : { updatedAfter: 0 };
		return (await axios.get<BeansAI.ItemList>(`${this.path}/items`, { ...this.config, params })).data;
	}
}

const api = new BeansAiApi();
export default api;

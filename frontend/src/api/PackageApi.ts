import { GetPackageRes, CreatePackageReq, CreatePackageRes, GetPackagesReq, GetPackagesRes, ImportPackageReq, ImportPackageRes, UpdatePackageReq, UpdatePackageRes, GetPackagesCsvRes, GetPackagesCsvReq } from "@ddlabel/shared";
import axios, { AxiosProgressEvent } from "axios";
import { BE_URL } from "../env_var";

export class PackageApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	private path = `${BE_URL}/packages`;
	getPackages = async(params? : GetPackagesReq ) => (await axios.get<GetPackagesRes>(`${this.path}`, {...this.config, params})).data
	getPackageById = async(id: string) => (await axios.get<GetPackageRes>(`${this.path}/${id}`, this.config)).data
	createPackage = async(payload: CreatePackageReq) => (await axios.post<CreatePackageRes>(`${this.path}`, payload, this.config)).data
	updatePackage = async(id: string, payload: UpdatePackageReq) => (await axios.put<UpdatePackageRes>(`${this.path}/${id}`, payload, this.config)).data
	deletePackage = async(id: number) => (await axios.delete(`${this.path}/${id}`, this.config)).data
	exportPackage = async(params: GetPackagesCsvReq) => (await axios.get<GetPackagesCsvRes>(`${this.path}/csv`, {...this.config, params})).data
	importPackage = async(payload: ImportPackageReq, onUploadProgress: ((progressEvent: AxiosProgressEvent) => void), socketId?: string) => 
		(await axios.post<ImportPackageRes>(
			`${this.path}/import`, 
			payload,
			{
				headers: {
					...this.config.headers,
					'Content-Type': 'multipart/form-data',
					'socket-id': socketId,
				},
				onUploadProgress,
			}
		)).data
}

const api = new PackageApi();
export default api;

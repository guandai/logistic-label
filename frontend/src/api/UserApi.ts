import axios from "axios";
import { LoginUserReq, LoginUserRes, UpdateUserRes, RegisterUserReq, RegisterUserRes, UpdateUserReq, GetUsersReq, GetUsersRes, GetUserRes } from "@ddlabel/shared";
import { BE_URL } from "../env_var";

export class UserApi {
	private path = `${BE_URL}/users`;
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	getUsers = async (params?: GetUsersReq ) => (await axios.get<GetUsersRes>(`${this.path}`, {...this.config, params})).data
	getUser = async (userId: number) => (await axios.get<GetUserRes>(`${this.path}/${userId}`, this.config)).data;
	deleteUser = async (userId: number) => (await axios.delete(`${this.path}/${userId}`, this.config)).data;
	updateUser = async (payload: UpdateUserReq) => (await axios.put<UpdateUserRes>(`${this.path}/${payload.id}`, payload, this.config)).data;
	login = async (payload: LoginUserReq) => (await axios.post<LoginUserRes>(`${this.path}/login`, payload, this.config)).data;
	register = async (payload: RegisterUserReq) => (await axios.post<RegisterUserRes>(`${this.path}/register`, payload, this.config)).data;
}

const api = new UserApi();
export default api;

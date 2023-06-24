import { IProfile } from "../Models/GraphUser";

export interface IGraphService {
    getUserProfile(): Promise<IProfile>;
}
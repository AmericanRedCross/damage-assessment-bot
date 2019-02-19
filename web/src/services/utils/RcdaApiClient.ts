import axios, { AxiosInstance } from "axios";
import config from "@config";

export default interface RcdaApiClient extends AxiosInstance { }

export const rcdaApiClient = axios.create({
    baseURL: config.rcdaApiHost
});
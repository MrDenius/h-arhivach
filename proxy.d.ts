import GetProxies from "./proxy";

export interface IFreeProxy {
    ip: string;
    port: string;
    country: string;
    countryCode: string;
    protocol: string;
    connect_time: string;
    up_time: string;
    last_update: string;
    speed_download: string;
    url: string;
}

export interface IProxies{
    proxies: Array<IFreeProxy>;
    fasterProxies: Array<IFreeProxy>;
    latencyProxies: Array<IFreeProxy>;
}

export function GetProxies(): Promise<Iproxies>;
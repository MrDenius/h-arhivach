const { RSA_NO_PADDING } = require("constants");
const { get } = require("https");
const ping = require("ping");
var SocksProxyAgent = require("socks-proxy-agent");
const SocksClient = require("socks").SocksClient;
const axios = require("axios").default;

let _onProgress;

const on = (event, callback) => {
	switch (event) {
		case "progress":
			_onProgress = callback;
			break;
		default:
			break;
	}
};

const url = "https://freeproxyip.net/download/sample";

const GetProxy = () => {
	return new Promise((resolve, reject) => {
		get(url, (res) => {
			let raw = "";
			res.on("data", (data) => {
				raw += data;
			});
			res.on("end", () => {
				resolve(raw.replace(/,.*/g, "").split(`\n`));
			});
			res.on("error", (err) => {
				reject(err);
			});
		});
	});
};

/**
 *
 * @param {Array} proxies
 * @returns {Array}
 */
const GetValidProxy = (proxies) => {
	return new Promise((resolve, reject) => {
		const proxiesRet = [];
		let proxyChacked = 1;

		const MAX_THREADS = 25;
		const FC_SUCESS = 10;

		let activeThreads = 0;
		let success = 0;

		const EndCheck = () => {
			if (_onProgress) _onProgress((100 / FC_SUCESS) * success);

			console.log(
				`${proxyChacked}/${proxies.length - 10} (ss: ${success})`
			);
			activeThreads--;
			if (proxyChacked != proxies.length - 10 && success < FC_SUCESS) {
				proxyChacked++;
				return;
			}
			AbortAllRequests();
			resolve(proxiesRet);
		};

		proxies.forEach((proxy) => {
			//proxy = `socks4://${proxy}/`;
			const StartCheck = () => {
				if (MAX_THREADS > activeThreads) {
					// console.log(
					// 	`Active threads checkers ${activeThreads}/${MAX_THREADS}`
					// );
					activeThreads++;
					try {
						CheckProxy(proxy)
							.then((proxyInfo) => {
								//console.log(proxyInfo);
								proxiesRet.push(proxyInfo);
								success++;
								EndCheck();
							})
							.catch((err) => {
								console.log(err);
								EndCheck();
							});
					} catch {
						EndCheck();
					}
				} else {
					setTimeout(StartCheck, 100);
				}
			};
			StartCheck();
		});
	});
};

let ct = [];
const AbortAllRequests = () => {
	ct.forEach((toc) => {
		toc.cancel();
	});
	ct = [];
};

/**
 *
 * @param {string} proxy
 * @returns {Promise<object>}
 */
const CheckProxy = (proxy) => {
	return new Promise((resolve, reject) => {
		const proxyInfo = {
			address: proxy,
		};

		let confI = 0;
		const confirm = () => {
			if (confI < 1) {
				confI++;
				return;
			}
			resolve(proxyInfo);
		};

		ping.promise
			.probe(proxy.split(":")[0], {
				timeout: 500,
			})
			.then((res) => {
				if (!res.alive) {
					reject("proxy error");
				}
				proxyInfo.ping = res.time;
				confirm();

				const agent = new SocksProxyAgent(`socks4://${proxy}/`);
				//opts.agent = agent;

				const cancelTokenSource = axios.CancelToken.source();
				ct.push(cancelTokenSource);

				axios
					.get("http://ip-api.com/json/", {
						//baseURL: "http://ip-api.com/json/",
						httpAgent: agent,
						timeout: 1000,
						handler: { "Content-Type": "application/json" },
						cancelToken: cancelTokenSource.token,
					})
					.then((res) => {
						const json = res.data;
						proxyInfo.countryCode = json.countryCode;
						proxyInfo.country = json.country;
						confirm();
					})
					.catch((err) => {
						reject(err.message);
					});
			})
			.catch((err) => {
				reject(err);
			});
	});
};

module.exports = {
	GetProxy: GetProxy,
	GetValidProxy: GetValidProxy,
	on: on,
};

const ProxyList = require("free-proxy");
const proxyList = new ProxyList();
//const request = require("request");

const proxySite = "https://api.getproxylist.com/proxy";

/**
 * Get proxies list
 * @returns {Promise<object>}
 */
const GetProxies = () => {
	return new Promise((resolve, reject) => {
		const validProxies = [];
		proxyList
			.get()
			.then((proxys) => {
				proxys.forEach((proxy) => {
					if (
						proxy.country != "RU" &&
						Number.parseInt(proxy.speed_download) >= 150 &&
						Number.parseInt(proxy.up_time) > 70 &&
						Number.parseInt(proxy.connect_time) < 2
					) {
						validProxies.push(proxy);
					}
				});

				const fProxies = validProxies
					.map((x) => x)
					.sort((a, b) => b.speed_download - a.speed_download);
				const lProxies = validProxies
					.map((x) => x)
					.sort((a, b) => b.up_time - a.up_time);

				resolve({
					proxies: validProxies,
					fasterProxies: fProxies,
					latencyProxies: lProxies,
				});
			})
			.catch(reject);
	});
};

const GetProxyRules = (proxis) => {
	const rules = {
		proxyRules: `${proxis[0].ip}:${proxis[0].port},`,
	};
	proxis.forEach((proxy) => {
		if (proxy.pot === proxis[0].port && proxis[0].url != proxy.url) {
			rules.proxyRules += `${proxy.ip},`;
		}
	});
	rules.proxyRules = rules.proxyRules.slice(0, -1);
	return rules;
};

const CheckProxy = (proxy) => {
	return new Promise((resolve, reject) => {
		request.get(
			{
				url: "https://google.com/",
				proxy: proxy,
			},
			(err, res) => {
				if (err) {
					resolve(false);
				} else {
					resolve(true);
				}
			}
		);
	});
};

module.exports = {
	GetProxies: GetProxies,
	CheckProxy: CheckProxy,
	GetProxyRules: GetProxyRules,
};

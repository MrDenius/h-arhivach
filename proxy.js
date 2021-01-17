const proxyParser = require("./proxyParser");
//const request = require("request");

const on = (event, callback) => {
	switch (event) {
		default:
			proxyParser.on(event, callback);
			break;
	}
};

const proxySite = "https://api.getproxylist.com/proxy";

/**
 * Get proxies list
 * @returns {Promise<object>}
 */
const GetProxies = () => {
	return new Promise((resolve, reject) => {
		const validProxies = [];
		proxyParser.GetProxy().then((proxy) =>
			proxyParser
				.GetValidProxy(proxy)
				.then((proxys) => {
					proxys.forEach((proxy) => {
						if (
							proxy.countryCode != "RU" &&
							Number.parseInt(proxy.ping) <= 400
						) {
							validProxies.push(proxy);
						}
					});

					const lProxies = validProxies
						.map((x) => x)
						.sort((a, b) => a.ping - b.ping);

					resolve({
						proxies: validProxies,
						lowPingProxies: lProxies,
					});
				})
				.catch(reject)
		);
	});
};

const GetProxyRules = (proxis) => {
	const rules = {
		proxyRules: `socks4://${proxis[0].address},`,
	};
	proxis.forEach((proxy) => {
		if (proxis[0].address != proxy.address) {
			rules.proxyRules += `socks4://${proxy.address},`;
		}
	});
	rules.proxyRules = rules.proxyRules.slice(0, -1);
	console.log(rules.proxyRules);
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
	on: on,
};

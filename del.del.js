var url = require("url");
var http = require("http");

// SOCKS proxy to connect to

//console.log("using proxy server %j", `socks4://${proxy}/`);

// HTTP endpoint for the proxy to connect to
var endpoint = "http://ip-api.com/json/";
var opts = url.parse(endpoint);

// create an instance of the `SocksProxyAgent` class with the proxy server information
var agent = new SocksProxyAgent(`socks4://${proxy}/`);
opts.agent = agent;
//opts.timeout = 3000;

try {
	const req = http.get(opts, (res) => {
		const timaoutAb = setTimeout(() => {
			//res.end();
			//req.abort();
			//reject(new Error("timeout"));
		}, 3000);
		let raw = "";
		res.on("data", (data) => {
			clearTimeout(timaoutAb);
			raw += data;
		});
		res.on("end", () => {
			const json = JSON.parse(raw);
			clearTimeout(timaoutAb);

			proxyInfo.countryCode = json.countryCode;
			proxyInfo.country = json.country;
			confirm();
		});
		res.on("error", (err) => {
			clearTimeout(timaoutAb);
			reject(err.message);
		});
		res.on("close", () => {
			reject("close");
		});

		res.socket.on("close", () => {
			reject("close");
		});
		res.socket.on("error", () => {
			reject("error");
		});
	});
} catch (err) {
	reject(err);
}

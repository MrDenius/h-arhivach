const { WSAETIMEDOUT } = require("constants");
const { app, BrowserWindow } = require("electron");
const Proxy = require("./proxy");

let proxies = [];

function createWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
		},
	});

	const proxyrules = Proxy.GetProxyRules(proxies.fasterProxies);

	win.webContents.session.allowNTLMCredentialsForDomains("*");
	win.webContents.session
		// .setProxy({
		// 	proxyrules,
		// })
		// .setProxy({
		// 	proxyRules: `${proxies.fasterProxies[0].ip}:${proxies.fasterProxies[0].port},`,
		// })
		//.setProxy({ proxyRules: "104.248.153.6:80" })
		.setProxy({ proxyRules: "119.81.189.194:80" })
		.then(() => {
			console.log(
				`Loaded proxy ${win.webContents.session.resolveProxy()}`
			);
			//win.loadURL("http://arhivach.ng/");
			win.loadURL("http://ip-api.com/json/")
				.then(console.log)
				.catch(console.error);
		});
}

Proxy.GetProxies()
	.then((p) => {
		proxies = p;
		app.whenReady().then(createWindow);
	})
	.catch(console.error);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

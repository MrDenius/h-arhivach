const { app, BrowserWindow, ipcMain } = require("electron");
const Proxy = require("./proxy");

let proxies;
if (false) {
	let win = new BrowserWindow({});
}
let win;
let activeProxy = "";

let lastProxyIndex = -1;
const ChangeProxy = (i) => {
	if (!i) {
		lastProxyIndex++;
		i = lastProxyIndex;
	}

	let address;
	if (!Number.isInteger(i)) {
		address = i;
	} else {
		if (!proxies || proxies.lowPingProxies.length <= i + 5) {
			Proxy.GetProxies().then((proxy) => {
				proxies = proxy;
				lastProxyIndex = -1;
			});
		}

		address = `socks4://${proxies.lowPingProxies[i].address}`;
	}

	return win.webContents.session
		.setProxy({
			proxyRules: address,
		})
		.then(() => {
			reply("proxy-server", address);
			activeProxy = address;
		});
};

function createWindow() {
	win = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
		},
	});

	win.webContents.on("will-navigate", (event, url) => {
		console.log(url);
	});

	win.webContents.session.allowNTLMCredentialsForDomains("*");
	//win.loadURL("http://arhivach.ng/")
	//win.loadURL("http://ip-api.com/json/")
	console.log(`file://${__dirname}/StartPage/index.html`);
	win.loadFile(`./StartPage/index.html`)
		.then(StartLoadArh)
		.catch(console.error);
	//win.webContents.openDevTools();
}

const StartLoadArh = () => {
	Proxy.on("progress", (progress) => {
		global.progress = progress;
		win.webContents.executeJavaScript(`global.progress = ${progress}`);
	});
	Proxy.GetProxies()
		.then((p) => {
			proxies = p;
			ChangeProxy()
				.then(() => {
					console.log(
						`Loaded proxy socks4://${proxies.lowPingProxies[0].address}/`
					);
					//win.loadURL("http://arhivach.ng/")
					//win.loadURL("http://ip-api.com/json/")
					//win.loadURL("http://b91466et.beget.tech/")
					win.loadFile(`./PageContainer/index.html`)
						.then(() => {})
						.catch(console.error);
					win.webContents.on("before-input-event", (event, input) => {
						console.log(input);
					});
					win.on("app-command", (e, cmd) => {
						// Navigate the window back when the user hits their mouse back button
						if (
							cmd === "browser-backward" &&
							win.webContents.canGoBack()
						) {
							win.webContents.goBack();
						}
					});
				})
				.catch((err) => {
					throw err;
				});
		})
		.catch(console.error);
};

app.whenReady().then(createWindow);

let _reply;
let reply = (e, m) => {
	if (_reply) {
		_reply(e, m);
	}
};

ipcMain
	.on("PConInited", (event) => {
		_reply = event.reply;
		//reply("url", "http://b91466et.beget.tech/");
		reply("url", "http://ip-api.com/json/");
		reply("proxy-server", activeProxy);
	})
	.on("change-proxy", () => {
		ChangeProxy();
	});

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

const { ipcRenderer } = require("electron");
const mainFrame = document.querySelector(".mainframe");
const urlPanel = document.querySelector("#url-panel");
const extraMenu = document.querySelector("#extra-menu");
const UPManager = require("./urlPanelManager")();

const Init = () => {
	const Resize = () => {
		document.querySelector("body").style.height = innerHeight + "px";
	};
	Resize();
	window.addEventListener("resize", Resize);

	extraMenu.querySelector(".changeProxy").addEventListener("click", () => {
		ipcRenderer.sendSync("change-proxy");
		mainFrame.src = mainFrame.src;
	});

	ipcRenderer
		.on("url", (event, arg) => {
			mainFrame.src = arg;
		})
		.on("proxy-server", (event, arg) => {
			extraMenu.querySelector(".ps").innerHTML = arg;
		});

	//endInit
	ipcRenderer.send("PConInited");
};

Init();

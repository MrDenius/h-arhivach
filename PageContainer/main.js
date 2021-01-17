const { ipcRenderer } = require("electron");
const mainFrame = document.querySelector(".mainframe");
const masthead = document.querySelector(".masthead");

const Init = () => {
	const Resize = () => {
		document.querySelector("body").style.height = innerHeight + "px";
	};
	Resize();
	window.addEventListener("resize", Resize);

	masthead.querySelector(".changeProxy").addEventListener("click", () => {
		ipcRenderer.send("change-proxy");
	});

	ipcRenderer
		.on("url", (event, arg) => {
			mainFrame.src = arg;
		})
		.on("proxy-server", (event, arg) => {
			masthead.querySelector(".ps").innerHTML = arg;
		});

	//endInit
	ipcRenderer.send("PConInited");
};

Init();

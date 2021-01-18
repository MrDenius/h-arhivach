const mainFrame = document.querySelector(".mainframe");
const urlPanel = document.querySelector("#url-panel");
const extraMenu = document.querySelector("#extra-menu");
const { ipcRenderer } = require("electron");

module.exports = () => {
	mainFrame.addEventListener("load", () => {
		urlPanel.querySelector("#url-input").value = mainFrame.src;
	});

	urlPanel.querySelector("#url-reload").addEventListener("click", () => {
		mainFrame.src = mainFrame.src;
	});

	urlPanel
		.querySelector("#browser-extra")
		.addEventListener("click", (event) => {
			const hideMenu = () => (extraMenu.style.display = "none");
			if (extraMenu.style.display === "block") {
				extraMenu.style.display = "none";
				mainFrame.removeEventListener("click", hideMenu);
			} else {
				extraMenu.style.display = "block";
				mainFrame.addEventListener("click", hideMenu);
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		});

	urlPanel
		.querySelector("#url-back")
		.addEventListener("click", (event) =>
			mainframe.contentWindow.history.go(-1)
		);
	urlPanel
		.querySelector("#url-next")
		.addEventListener("click", (event) =>
			mainframe.contentWindow.history.go(1)
		);

	return {};
};

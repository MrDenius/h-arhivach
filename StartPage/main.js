const interLoading = setInterval(() => {
	if (global.progress) {
		document.querySelector(
			".main-text"
		).innerText = `LOADING ${global.progress}%`;
		PBChange(global.progress);
	}

	if (!global.progress && global.progress != 0) {
		AddLog("Loading proxy");
		global.progress = 0;
	} else {
		if (global.progress == 100) {
			AddLog("Starting browser");
			clearInterval(interLoading);
		}
	}
}, 1000 / 60);

const Resize = () => {
	document.querySelector("body").style.height = innerHeight + "px";
};
Resize();
window.addEventListener("resize", Resize);

let PBi = 0;
let PBiM = 0;
let id;
const PBChange = (val) => {
	PBiM = val;
	if (!id) {
		var elem = document.getElementById("myBar");
		id = setInterval(frame, 30);
		function frame() {
			if (PBi >= PBiM) {
				clearInterval(id);
				id = undefined;
			} else {
				PBi++;
				elem.style.width = PBi + "%";
			}
		}
	}
};

const AddLog = (text) => {
	const con = document.querySelector(".logcon");
	const logEl = document.createElement("p");

	logEl.textContent = text;
	logEl.className = "text log-text";

	con.appendChild(logEl);
};

//ForDebug
//return;
// const global = {};

// setTimeout(() => {
// 	global.progress = 0;
// 	const addProg = setInterval(() => {
// 		global.progress += 5;
// 		if (global.progress === 100) clearInterval(addProg);
// 	}, 150);
// }, 1000);

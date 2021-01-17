module.exports = () => {
	const { spawn } = require("child_process");
	const crypto = require("crypto");

	const secret = Math.random().toString();
	const hash = crypto.createHmac("sha256", secret).digest("hex");

	const torProc = spawn("./Tor/tor.exe", [
		"--defaults-torrc",
		"HashedControlPassword",
		hash,
		"Tor\torrc-defaults",
		"+__ControlPort 9151",
		"+__SocksPort",
		"127.0.0.1:9150",
	]);

	const tr = require("tor-request");
	let manager = {
		newSesion: tr.newTorSession,
		disponse: () => {
			torProc.kill();
			tr = undefined;
			manager = undefined;
		},
	};

	return manager;
};

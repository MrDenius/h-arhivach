const { spawn } = require("child_process");
const { exports, module, Math } = require("globalthis/implementation");
const { maxBy } = require("lodash");

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
};
Math.random();

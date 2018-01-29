// node Dropbox\Texts\JavaScript\nodejs\discord-tests\server.js
require("./sys").go(global);
const DClient		 = require("discord.js").Client;
const DC			 = new DClient;
const dKey			 = "WRITE YOUR BOT'S KEY XD";
DC.on("message", msg => {
	sys.io.dir.eachFile("cmd", x => {
		try {
			var ctx = exec(sys.io.readText(x, 1), 1);
			if (ctx.regEx.test(msg.content)) ctx.fn({
				regEx: ctx.regEx, desc: ctx.desc, sys: sys, exec: exec, client: DC,
				msg: msg, ctx: msg.content
			});
		} catch (e) { console.log(e); }
	});
}).on("ready", x => console.log("Bot State: Ready")).login(dKey);

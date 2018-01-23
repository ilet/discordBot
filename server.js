require("./eval").go(global);
const Discord = require("discord.js");
const cli = new Discord.Client();
const xhr = require("xmlhttprequest").XMLHttpRequest;
const getSource = require('tosource');
const jsBeauty = x => {
	return require('js-beautify')(x, {
		indent_with_tabs: !0
	});
};
const leadRole = "Master";

// node Dropbox\Texts\JavaScript\nodejs\discord-tests\server.js
// Discord: report bot state in Debug Console
cli.on("ready", x => console.log("Discord ready"));
cli.on("message", dmsg => {
	// list commands and check them
	var isAdmin = dmsg.member.roles.find("name", leadRole);
	if (/!factoryreset[cmd|commands]+$/.test(dmsg.content))
	{
		if (isAdmin)
		{
			dmsg.reply("Downloading file from GitHub.");
			try {
				var x = new xhr;
				x.open("GET", "https://raw.githubusercontent.com/ilet/discordBot/master/mods/commands.js");
				x.onreadystatechange = function(){
					if (4 === x.readyState && 200 === x.status)
					{
						saveFile("mods/commands.js", x.responseText);
						dmsg.reply("All commands reset.");
					}
				};
				x.send();
			} catch (e) {
				dmsg.reply("Something went wrong while trying to reset.");
			}
		}
		else dmsg.reply(leadRole+" privileges required.");
	}
	else evalJS("mods/commands").forEach(cmd => {
		if (new RegExp(cmd.regEx, ""||cmd.regExMode).test(dmsg.content))
			try {
				var doAct = x => {
					cmd.act(dmsg, dmsg.content, {
						regEx: cmd.regEx, Client: cli, XMLHttpRequest: xhr,
						loadFile: loadFile, loadJSFile: loadJSFile,
						saveFile: saveFile, evalJS: evalJS,
						getSource: getSource, jsBeauty: jsBeauty
					});
				};
				if (cmd.admin && isAdmin)
					doAct();
				else if (cmd.admin && !isAdmin)
					dmsg.reply(leadRole+" privileges required.");
				else if (!cmd.admin)
					doAct();
			} catch(e){
				console.log(e.message);
			}
	});
});
cli.login("NDA0OTMzNDM5MzU2MjcyNjQw.DUdDLg.vzEu4qiGzIZAmWgVUFv14RFtuQY");

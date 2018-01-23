require("./eval").go(global);
const Discord = require("discord.js");
const cli = new Discord.Client();
const xhr = require("xmlhttprequest").XMLHttpRequest;
/*
npm install js-beautify
npm install tosource --save
*/

// node Dropbox\Texts\JavaScript\nodejs\discord-tests\server.js
// Discord: report bot state in Debug Console
cli.on("ready", x => console.log("Discord ready"));
cli.on("message", dmsg => {
	// list commands and check them
	evalJS("mods/commands").forEach(cmd => {
		// convert regEx(string) to RegExp
		// check whether regExMode exists
		// - apply if it exists
		if (new RegExp(cmd.regEx, ""||cmd.regExMode).test(dmsg.content))
		// applying "message" object AS AN ARGUMENT
		// applying "content" string AS AN ARGUMENT
		// applying "client" AS AN ARGUMENT
			try {
				cmd.act(dmsg, dmsg.content, {
					regEx: cmd.regEx,
					Client: cli, XMLHttpRequest: xhr,
					loadFile: loadFile, loadJSFile: loadJSFile,
					saveFile: saveFile,
					evalJS: evalJS,
					getSource: require('tosource'),
					jsBeauty: x => {
						return require('js-beautify')(x, {
							indent_with_tabs: !0
						});
					}
				});
			} catch(e){
				console.log(e.message);
			}
	});
});
cli.login("NDA0OTMzNDM5MzU2MjcyNjQw.DUdDLg.vzEu4qiGzIZAmWgVUFv14RFtuQY");

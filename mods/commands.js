[{
		name: "tasteInfo",
		regEx: "^!taste$",
		act: (dmsg, msg) => {
			var chSend = x => dmsg.channel.send(x);
			chSend("Tastes delicious!");
		}
	},
	{
		name: "createCommand",
		primary: true,
		regEx: "^!create[command|cmd]\\S+(.*)",
		act: (dmsg, msg, glob) => {
			function inside(z, x, y) {
				return z.slice(z.indexOf(x) + x.length, z.lastIndexOf(y));
			}
			var chSend = x => dmsg.channel.send(x),
				mReply = x => dmsg.reply(x);
			var m = msg.match(glob.regEx);
			if (m && m.length) {
				mReply("Sending request to obtain file(timeout=5s)...");
				try {
					var s = m[1],
						x = new glob.XMLHttpRequest;
					x.open("GET", s);
					x.timeout = 5e3;
					x.onreadystatechange = function() {
						if (200 === x.status && 4 === x.readyState) {
							var src = x.responseText;
							chSend("**URL:** " + s.trim() + "\r\nJS to be added:\r\n```js\r\n" + glob.jsBeauty(src) + "```");
							try {
								var canContinue = 1,
									jso = Function("return " + src)(),
									buff = glob.loadJSFile("mods/commands");
								console.log("Evaluation correct #0");
								var JF = Function("return " + buff)();
								console.log("Evaluation correct #1");
								if (jso && (jso.name + []).trim())
									JF.forEach(function(jc) {
										if (jso.name === jc.name) {
											canContinue = 0;
											mReply("Command Add Failure: Following name exists: " + jso.name);
										}
									});
								if (canContinue) {
									JF.push(jso);
									glob.saveFile("mods/commands.js", glob.jsBeauty(glob.getSource(JF)));
									mReply("The Command is supposedly added.");
								}
							} catch (e) {
								mReply("JS Error #2: " + e.message);
							}
						} else if (4 === x.readyState)
							chSend("Something went wrong, make sure URL is correct.\r\nBy the way, reminder: !createcmd http://x.ru/x.js");
					};
					x.send();
				} catch (e) {
					mReply("JS Error #1: " + e.message);
				}
			}
		}
	},
	{
		name: "deleteCommand",
		regEx: "^!delete[command|cmd]\\S+(.*)",
		act: (dmsg, msg, glob) => {
			var n, m = msg.match(glob.regEx),
				buff = glob.loadJSFile("mods/commands");
			var JF = Function("return " + buff)(),
				newArr = [];
			console.log("D Evaluation correct #0");
			if (m && m.length) {
				n = m[1];
				JF.forEach((j, i) => {
					if (n.trim() !== j.name)
						newArr.push(j);
				});
				glob.saveFile("mods/commands.js", glob.jsBeauty(glob.getSource(newArr)));
				dmsg.reply("Command supposedly deleted.");
			}
		}
	},
	{
		name: "createInfo",
		primary: true,
		regEx: "^!addinfo[command|cmd]\\S+(.*)",
		act: (dmsg, msg, glob) => {
			var n, m = msg.match(glob.regEx),
				buff = glob.loadJSFile("mods/commands");
			var JF = Function("return " + buff)();
			if (m && m.length) {
				try {
					var arr = Function("return " + m[1])();
					if ("string" == typeof arr[0] && "string" == typeof arr[1] && "string" == typeof arr[2]) {
						var canDo = 1,
							cmd = {
								name: arr[2],
								regEx: arr[0],
								act: Function("return dmsg => dmsg.channel.send(" + JSON.stringify(arr[1]) + ")")()
							};
						JF.forEach((j, i) => {
							if (arr[2] === j.name)
								canDo = 0;
						});
						if (canDo) {
							JF.push(cmd);
							glob.saveFile("mods/commands.js", glob.jsBeauty(glob.getSource(JF)));
							dmsg.reply("Command supposedly added.");
						}
					} else dmsg.reply("Test in JavaScript console before trying to Add Info Command.\r\nBtw, valid example: !addinfocmd [\"!hello\", \"Ohayou Gozaimasu!\", \"COMMAND_NAME\"]");
				} catch (e) {
					dmsg.reply("Invalid, valid example: !addinfocmd [\"!hello\", \"Ohayou Gozaimasu!\", \"COMMAND_NAME\"]");
				}
			}
		}
	},
	{
		name: "clearMessages",
		regEx: "^!clear messages$",
		act: dmsg => {
			if (dmsg.member.hasPermission("MANAGE_MESSAGES"))
				dmsg.channel.fetchMessages().then(function(L) {
					dmsg.channel.bulkDelete(L);
					dmsg.channel.send(L.array().length + " messages deleted.");
				}, function(err) {
					dmsg.channel.send("ERROR: ERROR CLEARING CHANNEL.")
				});
		}
	},
	{
		name: "deleteMessages",
		regEx: "^!delete (\\d+) [message|messages]+$",
		act: (dmsg, msg, glob) => {
			var m = msg.match(glob.regEx);
			if (m && +m[1] > 0)
				if (dmsg.member.hasPermission("MANAGE_MESSAGES"))
					dmsg.channel.fetchMessages({
						limit: +m[1]
					}).then(function(L) {
						dmsg.channel.bulkDelete(L);
						dmsg.channel.send(L.array().length + " messages deleted.");
					}, function(err) {
						dmsg.channel.send("ERROR: ERROR CLEARING CHANNEL.")
					});
				else if (m[1] < 1)
				dmsg.reply("LoooooL, can you actually delete " + m[1] + " messages yourself? Noob.");
			else dmsg.channel.send("Match fail");
		}
	},
	{
		name: "xanasDOH",
		regEx: "^!test$",
		act: dmsg => dmsg.reply("R.I.P Xana's Dreams of Hope.")
	}
]

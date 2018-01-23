[{
		name: "tasteInfo",
		regEx: "^!taste$",
		example: "!taste",
		act: (dmsg, msg) => {
			var chSend = x => dmsg.channel.send(x);
			chSend("Tastes delicious!");
		}
	},
	{
		name: "createCommand",
		admin: true,
		example: "!createcommand http://x.ru/x.js\r\n!createcmd http://x.ru/x.js",
		regEx: "^!create[command|cmd]\\S+(.*)",
		act: (dmsg, msg, glob) => {
			function inside(z, x, y) {
				return z.slice(z.indexOf(x) + x.length, z.lastIndexOf(y));
			}
			var chSend = x => dmsg.channel.send(x),
				mReply = x => dmsg.reply(x);
			var m = msg.match(glob.regEx);
			if (m && m.length) {
				mReply("Sending request to obtain file (timeout=5s)...");
				try {
					var s = m[1],
						x = new glob.XMLHttpRequest;
					x.open("GET", s);
					x.timeout = 5e3;
					x.onreadystatechange = function() {
						if (200 === x.status && 4 === x.readyState) {
							var src = x.responseText;
							//chSend("**URL:** " + s.trim() + "\r\nJS to be added:\r\n```js\r\n" + glob.jsBeauty(src) + "```");
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
									var data = glob.jsBeauty(glob.getSource(JF));
									if (data.length > 1) {
										glob.saveFile("mods/commands.js", data);
										mReply("The Command is supposedly added.");
									} else mReply("Something went wrong.");
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
		admin: true,
		regEx: "^!delete[command|cmd]\\S+(.*)",
		example: "!deletecommand command_name\r\n!deletecmd command_name",
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
		admin: true,
		regEx: "^!addinfo[command|cmd]\\S+(.*)",
		example: "!addinfocmd [\"!hello\", \"Ohayou Gozaimasu!\", \"COMMAND_NAME\"]\r\n!addinfocommand[\"!hello\", \"Ohayou Gozaimasu!\", \"COMMAND_NAME\"]",
		act: (dmsg, msg, glob) => {
			var n, m = msg.match(glob.regEx),
				buff = glob.loadJSFile("mods/commands");
			var JF = Function("return " + buff)();
			if (m && m.length) {
				try {
					var arr = JSON.parse(m[1]);
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
							var data = glob.jsBeauty(glob.getSource(JF));
							if (data.length > 1) {
								glob.saveFile("mods/commands.js", data);
								mReply("The Command is supposedly added.");
							} else mReply("Something went wrong.");
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
		example: "!clear messages",
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
		example: "!delete 1 message\r\n!delete 2 messages",
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
		example: "!test",
		act: dmsg => dmsg.reply("R.I.P Xana's Dreams of Hope.")
	},
	{
		name: "listCommands",
		admin: true,
		regEx: "^!list commands$",
		example: "!list commands",
		act: (dmsg, msg, glob) => {
			var n, m = msg.match(glob.regEx),
				buff = glob.loadJSFile("mods/commands");
			var r = "",
				JF = Function("return " + buff)();
			JF.forEach(x => {
				r += x.example + "\r\n";
			});
			dmsg.channel.send(r);
		}
	},
	{
		name: "dummyText",
		regEx: "^!dummy$",
		example: "!dummy",
		act: dmsg => dmsg.reply("Kavij's long dummy text is pretty longer than usual sentence(array of words) or it may look like a theory with no particular topic or it does make sense to read the text without getting confused because of this goddamned sentence which is actually long enough.")
	}
]

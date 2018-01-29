{
	desc: "!clear 4 messages",
	regEx: /^!clear (\d+) [messages|message]+$/,
	fn: cf => {
		var dmsg = cf.msg, m = cf.ctx.match(cf.regEx);
		if (dmsg.member.hasPermission("MANAGE_MESSAGES") && m && m[1]>0)
		dmsg.channel.fetchMessages({limit:m[1]}).then(function(L) {
			var c = L.array().length;
			dmsg.channel.bulkDelete(L);
			dmsg.channel.send(c + " message"+(c>1?"s":"")+" deleted.");
		}, function(err) {
			dmsg.channel.send("ERROR: ERROR CLEARING CHANNEL.")
		});
	}
}

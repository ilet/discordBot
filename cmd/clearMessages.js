{
	desc: "!clear messages",
	regEx: /^!clear messages$/,
	fn: cf => {
		var dmsg = cf.msg;
		if (dmsg.member.hasPermission("MANAGE_MESSAGES"))
		dmsg.channel.fetchMessages().then(function(L) {
			dmsg.channel.bulkDelete(L);
			dmsg.channel.send(L.array().length + " messages deleted.");
		}, function(err) {
			dmsg.channel.send("ERROR: ERROR CLEARING CHANNEL.")
		});
		console.log("hello!");
		console.log(this);
	}
}

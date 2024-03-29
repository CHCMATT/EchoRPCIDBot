require('discord.js');
const dbCmds = require('./dbCmds.js');
const postEmbed = require('./postEmbed.js');
const editEmbed = require('./editEmbed.js');

module.exports.startUp = async (client) => {
	const channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID);
	const oldEmbed = await dbCmds.readMsgId("embedMsg");

	try {
		await channel.messages.fetch(oldEmbed);
		editEmbed.editEmbed(client);
	}
	catch {
		postEmbed.postEmbed(client);
	}

	const now = Math.floor(new Date().getTime() / 1000.0);
	const time = `<t:${now}:t>`;

	await client.channels.cache.get(process.env.BOT_LOG_CHANNEL_ID).send(`:bangbang: The ${process.env.BOT_NAME} bot started up at ${time}.`)
};
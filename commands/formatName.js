const moment = require('moment');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'formatname',
	description: 'Formats the nickname of the provided user to the proper standard',
	options: [
		{
			name: 'user',
			description: 'The user you\'d like to format',
			type: 6,
			required: true,
		},
		{
			name: 'callsign',
			description: 'The callsign of the person you\'d like to format',
			type: 4,
			required: true,
		},
		{
			name: 'name',
			description: 'The name of the person you\'d like to format',
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		try {
			if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == '177088916250296320') {
				try {
					const user = interaction.options.getUser('user');
					const callSign = interaction.options.getInteger('callsign');
					const charName = interaction.options.getString('name');
					const newNick = callSign + " | " + charName;
					await interaction.guild.members.cache.get(user.id).setNickname(`${newNick}`, `Requested by: ${interaction.member.user.username}`);
					await interaction.reply({ content: `Successfully changed nickname of \`${user.username}\` to \`${newNick}\`.`, ephemeral: true });
				}
				catch {
					const user = interaction.options.getUser('user');
					await interaction.reply({ content: `:warning: Unable to change nickname - my highest role isn't higher than \`${user.username}\`'s.`, ephemeral: true });
				}
			}
			else {
				await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
			}
		} catch (error) {
			if (process.env.BOT_NAME == 'test') {
				let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');
				let fileParts = __filename.split(/[\\/]/);
				let fileName = fileParts[fileParts.length - 1];

				console.error(errTime, fileName, error);
			} else {
				let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');
				let fileParts = __filename.split(/[\\/]/);
				let fileName = fileParts[fileParts.length - 1];
				console.error(errTime, fileName, error);

				console.log(`An error occured at ${errTime} at file ${fileName} and was created by ${interaction.member.nickname} (${interaction.member.user.username}).`);

				let errString = error.toString();
				let errHandled = false;

				if (errString === 'Error: The service is currently unavailable.' || errString === 'Error: Internal error encountered.' || errString === 'HTTPError: Service Unavailable') {
					try {
						await interaction.editReply({ content: `:warning: One of the service providers we use had a brief outage. Please try to submit your request again!`, ephemeral: true });
					} catch {
						await interaction.reply({ content: `:warning: One of the service providers we use had a brief outage. Please try to submit your request again!`, ephemeral: true });
					}
					errHandled = true;
				}

				let errorEmbed = [new EmbedBuilder()
					.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
					.setDescription(`\`\`\`${errString}\`\`\``)
					.addFields(
						{ name: `Created by:`, value: `${interaction.member.nickname} (<@${interaction.user.id}>)`, inline: true },
						{ name: `Error handled?`, value: `${errHandled}`, inline: true },
						{ name: `Server name:`, value: `${interaction.member.guild.name}`, inline: true },
					)
					.setColor('B80600')
					.setFooter({ text: `${errTime}` })];

				await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
			}
		}
	},
};
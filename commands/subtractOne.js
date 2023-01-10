const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField } = require('discord.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports = {
	name: 'subtractone',
	description: 'Subtracts 1 from the specified counter',
	options: [
		{
			name: 'countername',
			description: 'The name of the counter you are adding to',
			choices: [{ name: 'Search Warrants', value: 'search' }, { name: 'Subpoenas', value: 'subpoenas' }, { name: 'Money Seized', value: 'money' }],
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		if (interaction.member._roles.includes('1055048397746348032') || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			const counterName = interaction.options.getString('countername').toLowerCase();

			if (counterName === "search") {
				await dbCmds.subtractOne("countSearchWarrants");
				var newValue = await dbCmds.readValue("countSearchWarrants");
				var fixedName = "Search Warrants";
			}
			if (counterName === "subpoenas") {
				await dbCmds.subtractOne("countSubpoenas");
				var newValue = await dbCmds.readValue("countSubpoenas");
				var fixedName = "Subpoenas";
			}
			if (counterName === "money") {
				await dbCmds.subtractOne("countMoneySeized");
				var newValue = formatter.format(await dbCmds.readValue("countMoneySeized"));
				var fixedName = "Money Seized";
			}
			await editEmbed.editEmbed(interaction.client);
			await interaction.reply({ content: `Successfully subtracted \`1\` from the \`${fixedName}\` counter - the new total is \`${newValue}\`.`, ephemeral: true});

			await interaction.client.channels.cache.get('1061406583478833223').send(`:warning: \`${interaction.member.user.username}\` subtracted \`1\` from the \`${fixedName}\` counter for a new total of \`${newValue}\`.`)
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`CID\` role or have the \`Administrator\` permission to use this function.`, ephemeral: true});
		}
	},
};

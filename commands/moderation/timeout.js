const { Client, CommandInteraction} = require('discord.js');
const warnModel = require('../../models/warnModel');
const ms = require('ms');
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {
	name: 'timeout',
	description: 'timeout a member',
	userPermissions: ['MODERATE_MEMBERS'],
	options: [
		{
			name: 'user',
			description: 'member to timeout',
			type: 'USER',
			required: true
		},
		{
			name: 'length',
			description: 'how long to timeout for',
			type: 'STRING',
			required: true
		},
		{
			name: 'reason',
			description: 'reason for timeout',
			type: 'STRING',
			required: true
		}
	],
	run: async( client, interaction, args) => {
			if(interaction.member.roles.cache.find(r => r.name === "Staff")) {

			const user = interaction.options.getUser('user');
			const length = interaction.options.getString('length');
			const reason = interaction.options.getString('reason');
			const member = interaction.guild.members.cache.get(user.id);
		
	    new warnModel({
  	    userId: user.id,
    	  guildId: interaction.guildId,
	      moderatorId: interaction.user.id,
  	    reason: `${reason} (${length})`,
    	  timestamp: Date.now(),
				warnType: 'timeout',
  	  }).save();
			
			const timeInMs = ms(length);
			if(!timeInMs) 
			return interaction.followUp('Please specify a valid time!');
		
			client.channels.cache.get(process.env.channelId).send(`${user} has been timed out for ${reason}`)
		
			member.timeout(timeInMs, reason);
			interaction.followUp({ content: 
				`${user} has been timed out for ${length}! (${reason})`
			});
		}else{
			return interaction.followUp({ 
				content: 
					`You do not have permission to do this`,
			});
		};
	},
};
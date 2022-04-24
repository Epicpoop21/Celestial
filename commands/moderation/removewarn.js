const warnModel = require('../../models/warnModel');
const { Client, CommandInteraction} = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose')

module.exports = {
  name: 'remove-warn',
  description: 'Remove a warn using an ID',
	userPermissions: ['MODERATE_MEMBERS'],
  options: [
    {
      name: 'warnid',
      description: 'warnId you want to delete',
      type: 'STRING',
      required: true
    },
  ],
  
  run: async(client, interaction) => {
		if(interaction.member.roles.cache.find(r => r.name === "Staff")) {
		
	    const warnId = interaction.options.getString('warnid');
			const data = await warnModel.findById(warnId);

	    if(!data) return interaction.followUp({ content: `${warnId} is not a valid id!`,})


  	  data.delete();

			const user = interaction.guild.members.cache.get(data.userId)
			client.channels.cache.get(process.env.channelId).send(`${user}'s warning for '${data.reason}' has been removed`)
			return interaction.followUp({ content: `Removed 1 of ${user}'s warnings!`})
		}else{
			return interaction.followUp({ 
				content: 
					`You do not have permission to do this`,
			});
		};
  },
};
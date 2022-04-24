const warnModel = require('../../models/warnModel');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose')

module.exports = {
  name: 'warnings',
  description: 'Display a users warnings',
	userPermissions: ['MANAGE_MESSAGES'],
  options: [
    {
      name: 'target',
      description: 'user that you want to view warnings for',
      type: 'USER',
      required: true
    },
  ],
  run: async(client, interaction) => {
		if(interaction.member.roles.cache.find(r => r.name === "Staff")) {

    	const user = interaction.options.getUser('target');
    
	    const userWarnings = await warnModel.find({ 
  	    userId: user.id, 
    	  guildId: interaction.guildId
		  });
    
  	  if(!userWarnings?.length) return interaction.followUp({ 
    	  content: `${user} has no warnings in the server`
	    });
    
	    const embedDescription = userWarnings.map((warn) => {
      const moderator = interaction.guild.members.cache.get(
        warn.moderatorId
      );


      return [
        `warnId: ${warn._id}`,
        `Moderator: ${moderator || 'Has left'}`,
        `Date: ${moment(warn.timestamp).format('MMMM Do YYYY')}`,
        `Reason: ${warn.reason}`,
				`Type: ${warn.warnType}`
      ].join("\n");
 	   }).join('\n\n');
		
	    const embed = new MessageEmbed()
  	    .setTitle(`${user.tag}'s warnings'`)
	      .setDescription(embedDescription)
  	    .setColor('RANDOM');

 	   interaction.followUp({ embeds: [embed] })
		}else{
			return interaction.followUp({ 
				content: 
					`You do not have permission to do this`,
				});
		};	
	},
};
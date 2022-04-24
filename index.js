const { Client, Collection } = require("discord.js");
const keepAlive = require("./server")
const token = process.env.DISCORD_TOKEN

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);

keepAlive()
client.login(token);
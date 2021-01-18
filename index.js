const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()

const config = require("./config.js"); 


const { Player } = require("discord-player"); //make a new player

const player = new Player(client); //to make the code ez

client.player = player;
client.commands = new Discord.Collection();// make a collection for commands
client.aliases =  new Discord.Collection();//to make a collection for alieases
client.config = require('./config.js');
client.emotes = client.config.emotes;
client.colors = client.config.colors;

fs.readdir("./commands/", (err, files) => {
    //filter files in commands directory with extension .js
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    //this will be executed if there is no files in command folder with extention .js
    if(jsfile.length <= 0) return console.log("Could not find any commands!");
    //it's similar to for loop
    jsfile.forEach((f, i) => { 
     //it will log all the file names with extension .js
    console.log(`Loaded ${f}!`);
        
    let pull = require(`./commands/${f}`);
   
    client.commands.set(pull.config.name, pull);  
    pull.config.aliases.forEach(alias => {
    client.aliases.set(alias, pull.config.name)
                
    });
})});

client.on("ready", () => {

    console.log(`Logged in as ${client.user.tag}`); //If the bot is ready it sends a message what client is it logged in as
    //It will count all voice channels in which bot is connected, if none it will return 0
    let playing = client.voice.connections.size; 
    //It will set the bot status to streaming
    client.user.setPresence({ activity: { name: `music on ${playing}`, type: "STREAMING", url: "https://twitch.tv/afthab007"} })

});

client.on('message', async message => {
  
   if(!message.guild || message.author.bot) return;
        
   if (message.content.indexOf(config.prefix) !== 0) return;

   let args = message.content.slice(config.prefix.length).trim().split(" ");
   const command = args.shift().toLowerCase();
   const commandFile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
   
   if(!commandFile) return;
  
   try {
     commandFile.run(client, message, args, config.prefix);
   } catch(e) {
     return message.channel.send(`An error occured on ${command}:\n ${e.message}`)
   }
        
});

client.login(config.token_bot); //without this bot dead :((

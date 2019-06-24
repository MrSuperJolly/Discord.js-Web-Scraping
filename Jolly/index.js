const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});

let smitePCreg = /23d1x2hb4kyq(.*)Smite PC/g;
let smitePS4reg = /glnkmmppldgp(.*)Smite PS4/g;
let smiteXBOXreg = /7q3rm3krkkt6(.*)Smite Xbox/g;
let smiteSWITCHreg = /23fq1vszg01n(.*)Smite Switch/g;

let anyNumber = /[0-9]+/;
let upper = 100
let guessingGame = {

  gameInProgress: false,
  guessCount: 0

}

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window)


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Playing OSU!");
});




bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let name = message.author.username;

  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.displayAvatarURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Information")
    .setColor("#b51b10")
    .addField("Server Name", message.guild.name)
    .addField("Created On", message.guild.createdAt)
    .addField("you Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memberCount);

    return message.channel.send(serverembed);
    }

  if(cmd === `${prefix}hello`){
      return message.channel.send("Hello! " + name);
  }

  if(cmd === `${prefix}botinfo`){

    let boticon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#b51b10")
    .setThumbnail(boticon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    return message.channel.send(botembed);
  }

  if(cmd === `${prefix}game`)
  {
    if(!guessingGame.gameInProgress)
    {
      startNewGame();
      return message.channel.send("Heloooo! I'm MrSuperjolly. Can you guess the number I'm thinking of? Guess with =guess 'number'" + args);
    }
    else
    {
      return message.channel.send("We're already playing the game... Idiot.");
    }
  }

  if(cmd === `${prefix}guess`)
  {
    if(guessingGame.gameInProgress && args[0].match(anyNumber))
    {
      let guess = parseInt(args[0]);

      if(guess > guessingGame.number)
      {
        guessingGame.guessCount++;
        return message.channel.send("Too high, try again froglet.");
      }
      else if(guess < guessingGame.number)
      {
        guessingGame.guessCount++;
        return message.channel.send("Too low, pathetic");
      }
      else if(guess === guessingGame.number)
      {
        guessingGame.guessCount++;
        guessingGame.gameInProgress = false;
        return message.channel.send("well done " + name + ". You actually got it but it took you " + guessingGame.guessCount + " guesses");
      }

    }
  }

  if(message.content.match(/jolly/))
  {
    let jollyStr = ""
    let jollyMessageArray = ["Huh", "What do you want?", "Jolly is just an alias", "Did someone say my name?", "Hellooo", "Want to play some smite?"]
    let choice = Math.floor(Math.random() * Math.floor(6));

    return message.channel.send(jollyMessageArray[choice]);
  }

  if(cmd === `${prefix}smite`)
  {

    let newResponse = null;


    $.ajax({
            url: 'http://status.hirezstudios.com/',
            type: 'get',
            dataType: 'html',
            async: false,
            success: function(response) {

        newResponse =  response;
        return response
      }
    });


    let status = hirezStatus(smitePCreg, newResponse);
    if(status != "Operational")
    {
      message.channel.send("Might want to check on those servers yo");
      return message.channel.send("Smite PC Servers: " + status);
    }

    return message.channel.send(message.guild.channels.get('255139778448588801').toString() + " It's time for smite, come play");
  }

  if(cmd === `${prefix}status`)
  {
    let newResponse = null;


    $.ajax({
            url: 'http://status.hirezstudios.com/',
            type: 'get',
            dataType: 'html',
            async: false,
            success: function(response) {

        newResponse =  response;
        console.log(respones);
        return response
      }
    });
  
    return message.channel.send("Smite PC Servers: " + hirezStatus(smitePCreg, newResponse) + "\nSmite PS4 Servers: " + hirezStatus(smitePS4reg, newResponse) + "\nSmite Xbox Servers: " + hirezStatus(smiteXBOXreg, newResponse) + "\nSmite Switch Servers: " + hirezStatus(smiteSWITCHreg, newResponse));
  }
});

function startNewGame()
{
  guessingGame.gameInProgress = true;
  guessingGame.number = Math.floor(Math.random() * Math.floor(upper));
  guessingGame.guessCount = 0;
  guessingGame.lastGuess = null;


}

function hirezStatus(reg, hirezHTML)
{
  var status = null;
  let result = "Unkown"




  hirezHTML = hirezHTML.replace(/(\r\n|\n|\r)/gm,"").match(reg);



  if(hirezHTML[0].includes("operational"))
  {
    status = "Operational";
  }
  else if(hirezHTML[0].includes("degraded_performance"))
  {
    status = "Degraded Performance";
  }

return status;

}



bot.login(botconfig.token);

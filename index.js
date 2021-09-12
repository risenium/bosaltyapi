const settings = require('./config.js');

const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');
moment.locale('tr');
require('moment-duration-format');

if(settings.tokens.length <= 0) return console.error('Bir token bağlanmamış.');

for(var key in settings.tokens) {

  const client = new Discord.Client();
  client.login(settings.tokens[key]).catch(() => {
    return;
  });

  client.commands = new Discord.Collection();
  client.on('ready', async () => {
    console.log(`${client.user.tag} ismi ile giriş yapıldı.`);
    client.guilds.cache.forEach(guild => guild.members.fetch());
    
    await fs.readdir('./commands', (err, files) => {
      if(err) return;
      
      for(const key in files) {
        if(files[key].split('.').pop() == 'js') { 
          var file = require(`./commands/${files[key]}`);
          if(file.help && file.help.name) {
            console.log(file.help.name+' komutu yüklendi.');
            client.commands.set(file.help.name, file);
          };
        };
      };

    });
  });

  client.on('message', async message => {
    if(message.partial) message = await message.fetch();
    if(message.author.bot) return;
    
    var arguments;
    var commandName;
     const spaceReg = / +/g;
    
    if(settings.prefixes.some(data => message.content.startsWith(data.prefix))) {

      const data = settings.prefixes.find(data => message.content.startsWith(data.prefix));

      if(data.space === true) {
        arguments = message.content.split(spaceReg).slice(2);
        commandName = message.content.split(spaceReg)[1];
      } else {
        arguments = message.content.split(spaceReg).slice(1);
        commandName = message.content.split(spaceReg)[0].slice(data.prefix.length);
      };
      
    } else if(settings.mentionPrefix) {
      
      if(message.mentions.users.size > 0) {
        if(message.mentions.users.first().id == client.user.id && (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`))) {
      
          arguments = message.content.split(spaceReg).slice(2);
          commandName = message.content.split(spaceReg)[1];
          message.mentions.members = message.mentions.members.map(x => x).slice(1);
          message.mentions.users = message.mentions.users.map(x => x).slice(1);
          
        };
      };
    };
    
    if(!client.commands.some(data => data.help.name.toLowerCase() === commandName || data.config.aliases.find(alias => alias.toLowerCase() === commandName))) return;
    const command = client.commands.find(data => data.help.name.toLowerCase() === commandName || data.config.aliases.find(alias => alias.toLowerCase() === commandName));
  
    if(!command.config.runInDM && message.channel.type !== 'text') return;
    if((command.config.requiredPermissionsMe || []).length > 0 && !command.config.requiredPermissionsMe.some(perm => message.guild.me.hasPermission(perm)) && message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`Bu komutu çalıştırabilmek için şu yetkilere ihtiyacım var:\n${command.config.requiredPermissionsMe.filter(perm => !message.guild.me.hasPermission(perm)).join('\n')}`); 
    if((command.config.requiredPermissions || []).length > 0 && !command.config.filterServerOwner && !command.config.requiredPermissions.some(perm => message.member.hasPermission(perm)) && message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`Bu komutu kullanabilmek için şu yetkilere ihtiyacın var:\n${command.config.requiredPermissions.filter(perm => !message.member.hasPermission(perm)).join('\n')}`); 
    if(command.config.filterServerOwner && message.guild.owner.user.id !== message.author.id) return message.channel.send('Bu komutu sadece bu sunucunun sahibi kullanabilir.');
    if(command.config.cooldown && (database.fetch(`cooldown.${message.author.id}`) || 0) > Date.now()) return message.channel.send(`Bu komutu tekrar kullanabilmek için ${moment.duration((database.fetch(`cooldown.${message.author.id}`) || 0)-Date.now()).format('d [gün], h [saat], m [dakika], s [saniye]')} daha beklemelisin.`);
      
    command.run(client, message, arguments);
    if(command.config.cooldown) {
      if(![' saniye', ' dakika', ' saat', ' gün'].some(data => data.toLowerCase() == command.config.cooldown.toString().split(' ')[1].toLowerCase())) return;
      const cooldownMS = require('ms')(command.config.cooldown.toString().replace(' saniye', 's').replace(' dakika', 'm').replace(' saat', 'h').replace(' gün', 'd'));
      database.set(`cooldown.${message.author.id}`, Date.now()+cooldownMS);
    };
    
  });

  /* Eventleri buraya yapıştırın. */

};


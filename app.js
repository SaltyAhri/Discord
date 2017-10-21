var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression')

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const MongoClient = require('mongodb').MongoClient

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


var routes = require('./routes');
routes(app);


//Connect to DB

MongoClient.connect(config.mongo_url, (err, database) => {
  if(err) return console.log(err)
  db = database;
  exports.db = database;
  console.log('DB ready.')
});

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

module.exports = app;

//Discord Bot

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setGame(':OhIDontSee:');
});

//Insert User
client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  if (message.content.startsWith(config.prefix + "hg register")) {
    var UID = message.author.id;
    var newName = {
		    User_ID: message.author.id,
		    UserName: message.author.username,
		    Alive_Picture: 'imgur.com/AliveAhree',
		    Dead_Picture: 'imgur.com/DedAhree'
  		  };

    db.collection('users').updateOne({User_ID: UID}, newName, {upsert: true},  function(err ,res) {
      if (err) throw err;
      console.log(newName);
    });


    db.collection('users').find({User_ID: UID}, {'_id': 0 }).toArray(function(err, res) {
      if (err) throw err;

      let stats = res[0]

      let U_ID = stats.User_ID;
      let name = stats.UserName;
      let Apic = stats.Alive_Picture;
      let Dpic = stats.Dead_Picture;

    const embed = new Discord.RichEmbed()

    .setColor(3447003)

    .setTitle(`**HG Profile for ${name}**`)

    .setFooter('HG bot 0.1')

    .addField('Discord ID', U_ID)

    .addField('Alive picture', Apic)

    .addField('Dead picture', Dpic);

    message.channel.send({embed});


  });
};

//Show User Profile
    if (message.content.startsWith(config.prefix + "hg profile")){
      db.collection('users').find({User_ID: message.author.id}).toArray(function(err, res) {
        if (err) throw err;

        let stats = res[0]

        let U_ID = stats.User_ID;
        let name = stats.UserName;
        let Apic = stats.Alive_Picture;
        let Dpic = stats.Dead_Picture;

      const embed = new Discord.RichEmbed()

      .setColor(3447003)

      .setTitle(`**HG Profile for ${name}**`)

      .setFooter('HG bot 0.1')

      .addField('Discord ID', U_ID)

      .addField('Alive picture', Apic)

      .addField('Dead picture', Dpic);

      message.channel.send({embed});
    });
  };
});

client.login(config.token);

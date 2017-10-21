const app = require('./app');


exports.search_user = function(req, res) {
  app.db.collection('users').find().toArray((err, results) => {
    if (err) throw err;
    let stats = results;
    res.render('index.ejs', {users: stats})
  });
}


exports.user_profile = function(req, res) {
  app.db.collection('users').find({User_ID: req.params.id}).toArray((err, results) => {
    if (err) return console.log(err)
    res.render('update.ejs', {users: results})
    console.log('User '+req.params.id+' loaded.')
 });
};

exports.user_update = function(req, res) {

  var myquery = {User_ID: req.params.id};

  console.log(req.params.id);

  var newvalues = {$set:{
    Alive_Picture: req.body.lpic,
    Dead_Picture: req.body.dpic
  }};

  app.db.collection('users').updateOne(myquery, newvalues, function(err, result) {
    if (err) throw err;
    res.redirect('/profile/'+req.params.id)
    console.log('User '+req.params.id+' updated.')
  })
};

module.exports = function(app){
  var controller = require('../controller');
  app.get('/', controller.search_user);
  app.get('/profile/:id', controller.user_profile);
  app.post('/profile/:id', controller.user_update);
}

'use strict';

module.exports = function(app) {
  var relays = require('../controllers/relaysController');

  app.route('/relay/:relayId')
    .get(relays.read_relay_status)
    .put(relays.update_relay_status);
};
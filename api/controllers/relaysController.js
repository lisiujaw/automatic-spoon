'use strict';

exports.read_relay_status = function(req, res) {
    var relayId = req.params.relayId;
    var ttyOut = req.app.get('ttyOut');
    var ttyIn = req.app.get('ttyIn');

    // Write to tty for status
    ttyOut.write("relay read " + relayId + "\r", function(error, results) {
        if(error) {
            console.log('Failed to write to port: '+ error);

            res.status(500);
            res.json(error);
        }

        //Listening for response
        ttyIn.once('data', function(data) {
            try {
                res.status(200);
                res.json(new RelayStatus(relayId, data));
            } catch (error) {
                res.status(500);
                res.json({
                    status: "error",
                    statusCode: 500,
                    message: error.message
                  });
            }
        });
    });
};

exports.update_relay_status = function(req, res) {
    var relayId = req.params.relayId;
    var ttyOut = req.app.get('ttyOut');
    var relayStatus = new RelayStatus(relayId, req.body.status);
    var call = 'relay off ' + relayId + "\r";

    if (relayStatus.status == 'on') {
        call = 'relay on ' + relayId + "\r";
    }

    ttyOut.write(call, function(error, results) {
        if(error) {
            console.log('Failed to write to port: '+ error);

            res.status(500);
            res.json(error);
        }

        res.status(200);
        res.json("SEND");
    });
};
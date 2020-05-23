'use strict';

class RelayStatus {
    constructor(relayId, status) {
        if (relayId === undefined) {
          throw new Error("RelayId not valid");
        }

        if (status === undefined || (status != 'on' && status != 'off' )) {
          throw new Error("Status not valid");
        }

        this.relayId = relayId;
        this.status = status;
    }
}

module.exports = RelayStatus
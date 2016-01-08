/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

class CustomEvents {

	constructor(props) {
    	this._map = {};
    	this.MASTERLISTITEM_SELECTION="masterListItemSelection";
    	this.BOARD_SELECTION="BoardSelection";
  	}

    subscribe(clientId,name, cb) {
	console.log("subscribe " + clientId + " = " + name);
      this._map[name] || (this._map[name] = []);
      this._map[name].push({clientId:clientId,cb:cb});
    }

    unsubscribe(clientId,name) {
		for (var i = this._map[name].length-1; i >= 0; i--) {
		    if (this._map[name][i].clientId === this.clientId) {
		        this._map[name].splice(i, 1);
		    }
		}
    }

    notify(name, data) {
    	console.log("Notifying name " + name + " = " + this._map[name]);
		if (!this._map[name]) {
			return;
		}

		// if you want canceling or anything else, add it in to this cb loop
		this._map[name].forEach(function(cb) {
			cb.cb(data);
		});
    }
}

export default new CustomEvents();

const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;
const GLib = imports.gi.GLib;

//let _httpSession;

const globalprotect = new Lang.Class({
		Name: "Woogie's GlobalProtect Extension",
		Extends: PanelMenu.Button,

		_init: function () {
			this.parent(0.0, "globalprotect", false);
			this.buttonText = new St.Label({
				text: _("Loading..."),
				y_align: Clutter.ActorAlign.CENTER
			});
			this.add_actor(this.buttonText);
			this._refresh();
			this.connect('button-press-event', this._showGui);
		},

		_showGui: function () {
			let [res, out, err, exit] = GLib.spawn_sync(null, ["/usr/bin/globalprotect", "launch-ui"], null, GLib.SpawnFlags.SEARCH_PATH, null);
			return true;
		},

		_refresh: function () {
			this._check(this._refreshUI);
			this._removeTimeout();
			this._timeout = Mainloop.timeout_add_seconds(2, Lang.bind(this, this._refresh));
			return true;
		},

		_check: function () {
			let [res, out, err, exit] = GLib.spawn_sync(null, ["/bin/bash", "-c", "/bin/grep gpd /proc/net/route"], null, GLib.SpawnFlags.SEARCH_PATH, null);
			this._refreshUI(exit);
		},

		_refreshUI: function (data) {
			global.log(data);
			if (data == 0) { // vpn connected
			    this.buttonText.set_text("🛡");
			    text = ''; 
			} else if (data == 256) {
                            this.buttonText.set_text("x");
			} else {
                            this.buttonText.set_text("- ERR -");
			}
		},

		_removeTimeout: function () {
			if (this._timeout) {
				Mainloop.source_remove(this._timeout);
				this._timeout = null;
			}
		},

		stop: function () {
			if (this._timeout)
				Mainloop.source_remove(this._timeout);
			this._timeout = undefined;

			this.menu.removeAll();
		}
	}
);

let twMenu;

function init() {
}

function enable() {
	twMenu = new globalprotect;
	Main.panel.addToStatusArea('globalprotect', twMenu);
}

function disable() {
	twMenu.stop();
	twMenu.destroy();
}

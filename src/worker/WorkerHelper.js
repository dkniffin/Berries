/* global importScripts */
// Add a MsgHandler to load external libraries (like THREE.js)
B.Worker.addMsgHandler('loadLibrary', function (e) {
	B.Logger.log('debug', 'Loading ' + e.data.url);
	importScripts(e.data.url);
});

// Send log messages back to the main thread
B.Logger = {
	log: function (type, message) {
		B.Worker.sendMsg({
			action: 'log',
			type: type,
			message: message
		});
	}
};
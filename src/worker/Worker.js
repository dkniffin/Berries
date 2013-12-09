/* 
B.Worker is a wrapper object for communications between the main thread and
the web worker 
*/

B.Worker = {
	/* global self */
	w: typeof window === 'undefined' ? self : new Worker('lib/js/berries/dist/berries-worker-src.js'),
	onMsgHandlers: {},
	addMsgHandler: function (id, func) {
		B.Worker.onMsgHandlers[id] = func;
	},
	sendMsg: function (msg, callback, transObjs) {
		// If a callback is given, define a msgHandler for it
		if (callback) { this.addMsgHandler(msg.action, callback); }
		B.Worker.w.postMessage(msg, transObjs);
	}
};

B.Worker.w.onmessage = function (e) {
	if (typeof B.Worker.onMsgHandlers[e.data.action] !== 'undefined') {
		B.Worker.onMsgHandlers[e.data.action](e);
	} else {
		throw new Error('Unknown action type recieved: ' + e.data.action);
	}
};

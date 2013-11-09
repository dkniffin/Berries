/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
/* global B:true */
B = {};

B.Worker = {
	/* global self */
	w: typeof window === 'undefined' ? self : new Worker('lib/js/berries/dist/berries-worker-src.js'),
	onMsgHandlers: {},
	addMsgHandler: function (id, func) {
		B.Worker.onMsgHandlers[id] = func;
	},
	sendMsg: function (msg) {
		B.Worker.w.postMessage(msg);
	}
};

B.Worker.w.onmessage = function (e) {
	if (typeof B.Worker.onMsgHandlers[e.data.action] !== 'undefined') {
		B.Worker.onMsgHandlers[e.data.action](e);
	} else {
		throw new Error('Unknown action type recieved from worker');
	}
};


B.Worker.addMsgHandler('generateBuilding', function () {
	B.Worker.sendMsg({
		action: 'log',
		type: 'info',
		message: 'got to generateBuilding'
	});
});


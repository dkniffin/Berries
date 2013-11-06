B.Worker = {
	var w = new Worker('berries-generator.js');

	var onMsgHandlers = {};

	function addMsgHandler(id, func) {
		onMsgHandlers[id] = func;
	}

	function sendMsg(msg) {
		w.postMessage(msg);
	}

	w.onmessage = function(e) {
		// if onMsgHandlers[e.data.action] is defined, run that function with the data.
		// else error
	}
}
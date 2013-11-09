B.Worker.addMsgHandler('generateBuilding', function () {
	B.Worker.sendMsg({
		action: 'log',
		type: 'info',
		message: 'got to generateBuilding'
	});
});
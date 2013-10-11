B.Logger = B.Class.extend({

	_logFeedObj: null,
	options: {
		debug: false, // Whether to display debugging messages
		messageClasses: {
			debug: 'logMessageDebug',
			info: 'logMessageInfo',
			warn: 'logMessageWarn',
			error: 'logMessageError'
		},
		colors: {
			debug: '0000ff',
			info: '000000',
			warn: 'ffaa00',
			error: 'ff0000'
		}

	},
	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._logFeedObj = B.DomUtil.get(id);

		/* Define the styles */
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.' + options.messageClasses.debug + ' { color: ' + options.colors.debug + '; }';
		style.innerHTML += '.' + options.messageClasses.info + ' { color: ' + options.colors.info + '; }';
		style.innerHTML += '.' + options.messageClasses.warn + ' { color: ' + options.colors.warn + '; }';
		style.innerHTML += '.' + options.messageClasses.error + ' { color: ' + options.colors.error + '; }';

		document.getElementsByTagName('head')[0].appendChild(style);

	},
	log: function (message, type) {
		var options = this.options;
		
		if (!type) { type = 'info'; }
		var messageObj = document.createElement('p');
		messageObj.innerHTML = message;
		messageObj.className = options.messageClasses[type];


		this._logFeedObj.appendChild(messageObj);
		console[type](message);
	},
	hide: function () {
		console.log(this._logFeedObj);
		this._logFeedObj.style.display = 'none';
	},
	show: function () {
		this._logFeedObj.style.display = 'display';
	}
	
});

B.logger = function (id, options) {
	return new B.Logger(id, options);
};
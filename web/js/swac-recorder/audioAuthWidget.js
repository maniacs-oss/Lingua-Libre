var AudioAuthWidget = function() {
	this.node = document.createElement("div");
	this.nodeEnabled = document.createElement("div");
	this.nodeDisabled = document.createElement("div");
	this.init();
	this.initAudio();
};

AudioAuthWidget.prototype.init = function() {
	this.node.className = "audioAuth";

	var p = document.createElement("p");
	p.appendChild(document.createTextNode("Can not access the audio interface! Maybe you have not plugged in a microphone ..."));
	p.className = "error";
	this.nodeDisabled.appendChild(p);

	var p = document.createElement("p");
	p.className = "waiting";

	var spinner = document.createElement("div");
	spinner.className = "spinner";
	p.appendChild(spinner);

	p.appendChild(document.createTextNode("You must allow access to your sound card ..."));
	
	this.node.appendChild(p);
};

AudioAuthWidget.prototype.appendChild = function(node) {
	this.nodeEnabled.appendChild(node);
};

AudioAuthWidget.prototype.setEnabled = function(value) {
	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
	this.node.appendChild(value ? this.nodeEnabled : this.nodeDisabled);
};

AudioAuthWidget.prototype.enabled = function(stream) {
	if ("onenabled" in this) this.onenabled(stream);
};

AudioAuthWidget.prototype.onGetUserMediaSuccess = function(localMediaStream) {
	this.enabled(localMediaStream);
	this.setEnabled(true);
};

AudioAuthWidget.prototype.onGetUserMediaFail = function(err) {
	console.log("The following error occured: " + err);
	this.setEnabled(false);
};

AudioAuthWidget.prototype.initAudio = function() {
	var self = this;

	// Current best practice to get the audio stream
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({audio: true, video:false})
		.then(function(localMediaStream) {
			self.onGetUserMediaSuccess(localMediaStream);
		} ).catch(function(err) {
			self.onGetUserMediaFail(err);
		} );
	}
	// Legacy methods, kept to support old browsers
	else {
		navigator.getUserMediaFct = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		if (!navigator.getUserMediaFct) {
			self.setEnabled(false);
			return;
		}

		navigator.getUserMediaFct(
			{"audio": true, "video": false},
			function(localMediaStream) {
				self.onGetUserMediaSuccess(localMediaStream);
			},
			function(err) {
				self.onGetUserMediaFail(err);
			}
		);
	}
};


var radToDeg = THREE.Math.radToDeg;

AFRAME.registerComponent('anchor-nav', {
	schema: {
		enabled: {
			default: true
		},
		target: {
			default: ''
		},
		distance: {
			default: 1
		},
		enableRotate: {
			default: true
		},
		rotateSpeed: {
			default: 0.010
		},
	    enableDamping: {
			default: false
		},
		dampingFactor: {
			default: 0.25
		},
	    enableKeys: {
			default: true
		},
		minAzimuthAngle: {
			default: -Infinity
		},
		maxAzimuthAngle: {
			default: Infinity
		},
		minPolarAngle: {
			default: 0
		},
		maxPolarAngle: {
			default: Math.PI
		},
		minDistance: {
			default: 0
		},
		maxDistance: {
			default: Infinity
		},
		dataEl: {
			type: 'selector'
		}
	},
	
	multiple: false,

	init: function () {
		this.sceneEl = this.el.sceneEl;
	    this.object = this.el.object3D;
    	this.target = this.sceneEl.querySelector(this.data.target).object3D.position;

		// this.lookControls = null;

		// if (this.el.components['look-controls']) {
		// 	this.lookControls = this.el.components['look-controls'];
		// } else {
		// 	this.el.setAttribute('look-controls', '');
		// 	this.lookControls = this.el.components['look-controls'];
		// }
		// this.lookControls.pause();

		this.dolly = new THREE.Object3D();
		this.dolly.position.copy(this.object.position);

		this.STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_DOLLY: 4,
			TOUCH_PAN: 5,
			ROTATE_TO: 6
		};

		this.state = this.STATE.NONE;

		this.EPS = 0.000001;
		this.lastPosition = new THREE.Vector3();
		this.lastQuaternion = new THREE.Quaternion();

	    this.spherical = new THREE.Spherical();
	    this.sphericalDelta = new THREE.Spherical();

		this.scale = 1.0;
		this.zoomChanged = false;

		this.rotateStart = new THREE.Vector2();
		this.rotateEnd = new THREE.Vector2();
		this.rotateDelta = new THREE.Vector2();

		this.dollyStart = new THREE.Vector2();
		this.dollyEnd = new THREE.Vector2();
		this.dollyDelta = new THREE.Vector2();

        this.vector = new THREE.Vector3();
    	this.desiredPosition = new THREE.Vector3();

		this.keys = {
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			BOTTOM: 40
		};

	    this.bindMethods();
	},


	update: function (oldData) {
		// console.log('component update');

		this.dolly.position.copy(this.object.position);
		this.updateView(true);
	},


	remove: function () {
    	this.removeEventListeners();
	},
	tick: function () {
		var render = this.data.enabled ? this.updateView() : false;
		if (render === true && this.data.logPosition === true) {
			console.log(this.el.object3D.position);
		}
	},
	onEnterVR: function () {
		console.log('enter vr');

		this.saveCameraPose();

		// this.el.setAttribute('position', {x: 0, y: 2, z: 5});
		// this.el.setAttribute('rotation', {x: 0, y: 0, z: 0});

		// this.pause();
		// this.lookControls.play();
		if (this.data.autoRotate) console.warn('orbit-controls: Sorry, autoRotate is not implemented in VR mode');
	},

	onExitVR: function () {
		console.log('exit vr');

		// this.lookControls.pause();
		// this.play();

		this.restoreCameraPose();
		this.updateView(true);
	},

	play: function () {
		AFRAME.log('nav playing');
		this.data.enabled = true;


		// this.onExitVR();

		// var camera, cameraType;
		// this.object.traverse(function (child) {
		// 	if (child instanceof THREE.PerspectiveCamera) {
		// 		camera = child;
		// 		cameraType = 'PerspectiveCamera';
		// 	} else if (child instanceof THREE.OrthographicCamera) {
		// 		camera = child;
		// 		cameraType = 'OrthographicCamera';
		// 	}
		// });

		// this.camera = camera;
		// this.cameraType = cameraType;

		this.sceneEl.addEventListener('render-target-loaded', this.onRenderTargetLoaded, false);

		// if (this.lookControls) this.lookControls.pause();
		if (this.canvasEl) this.addEventListeners();
	},
	pause: function () {
		AFRAME.log('nav paused');
				// this.onEnterVR();
		this.data.enabled = false;
		this.removeEventListeners();
	},

	onRenderTargetLoaded: function () {
		this.sceneEl.removeEventListener('render-target-loaded', this.onRenderTargetLoaded, false);
		this.canvasEl = this.sceneEl.canvas;
		this.addEventListeners();
	},


	bindMethods: function () {
		AFRAME.log('nav methods binded');
		this.onRenderTargetLoaded = this.onRenderTargetLoaded.bind(this);

		this.onContextMenu = this.onContextMenu.bind(this);
		this.onTrackpadTouchStart = this.onTrackpadTouchStart.bind(this);
		// this.onTouchStart = this.onTouchStart.bind(this);
		// // this.onTouchMove = this.onTouchMove.bind(this);
		// this.onTouchEnd = this.onTouchEnd.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	},

	addEventListeners: function () {
		AFRAME.log('nav event listeners added');
		this.onRenderTargetLoaded = this.onRenderTargetLoaded.bind(this);
		this.canvasEl.addEventListener('contextmenu', this.onContextMenu, false);
		// this.data.dataEl.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
		this.data.dataEl.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
		// this.canvasEl.addEventListener('mousedown', this.onTouchStart, false);
		// this.canvasEl.addEventListener('mouseup', this.onTouchEnd, false);
		// this.canvasEl.addEventListener('touchmove', this.onTouchMove, false);
		window.addEventListener('keydown', this.onKeyDown, false);
	},

	removeEventListeners: function () {
		AFRAME.log('nav event listenters removed');
		this.canvasEl.removeEventListener('contextmenu', this.onContextMenu, false);
		// this.data.dataEl.removeEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
		this.data.dataEl.removeEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
		// this.canvasEl.removeEventListener('mousedown', this.onTouchStart, false);
		// this.canvasEl.removeEventListener('mouseup', this.onTouchEnd, false);
		// this.canvasEl.removeEventListener('touchmove', this.onTouchMove, false);
		window.removeEventListener('keydown', this.onKeyDown, false);
	},

	onContextMenu: function (event) {
		event.preventDefault();
	},

	// onTouchStart: function (event) {
	// 	console.log('onTouchStart');

	// 	if (this.data.enabled === false) return;

	// 	switch (event.touches.length) {
	// 		case 1: // one-fingered touch: rotate
	// 			if (this.data.enableRotate === false) return;
	// 			this.onEnterVR(event);
	// 			this.state = this.STATE.TOUCH_ROTATE;
	// 			break;
	// 		// case 2: // two-fingered touch: dolly
	// 		// 	if (this.data.enableZoom === false) return;
	// 		// 	this.handleTouchStartDolly(event);
	// 		// 	this.state = this.STATE.TOUCH_DOLLY;
	// 		// 	break;
	// 		// case 3: // three-fingered touch: pan
	// 		// 	if (this.data.enablePan === false) return;
	// 		// 	this.handleTouchStartPan(event);
	// 		// 	this.state = this.STATE.TOUCH_PAN;
	// 		// 	break;
	// 		default:
	// 			this.state = this.STATE.NONE;
	// 	}

	// 	if (this.state !== this.STATE.NONE) {
	// 		this.el.emit('start-drag-orbit-controls', null, false);
	// 	}
	// },

	// onTouchEnd: function (event) {
	// 	console.log('onTouchEnd');

	// 	if (this.data.enabled === false) return;

	// 	this.onExitVR(event);

	// 	this.el.emit('end-drag-orbit-controls', null, false);

	// 	this.state = this.STATE.NONE;
	// },

	onKeyDown: function (event) {
	// console.log('onKeyDown');

		if (this.data.enabled === false || this.data.enableKeys === false || this.data.enablePan === false) return;

		this.handleKeyDown(event);
	},

	onTrackpadTouchStart: function (event) {
		AFRAME.log('touch event');
		this.handleTouchMoveRotate(event);
	},

	handleTouchMoveRotate: function (event) {
		// console.log( 'handleTouchMoveRotate' );
		AFRAME.log('touch actuating');
		AFRAME.log(event);
		this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
		AFRAME.log('297');
		this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
		AFRAME.log('299');
		var canvas = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
		// rotating across whole screen goes 360 degrees around
		AFRAME.log('301');
		this.rotateLeft(2 * Math.PI * this.rotateDelta.x / canvas.clientWidth * this.data.rotateSpeed);
		// rotating up and down along whole screen attempts to go 360, but limited to 180
		AFRAME.log('304');
		this.rotateUp(2 * Math.PI * this.rotateDelta.y / canvas.clientHeight * this.data.rotateSpeed);
		AFRAME.log('306');
		this.rotateStart.copy(this.rotateEnd);
		AFRAME.log('308');
		this.updateView();
	},

	handleKeyDown: function (event) {
		switch (event.keyCode) {
			case this.keys.UP:
				// console.log( 2 * Math.PI * this.data.rotateSpeed );
				this.rotateUp(2 * Math.PI * this.data.rotateSpeed);
				this.updateView();
				break;
			case this.keys.BOTTOM:
				// console.log( 'handleKeyDown' );
				this.rotateUp(-2 * Math.PI * this.data.rotateSpeed);
				this.updateView();
				break;
			case this.keys.LEFT:
				// console.log( 'handleKeyLeft' );
				this.rotateLeft(2 * Math.PI * this.data.rotateSpeed);
				this.updateView();
				break;
			case this.keys.RIGHT:
				// console.log( 'handleKeyRight' );
				this.rotateLeft(-2 * Math.PI * this.data.rotateSpeed);
				this.updateView();
				break;
		}
	},


	rotateLeft: function (angle) {
		this.sphericalDelta.theta -= angle;
	},

	rotateUp: function (angle) {
		// console.log("angle: " + angle);
		this.sphericalDelta.phi -= angle;
	},

	lookAtTarget: function (object, target) {
		var v = new THREE.Vector3();
		v.subVectors(object.position, target).add(object.position);
		object.lookAt(v);
	},

	saveCameraPose: function () {
		if (this.savedPose) { return; }
		this.savedPose = {
			position: this.dolly.position,
			rotation: this.dolly.rotation
		};
	},

	/*
	* RESTORE CAMERA POSE (WHEN EXITING VR)
	*/

	restoreCameraPose: function () {
		if (!this.savedPose) { return; }
		this.dolly.position.copy(this.savedPose.position);
		this.dolly.rotation.copy(this.savedPose.rotation);
		this.savedPose = null;
	},

	updateView: function (forceUpdate) {
		var offset = new THREE.Vector3();

		var quat = new THREE.Quaternion().setFromUnitVectors(this.dolly.up, new THREE.Vector3(0, 1, 0)); // so camera.up is the orbit axis
		var quatInverse = quat.clone().inverse();

		offset.copy(this.dolly.position).sub(this.target);
		offset.applyQuaternion(quat); // rotate offset to "y-axis-is-up" space
		this.spherical.setFromVector3(offset); // angle from z-axis around y-axis

		// if (this.data.autoRotate && this.state === this.STATE.NONE) this.rotateLeft(this.getAutoRotationAngle());

		this.spherical.theta += this.sphericalDelta.theta;
		this.spherical.phi += this.sphericalDelta.phi;
		this.spherical.theta = Math.max(this.data.minAzimuthAngle, Math.min(this.data.maxAzimuthAngle, this.spherical.theta)); // restrict theta to be inside desired limits
		this.spherical.phi = Math.max(this.data.minPolarAngle, Math.min(this.data.maxPolarAngle, this.spherical.phi)); // restrict phi to be inside desired limits
		this.spherical.makeSafe();
		this.spherical.radius *= this.scale;
		this.spherical.radius = Math.max(this.data.minDistance, Math.min(this.data.maxDistance, this.spherical.radius)); // restrict radius to be inside desired limits

		offset.setFromSpherical(this.spherical);
		offset.applyQuaternion(quatInverse); // rotate offset back to "camera-up-vector-is-up" space

		this.dolly.position.copy(this.target).add(offset);

		if (this.target) {
			this.lookAtTarget(this.dolly, this.target);
		}

		if (this.data.enableDamping === true) {
			this.sphericalDelta.theta *= (1 - this.data.dampingFactor);
			this.sphericalDelta.phi *= (1 - this.data.dampingFactor);
		} else {
			this.sphericalDelta.set(0, 0, 0);
		}

		this.scale = 1;

	    // update condition is:
	    // min(camera displacement, camera rotation in radians)^2 > EPS
	    // using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if (forceUpdate === true ||
			this.zoomChanged ||
			this.lastPosition.distanceToSquared(this.dolly.position) > this.EPS ||
			8 * (1 - this.lastQuaternion.dot(this.dolly.quaternion)) > this.EPS) {
			// this.el.emit('change-drag-orbit-controls', null, false);

			var hmdQuaternion = this.calculateHMDQuaternion();
			var hmdEuler = new THREE.Euler();
			hmdEuler.setFromQuaternion(hmdQuaternion, 'YXZ');

			this.el.setAttribute('position', {
				x: this.dolly.position.x,
				y: this.dolly.position.y,
				z: this.dolly.position.z
			});

			this.el.setAttribute('rotation', {
				x: radToDeg(hmdEuler.x),
				y: radToDeg(hmdEuler.y),
				z: radToDeg(hmdEuler.z)
			});

			this.lastPosition.copy(this.dolly.position);
			this.lastQuaternion.copy(this.dolly.quaternion);

			this.zoomChanged = false;

			return true;
		}

		return false;
	},

	calculateHMDQuaternion: (function () {
		var hmdQuaternion = new THREE.Quaternion();
		return function () {
			hmdQuaternion.copy(this.dolly.quaternion);
			return hmdQuaternion;
		};
	})()
});	
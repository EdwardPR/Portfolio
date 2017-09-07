AFRAME.registerComponent('sub-menu', {
  schema: {
    enabled: {
    	default: true
    }
  },
  init: function () {

  	this.bind();
  },
  bind: function () {
  	// console.log('methods bound');

  	this.onMouseEnter = this.onMouseEnter.bind(this);
  	this.onMouseLeave = this.onMouseLeave.bind(this);
  	this.onClick = this.onClick.bind(this);
  },
  play: function () {
  	// console.log('play sub-menu');

  	this.addEventListeners();
  },
  pause: function () {
  	// console.log('pause sub-menu');

  	this.removeEventListeners();
  },
  // update: function (oldData) {
  // 	console.log('update sub-menu');

  // 	this.addEventListeners();
  // },
  addEventListeners: function() {
  	// console.log('adding event listeners');

  	this.el.addEventListener('mouseenter', this.onMouseEnter);
  	this.el.addEventListener('mouseleave', this.onMouseLeave);
  	this.el.addEventListener('click', this.onClick);
  },
  removeEventListeners: function() {
  	// console.log('removing event listeners');

  	this.el.removeEventListener('mouseenter', this.onMouseEnter);
  	this.el.removeEventListener('mouseleave', this.onMouseLeave);
  	this.el.removeEventListener('click', this.onClick);
  },
  onMouseEnter: function (event) {
  	console.log('a mouse enter event');

  	var button = this.el.getAttribute('id');

  	switch (button) {
  // 		case 'schedule':
  // 			this.el.setAttribute('color', "#7C8193");
  // 			break;
		// case 'subMenu':
  // 			this.el.setAttribute('color', "#7C8193");
  // 			break;
		case 'earth':
			console.log("earthenter");
			document.querySelector('#earthLabel').emit("textFadeIn", {target: '#earthLabel'});
			break;
		case 'corona':
			document.querySelector('#sunLabel').emit("textFadeIn", {target: '#sunLabel'});
			break;
		case 'moreInfo':
  			// this.el.setAttribute('color', "#7C8193");
			document.querySelector('#moreInfoRightBit').emit("mouseenter", {target: '#moreInfoRightBit'});
  			break;
		case 'moreInfoRightBit':
  			// this.el.setAttribute('color', "#7C8193");
			document.querySelector('#moreInfo').emit("mouseenter", {target: '#moreInfo'});
  			break;
  	}
  },
  onMouseLeave: function (event) {
  	// console.log('a mouse leave event');

  	var button = this.el.getAttribute('id');

	switch (button) {
	// 	case 'schedule':
	// 		this.el.setAttribute('color', "#252d4d");
	// 		break;
	// 	case 'subMenu':
	// 		this.el.setAttribute('color', "#252d4d");
	// 		break;
		case 'earth':
			console.log("earthleave");
			document.querySelector('#earthLabel').emit("textFadeOut", {target: '#earthLabel'});
			break;
		case 'corona':
			document.querySelector('#sunLabel').emit("textFadeOut", {target: '#sunLabel'});
			break;
		case 'moreInfo':
			// this.el.setAttribute('color', "#252d4d");
			document.querySelector('#moreInfoRightBit').emit("mouseleave", {target: '#moreInfoRightBit'});	
			break;
		case 'moreInfoRightBit':
			// this.el.setAttribute('color', "#252d4d");
			document.querySelector('#moreInfo').emit("mouseleave", {target: '#moreInfo'});	
			break;
  	}
  },
  onClick: function (event) {
  	// console.log('a mouse click event');

  	var button = this.el.getAttribute('id');

  	// console.log(this.el);
  	//   	console.log(document.querySelector('#expandedMenu').components);

  	switch (button) {
  		case 'expandButton':
  			document.querySelector('#expandedMenu').setAttribute('visible', true);
			// document.querySelector('#expandButton').emit('expand', {target: '#expandButton'});
			document.querySelector('#expandButtonText').setAttribute('value', "_");
			document.querySelector('#expandButtonText').setAttribute('position', {x: -0.28, y: 0.6, z:0});
			this.el.setAttribute('id', 'minimizeButton');
			break;
		case 'minimizeButton':
			document.querySelector('#expandedMenu').setAttribute('visible', false);
			document.querySelector('#minimizeButton').emit('collapse', {target: '#minimizeButton'});
			document.querySelector('#expandButtonText').setAttribute('value', "+");
			document.querySelector('#expandButtonText').setAttribute('position', {x: -0.29, y: 0.12, z:0});
			this.el.setAttribute('id', 'expandButton');
			break;
		case 'maximizeMainMenu':
			document.querySelector('#mainMenu').setAttribute('visible', true);
			document.querySelector('#mainMenuOverlay').setAttribute('visible', true);
			this.el.setAttribute('id', 'minimizeMainMenu');
			break;
		case 'minimizeMainMenu':
			document.querySelector('#mainMenu').setAttribute('visible', false);
			document.querySelector('#mainMenuOverlay').setAttribute('visible', false);
			this.el.setAttribute('id', 'maximizeMainMenu');
			break;

  	}
  }
});


AFRAME.registerComponent('secondary-menu', {
  init: function () {

  	this.bind();
  },
  bind: function () {
  	// console.log('methods bound');

  	this.onMouseEnter = this.onMouseEnter.bind(this);
  	this.onMouseLeave = this.onMouseLeave.bind(this);
  	this.onClick = this.onClick.bind(this);
  },
  play: function () {
  	// console.log('play sub-menu');

  	this.addEventListeners();
  },
  pause: function () {
  	// console.log('pause sub-menu');

  	this.removeEventListeners();
  },
  addEventListeners: function() {
  	// console.log('adding event listeners');

  	this.el.addEventListener('mouseenter', this.onMouseEnter);
  	this.el.addEventListener('mouseleave', this.onMouseLeave);
  	this.el.addEventListener('click', this.onClick);
  },
  removeEventListeners: function() {
  	// console.log('removing event listeners');

  	this.el.removeEventListener('mouseenter', this.onMouseEnter);
  	this.el.removeEventListener('mouseleave', this.onMouseLeave);
  	this.el.removeEventListener('click', this.onClick);
  },
  onMouseEnter: function (event) {
  	// console.log('a mouse enter event');

  	// var button = this.el.getAttribute('id');

  	// switch (button) {
  	// 	case 'backButtonRim':
  	// 		document.querySelector('#backButtonRim').setAttribute('position', {x: -0.1, y:0, z: -0.015});
  	// 		break;
  	// 	case 'resetMarksRim':
  	// 		document.querySelector('#resetMarksRim').setAttribute('position', {x: -0.1, y:0, z: -0.015});
  	// 		break;
  	// 	case 'downLinkTimesRim':
  	// 		document.querySelector('#downLinkTimesRim').setAttribute('position', {x: -0.1, y:0, z: -0.015});
  	// 		break;
  	// 	case 'transmitTimesRim':
  	// 		document.querySelector('#transmitTimesRim').setAttribute('position', {x: -0.1, y:0, z: -0.015});
  	// 		break;
  	// }
  },
  onMouseLeave: function (event) {
  	// console.log('a mouse leave event');

  	// var button = this.el.getAttribute('id');

	// switch (button) {
 //  		case 'backButtonRim':
 //  			document.querySelector('#backButtonRim').setAttribute('position', {x: 0, y:0, z: 0});
 //  			break;
 //  		case 'resetMarksRim':
 //  			document.querySelector('#resetMarksRim').setAttribute('position', {x: 0, y:0, z: 0});
 //  			break;
 //  		case 'downLinkTimesRim':
 //  			document.querySelector('#downLinkTimesRim').setAttribute('position', {x: 0, y:0, z: 0});
 //  			break;
 //  		case 'transmitTimesRim':
 //  			document.querySelector('#transmitTimesRim').setAttribute('position', {x: 0, y:0, z: 0});
 //  			break;
 //  	}
  },
  onClick: function (event) {
  	console.log('a mouse click event');

  	var button = this.el.getAttribute('id');

  	// console.log(this.el);
  	//   	console.log(document.querySelector('#').components);

  	switch (button) {
		case 'subMenu':
			document.querySelector('#subSubMenu').setAttribute('visible', true);
			document.querySelector('#subSubMenuOverlay').setAttribute('visible', true);
  			break;
		case 'backButtonRim':
			document.querySelector('#subSubMenu').setAttribute('visible', false);
			document.querySelector('#subSubMenuOverlay').setAttribute('visible', false);
			break;
		case 'resetMarksRim':
			console.log('resetMarksRim');
			var invisibleResets = document.querySelectorAll('.resetPoints');
			for (var i = 0; i < invisibleResets.length; i++) {
				console.log(invisibleResets[i].getAttribute('visible'));
				if (!invisibleResets[i].getAttribute('visible')) {
					invisibleResets[i].setAttribute('visible', true);
				} else {
					invisibleResets[i].setAttribute('visible', false);
				};
			};
			break;
  	}
  }
});
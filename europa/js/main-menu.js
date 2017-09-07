AFRAME.registerComponent('main-menu', {
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

  	this.el.addEventListener('buttonup', this.onClick);
  },
  removeEventListeners: function() {
  	// console.log('removing event listeners');

  	this.el.removeEventListener('buttonup', this.onClick);
  },
 //  onMouseEnter: function (event) {
 //  	// console.log('a mouse enter event');

 //  	var button = this.el.getAttribute('id');

 //  	switch (button) {
 //  		case 'schedule':
 //  			this.el.setAttribute('material', {src: '#expandedMenu_schedule_highLighted'});
 //  			this.el.setAttribute('id', 'schedule_highLighted');
 //  			break;
	// 	case 'subMenu':
 //  			this.el.setAttribute('material', {src: '#expandedMenu_subMenu_highLighted'});
 //  			this.el.setAttribute('id', 'subMenu_highLighted');
 //  			break;
	// 	case 'playPause':
 //  			this.el.setAttribute('material', {src: '#expandedMenu_playPause_highLighted'});
 //  			this.el.setAttribute('id', 'playPause_highLighted');
 //  			break;
	// 	case 'pictureVideo':
 //  			this.el.setAttribute('material', {src: '#expandedMenu_pictureVideo_highLighted'});
 //  			this.el.setAttribute('id', 'pictureVideo_highLighted');
 //  			break;
	// 	case 'moreInfo':
 //  			this.el.setAttribute('material', {src: '#expandedMenu_moreInfo_highLighted'});
 //  			this.el.setAttribute('id', 'moreInfo_highLighted');
 //  			break;
 //  	}
 //  },
 //  onMouseLeave: function (event) {
 //  	// console.log('a mouse leave event');

 //  	var button = this.el.getAttribute('id');

	// switch (button) {
	// 	case 'schedule_highLighted':
	// 		this.el.setAttribute('material', {src: '#expandedMenu_schedule'});
	// 		this.el.setAttribute('id', 'schedule');
	// 		break;
	// 	case 'subMenu_highLighted':
	// 		this.el.setAttribute('material', {src: '#expandedMenu_subMenu'});
	// 		this.el.setAttribute('id', 'subMenu');
	// 		break;
	// 	case 'playPause_highLighted':
	// 		this.el.setAttribute('material', {src: '#expandedMenu_playPause'});
	// 		this.el.setAttribute('id', 'playPause');
	// 		break;
	// 	case 'pictureVideo_highLighted':
	// 		this.el.setAttribute('material', {src: '#expandedMenu_pictureVideo'});
	// 		this.el.setAttribute('id', 'pictureVideo');
	// 		break;
	// 	case 'moreInfo_highLighted':
	// 		this.el.setAttribute('material', {src: '#expandedMenu_moreInfo'});
	// 		this.el.setAttribute('id', 'moreInfo');
	// 		break;
 //  	}
 //  },
  onClick: function (event) {
  	// console.log('a mouse click event');

  	var button = this.el.getAttribute('id');

  	console.log(this.el);
  	  	console.log(document.querySelector('#expandedMenu').components);

  	switch (button) {
  		case 'mainMenuOverlayInactive':
  			document.querySelector('#mainMenuOverlayInactive').setAttribute('visible', true);
  			this.el.setAttribute('id', 'mainMenuOverlayActive');
  			break;
		  case 'mainMenuOverlayActive':
  			document.querySelector('#mainMenuOverlayActive').setAttribute('visible', false);
  			this.el.setAttribute('id', 'mainMenuOverlayInactive');
  			break;
  	}

  }
});
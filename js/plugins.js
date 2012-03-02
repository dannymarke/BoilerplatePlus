// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

/* UTILS CONTAINER
 * oggetto contenente le funzioni di utilità generale.
 * L'impiego del prefisso Utils definisce un name space che mi permette 
 * di evitare il conflitto tra i nomi delle mie funzioni con auelli di funzioni definite 
 * da terze parti
 */

/* ================================================================================================
 
 NOTA su MODERNIZR
 Boilerplate carica Modernizr e molte delle proprietà indagate e caricate in Utils potrebbero essere
 recuperate usandolo.
 Sito: http://www.modernizr.com
 Documentazione: http://www.modernizr.com/docs/

 Articolo/tutorial
 http://www.adobe.com/devnet/dreamweaver/articles/using-modernizr.html

 ==================================================================================================*/

var Utils = {
  IS_IPAD: (navigator.userAgent.match(/iPad/i) != null) ? true : false,
  IS_IPHONE_OR_IPOD: ((navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null)) ? true : false,
  IS_ANDROID: (navigator.userAgent.toLowerCase().indexOf("android") > -1) ? true : false,
  IS_OLDIE: jQuery('.oldie').size(),
  IS_IE: jQuery.browser.msie,
  CURRENT_DEVICE: undefined,
  CURRENT_ROTATION: 0,
  RE: {
    email : /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
    integer : /^[0-9]+$/,
    empty : /^$/,
    empty_or_blank : /^\s*$/
  }
};

Utils.init = function(options) {
	var defaults = {
		'deviceClass' : true, //add iPhone, iPad, Android class to body 
		'orientationClass' : true, //add landscape || portrait to body
		'externalLnk': true, //use class external for link _blank
		'emptyLnk': true, //automatic prevent default on link with href="#"
		'placeholder': true, //IE fallback for input placeholder attr	
	}
	
    this.options = jQuery.extend( {}, defaults, options) ;
    
	
	if(this.options.deviceClass) this.setDeviceClass();
	if(this.options.orientationClass) {
		this.detectOrientation();
		window.onorientationchange = this.detectOrientation;
	}	
	if(this.options.externalLnk) this.setExternalLink();
	if(this.options.emptyLnk) this.setEmptyLink();
	if(this.options.placeholder) this.setInputPlaceholder();
}


Utils.IS_HANDHELD = (Utils.IS_IPHONE_OR_IPOD || Utils.IS_IPAD || Utils.IS_ANDROID);

Utils.slug = function(_str){
  var _str = _str.replace(/^\s+|\s+$/g, ''); // trim
  _str = _str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    _str = _str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  _str = _str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return _str;
};


Utils.setDeviceClass = function() {
  if(Utils.IS_IPAD) Utils.CURRENT_DEVICE = 'iPad';
  if(Utils.IS_IPHONE_OR_IPOD) Utils.CURRENT_DEVICE = 'iPhone';
  if(Utils.IS_ANDROID) Utils.CURRENT_DEVICE = 'Android';
  if(Utils.IS_HANDHELD) jQuery('body').addClass(Utils.CURRENT_DEVICE);
};

Utils.detectOrientation = function() {
  if(Utils.IS_HANDHELD){
    Utils.CURRENT_ROTATION = ( window.orientation == 0 || window.orientation == 180 )?'portrait':'landscape';
    jQuery('body').removeClass('portrait').removeClass('landscape').addClass(Utils.CURRENT_ROTATION);
  }

};

Utils.setExternalLink = function() {
  /* links to open into a new tab or browser window */
  jQuery('a.external_link').attr('target','_blank');
};

Utils.setEmptyLink = function() {
  /* prevent page scrolling to top for links with href="#" and rel="nofollow" */
  jQuery('a[rel=nofollow][href=#]').bind('click',function(evt){
      evt.preventDefault();
  });

  /* prevent page scrolling to top for links with href="#" */
  jQuery('a[href=#]').bind('click',function(evt){
      evt.preventDefault();
  });
};

/* implemento un comportamento corretto per l'attributo placeholder anche per IE */
Utils.setInputPlaceholder = function() {
  jQuery('input[placeholder]').each(function(){
    var me = jQuery(this);
    me.addClass('placeholder');
    var ph = me.attr('placeholder');
  
    if (Utils.IS_IE){ me.attr('value',ph) }

    
    me.focus(function(){
      me.removeClass('wrong');
      me.removeClass('placeholder');
      if (Utils.IS_IE && (me.val() == ph)){ me.val('') }
    }).blur(function(){
      if (me.val() == '' || me.val() == ph) {
        if (Utils.IS_IE) { me.attr('value', ph) }
        me.addClass('placeholder');
        me.removeClass('wrong');
      }
    });
  
  });
};

/* leggo e restituisco il parametro in URL passato per argomento alla funzione. Se non è presente, restituisco 0 */
Utils.readUrlParams = function(param_name) {
  /*      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
   if (!results) { return 0; }
   return results[1] || 0;*/
  var map = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    map[key] = value;
  });
  if (param_name) {
    if (map[param_name]) {
      return map[param_name];
    } else {
      return false;
    }
  } else {
    return map;
  }
};


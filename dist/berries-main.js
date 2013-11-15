/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
!function(t,e,n){var i=t.B,o={};o.version="0.0.1","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.B=i,this},t.B=o,o.Util={extend:function(t){var e,n,i,o,s=Array.prototype.slice.call(arguments,1);for(n=0,i=s.length;i>n;n++){o=s[n]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var n=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,n||arguments)}},stamp:function(){var t=0,e="_berries_id";return function(n){return n[e]=n[e]||++t,n[e]}}(),invokeEach:function(t,e,n){var i,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(i in t)e.apply(n,[i,t[i]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,n){var i,o;return function s(){var r=arguments;return i?(o=!0,void 0):(i=!0,setTimeout(function(){i=!1,o&&(s.apply(n,r),o=!1)},e),t.apply(n,r),void 0)}},falseFn:function(){return!1},formatNum:function(t,e){var n=Math.pow(10,e||5);return Math.round(t*n)/n},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,n){var i=[];for(var o in t)i.push(encodeURIComponent(n?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+i.join("&")},compileTemplate:function(t,e){return t=t.replace(/\{ *([\w_]+) *\}/g,function(t,n){return'" + o["'+n+'"]'+("function"==typeof e[n]?"(o)":"")+' + "'}),new Function("o",'return "'+t+'";')},template:function(t,e){var n=o.Util._templateCache=o.Util._templateCache||{};return n[t]=n[t]||o.Util.compileTemplate(t,e),n[t](e)},arrayMerge:function(t,e){for(var n=+e.length,i=0,o=t.length;n>i;i++)t[o++]=e[i];return t.length=o,t},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},getBerriesPath:function(){var t,n,i,o,s,r=e.getElementsByTagName("script"),a=/[\/^]berries[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,n=r.length;n>t;t++)if(i=r[t].src,o=i.match(a))return s=i.split(a)[0],s?s+"/":""},getTexturePath:function(){return this.getBerriesPath()+"textures"},getObjPath:function(){return this.getBerriesPath()+"obj"},getDaePath:function(){return this.getBerriesPath()+"dae"},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},"undefined"!=typeof t&&!function(){function e(e){var n,i,o=["webkit","moz","o","ms"];for(n=0;n<o.length&&!i;n++)i=t[o[n]+e];return i}function n(e){var n=+new Date,o=Math.max(0,16-(n-i));return i=n+o,t.setTimeout(e,o)}var i=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||n,r=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,i,r,a){return e=o.bind(e,i),r&&s===n?(e(),void 0):s.call(t,e,a)},o.Util.cancelAnimFrame=function(e){e&&r.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},n=function(){};n.prototype=this.prototype;var i=new n;i.constructor=e,e.prototype=i;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[i].concat(t.includes)),delete t.includes),t.options&&i.options&&(t.options=o.extend({},i.options,t.options)),o.extend(i,t),i._initHooks=[];var r=this;return e.__super__=r.prototype,i.callInitHooks=function(){if(!this._initHooksCalled){r.prototype.callInitHooks&&r.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=i._initHooks.length;e>t;t++)i._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),n="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n)},function(){var i=!!t.ActiveXObject,s=i&&!t.XMLHttpRequest,r=i&&!e.querySelector,a=i&&!e.addEventListener,l=navigator.userAgent.toLowerCase(),h=-1!==l.indexOf("webkit"),c=-1!==l.indexOf("chrome"),u=-1!==l.indexOf("phantom"),d=-1!==l.indexOf("android"),m=-1!==l.search("android [23]"),g=typeof orientation!=n+"",f=t.navigator&&t.navigator.msPointerEnabled&&t.navigator.msMaxTouchPoints,p="devicePixelRatio"in t&&t.devicePixelRatio>1||"matchMedia"in t&&t.matchMedia("(min-resolution:144dpi)")&&t.matchMedia("(min-resolution:144dpi)").matches,_=e.documentElement,E=i&&"transition"in _.style,y="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix,v="MozPerspective"in _.style,w="OTransition"in _.style,T=!t.L_DISABLE_3D&&(E||y||v||w)&&!u,b=!t.L_NO_TOUCH&&!u&&function(){var t="ontouchstart";if(f||t in _)return!0;var n=e.createElement("div"),i=!1;return n.setAttribute?(n.setAttribute(t,"return;"),"function"==typeof n[t]&&(i=!0),n.removeAttribute(t),n=null,i):!1}();o.Browser={ie:i,ie6:s,ie7:r,ielt9:a,webkit:h,android:d,android23:m,chrome:c,ie3d:E,webkit3d:y,gecko3d:v,opera3d:w,any3d:T,mobile:g,mobileWebkit:g&&h,mobileWebkit3d:g&&y,mobileOpera:g&&t.opera,touch:b,msTouch:f,retina:p}}(),o.Worker={w:"undefined"==typeof t?self:new Worker("lib/js/berries/dist/berries-worker-src.js"),onMsgHandlers:{},addMsgHandler:function(t,e){o.Worker.onMsgHandlers[t]=e},sendMsg:function(t,e,n){e&&this.addMsgHandler(t.action,e),o.Worker.w.postMessage(t,n)}},o.Worker.w.onmessage=function(t){if("undefined"==typeof o.Worker.onMsgHandlers[t.data.action])throw new Error("Unknown action type recieved: "+t.data.action);o.Worker.onMsgHandlers[t.data.action](t)},o.Logger=o.Class.extend({_logFeedObj:null,options:{debug:!1,messageClasses:{debug:"logMessageDebug",info:"logMessageInfo",warn:"logMessageWarn",error:"logMessageError"},colors:{debug:"0000ff",info:"000000",warn:"ffaa00",error:"ff0000"},onMsg:null},initialize:function(t,n){n=o.setOptions(this,n),this._logFeedObj=o.DomUtil.get(t);var i=e.createElement("style");i.type="text/css",i.innerHTML="."+n.messageClasses.debug+" { color: "+n.colors.debug+"; }",i.innerHTML+="."+n.messageClasses.info+" { color: "+n.colors.info+"; }",i.innerHTML+="."+n.messageClasses.warn+" { color: "+n.colors.warn+"; }",i.innerHTML+="."+n.messageClasses.error+" { color: "+n.colors.error+"; }",e.getElementsByTagName("head")[0].appendChild(i),o.Worker.addMsgHandler("log",function(t){this.log(t.data.message,t.data.type),n.onMsg(t)}.bind(this))},log:function(t,n){var i=this.options;n||(n="info");var o=e.createElement("p");o.innerHTML=t,o.className=i.messageClasses[n],this._logFeedObj.appendChild(o),this._logFeedObj.scrollTop=this._logFeedObj.scrollHeight,console[n](t)},hide:function(){console.log(this._logFeedObj),this._logFeedObj.style.display="none"},show:function(){this._logFeedObj.style.display="display"}}),o.Premades={_definitions:[{id:"fireHydrant",url:o.Util.getDaePath()+"/fire_hydrant_red.dae"}],load:function(e){var n=0,i=new THREE.ColladaLoader;i.options.convertUpAxis=!0,i.options.upAxis="Z",i.onProgress=function(t,n,i){e.log(t,n,i)};var s=function(t){o.Premades[a.id]=t.scene,n++};e.log("Loading pre-made models");for(var r in o.Premades._definitions){var a=o.Premades._definitions[r];o.Options.render[a.id+"s"]?(e.log("Loading "+a.id),i.load(a.url,s)):n++}var l=t.setInterval(function(){n===o.Premades._definitions.length&&(e.log("Finished loading premade models"),clearInterval(l))},500)}},o.Materials={MATERIALS:[],addMaterial:function(t,e){if(!t.match(/^[A-Z0-9]+$/))throw new Error("Material name does not match regex. Must be all uppercase alpha-numerical characters");if("undefined"!=typeof this[t])throw new Error("Material with name already exists. Use update instead.");this.MATERIALS.push(e),this[t]=this.MATERIALS.length-1},updateMaterial:function(t,e){if("undefined"==typeof this[t])throw new Error("Material does not exist yet. Cannot update.");var n=this[t];this.MATERIALS[n]=e},getMaterial:function(t){return o.Materials.MATERIALS[this[t]]}},o.Materials.addMaterial("BRICKRED",new THREE.MeshPhongMaterial({color:8658727,side:THREE.DoubleSide})),o.Materials.addMaterial("CONCRETEWHITE",new THREE.MeshPhongMaterial({color:15921906,side:THREE.DoubleSide})),o.Materials.addMaterial("GLASSBLUE",new THREE.MeshPhongMaterial({color:40413,side:THREE.DoubleSide})),o.Materials.addMaterial("ASPHALTGREY",new THREE.MeshPhongMaterial({color:7697781,side:THREE.DoubleSide})),o.Materials.addMaterial("WOODBROWN",new THREE.MeshPhongMaterial({color:11439968,side:THREE.DoubleSide})),o.Point=function(t,e,n){this.x=n?Math.round(t):t,this.y=n?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,n=t.y-this.y;return Math.sqrt(e*e+n*n)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,i){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===n||null===t?t:new o.Point(t,e,i)},o.Transformation=function(t,e,n,i){this._a=t,this._b=e,this._c=n,this._d=i},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,n){var i=t.style[n];if(!i&&t.currentStyle&&(i=t.currentStyle[n]),(!i||"auto"===i)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);i=o?o[n]:null}return"auto"===i?null:i},getViewportOffset:function(t){var n,i=0,s=0,r=t,a=e.body,l=e.documentElement,h=o.Browser.ie7;do{if(i+=r.offsetTop||0,s+=r.offsetBeft||0,i+=parseInt(o.DomUtil.getStyle(r,"borderTopWidth"),10)||0,s+=parseInt(o.DomUtil.getStyle(r,"borderLeftWidth"),10)||0,n=o.DomUtil.getStyle(r,"position"),r.offsetParent===a&&"absolute"===n)break;if("fixed"===n){i+=a.scrollTop||l.scrollTop||0,s+=a.scrollLeft||l.scrollLeft||0;break}if("relative"===n&&!r.offsetLeft){var c=o.DomUtil.getStyle(r,"width"),u=o.DomUtil.getStyle(r,"max-width"),d=r.getBoundingClientRect();("none"!==c||"none"!==u)&&(s+=d.left+r.clientLeft),i+=d.top+(a.scrollTop||l.scrollTop||0);break}r=r.offsetParent}while(r);r=t;do{if(r===a)break;i-=r.scrollTop||0,s-=r.scrollLeft||0,o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!h||(s+=r.scrollWidth-r.clientWidth,h&&"hidden"!==o.DomUtil.getStyle(r,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(r,"overflow")&&(s+=17)),r=r.parentNode}while(r);return new o.Point(s,i)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,n,i){var o=e.createElement(t);return o.className=n,i&&i.appendChild(o),o},hasClass:function(t,e){return t.className.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(t.className)},addClass:function(t,e){o.DomUtil.hasClass(t,e)||(t.className+=(t.className?" ":"")+e)},removeClass:function(t,e){t.className=o.Util.trim((" "+t.className+" ").replace(" "+e+" "," "))},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var n=!1,i="DXImageTransform.Microsoft.Alpha";try{n=t.filters.item(i)}catch(o){if(1===e)return}e=Math.round(100*e),n?(n.Enabled=100!==e,n.Opacity=e):t.style.filter+=" progid:"+i+"(opacity="+e+")"}},testProp:function(t){for(var n=e.documentElement.style,i=0;i<t.length;i++)if(t[i]in n)return t[i];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,n="translate"+(e?"3d":"")+"(",i=(e?",0":"")+")";return n+t.x+"px,"+t.y+"px"+i},getScaleString:function(t,e){var n=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),i=" scale("+t+") ";return n+i},setPosition:function(t,e,n){t._leaflet_pos=e,!n&&o.Browser.any3d?(t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden")):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){var n=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault),n){var i=e.documentElement.style;this._userSelect=i[n],i[n]="none"}},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault),n&&(e.documentElement.style[n]=this._userSelect,delete this._userSelect)},disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.DomEvent={addListener:function(t,e,n,i){var s,r,a,l=o.stamp(n),h="_berries_"+e+l;return t[h]?this:(s=function(e){return n.call(i||t,e||o.DomEvent._getEvent())},o.Browser.msTouch&&0===e.indexOf("touch")?this.addMsTouchListener(t,e,s,l):(o.Browser.touch&&"dblclick"===e&&this.addDoubleTapListener&&this.addDoubleTapListener(t,s,l),"addEventListener"in t?"mousewheel"===e?(t.addEventListener("DOMMouseScroll",s,!1),t.addEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?(r=s,a="mouseenter"===e?"mouseover":"mouseout",s=function(e){return o.DomEvent._checkMouse(t,e)?r(e):void 0},t.addEventListener(a,s,!1)):"click"===e&&o.Browser.android?(r=s,s=function(t){return o.DomEvent._filterClick(t,r)},t.addEventListener(e,s,!1)):t.addEventListener(e,s,!1):"attachEvent"in t&&t.attachEvent("on"+e,s),t[h]=s,this))},removeListener:function(t,e,n){var i=o.stamp(n),s="_berries_"+e+i,r=t[s];return r?(o.Browser.msTouch&&0===e.indexOf("touch")?this.removeMsTouchListener(t,e,i):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,i):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",r,!1),t.removeEventListener(e,r,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",r,!1):t.removeEventListener(e,r,!1):"detachEvent"in t&&t.detachEvent("on"+e,r),t[s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableClickPropagation:function(t){for(var e=o.DomEvent.stopPropagation,n=o.Draggable.START.length-1;n>=0;n--)o.DomEvent.addListener(t,o.Draggable.START[n],e);return o.DomEvent.addListener(t,"click",o.DomEvent._fakeStop).addListener(t,"dblclick",e)},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,n){var i=o.Browser.ie7,s=e.body,r=e.documentElement,a=t.pageX?t.pageX-s.scrollLeft-r.scrollLeft:t.clientX,l=t.pageY?t.pageY-s.scrollTop-r.scrollTop:t.clientY,h=new o.Point(a,l);if(!n)return h;var c=n.getBoundingClientRect(),u=c.left-n.clientLeft,d=c.top-n.clientTop;return o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!i||(u+=n.scrollWidth-n.clientWidth,i&&"hidden"!==o.DomUtil.getStyle(n,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(n,"overflow")&&(u+=17)),h._subtract(new o.Point(u,d))},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var n=e.relatedTarget;if(!n)return!0;try{for(;n&&n!==t;)n=n.parentNode}catch(i){return!1}return n!==t},_getEvent:function(){var e=t.event;if(!e)for(var n=arguments.callee.caller;n&&(e=n.arguments[0],!e||t.Event!==e.constructor);)n=n.caller;return e},_filterClick:function(t,e){var n=t.timeStamp||t.originalEvent.timeStamp,i=o.DomEvent._lastClick&&n-o.DomEvent._lastClick;return i&&i>100&&1e3>i||t.target._simulatedClick&&!t._simulated?(o.DomEvent.stop(t),void 0):(o.DomEvent._lastClick=n,e(t))}},o.DomEvent.on=o.DomEvent.addListener,o.DomEvent.off=o.DomEvent.removeListener,o.LatLng=function(t,e){var n=parseFloat(t),i=parseFloat(e);if(isNaN(n)||isNaN(i))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=n,this.lng=i},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,n=o.LatLng.DEG_TO_RAD,i=(t.lat-this.lat)*n,s=(t.lng-this.lng)*n,r=this.lat*n,a=t.lat*n,l=Math.sin(i/2),h=Math.sin(s/2),c=l*l+h*h*Math.cos(r)*Math.cos(a);return 2*e*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))},wrap:function(t,e){var n=this.lng;return t=t||-180,e=e||180,n=(n+e)%(e-t)+(t>n||n===e?e:t),new o.LatLng(this.lat,n)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?new o.LatLng(t[0],t[1]):t===n||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var n=e?[t,e]:t,i=0,o=n.length;o>i;i++)this.extend(n[i])},o.LatLngBounds.prototype={extend:function(t){return t?(t="number"==typeof t[0]||"string"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this):this},pad:function(t){var e=this._southWest,n=this._northEast,i=Math.abs(e.lat-n.lat)*t,s=Math.abs(e.lng-n.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-i,e.lng-s),new o.LatLng(n.lat+i,n.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,n,i=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),n=t.getNorthEast()):e=n=t,e.lat>=i.lat&&n.lat<=s.lat&&e.lng>=i.lng&&n.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,n=this._northEast,i=t.getSouthWest(),s=t.getNorthEast(),r=s.lat>=e.lat&&i.lat<=n.lat,a=s.lng>=e.lng&&i.lng<=n.lng;return r&&a},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var e=o.LatLng.DEG_TO_RAD,n=this.MAX_LATITUDE,i=Math.max(Math.min(n,t.lat),-n),s=t.lng*e,r=i*e;return r=Math.log(Math.tan(Math.PI/4+r/2)),new o.Point(s,r)},unproject:function(t){var e=o.LatLng.RAD_TO_DEG,n=t.x*e,i=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*e;return new o.LatLng(i,n)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,e){var n=this.projection.project(t),i=this.scale(e);return this.transformation._transform(n,i)},pointToLatLng:function(t,e){var n=this.scale(e),i=this.transformation.untransform(t,n);return this.projection.unproject(i)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var e=this.projection.project(t),n=6378137;return e.multiplyBy(n)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.DefaultControl=o.Class.extend({_enabled:!0,_camera:{},_domElement:e,_STATE:{NONE:-1,ZOOMUP:0,ZOOMDOWN:1,ZOOMINMAX:2,ZOOMOUTMAX:3,PANNORTH:4,PANSOUTH:5,PANEAST:6,PANWEST:7,PITCHUP:8,PITCHDOWN:9,ROTATECW:10,ROTATECCW:11},_state:-1,_prevState:-1,options:{minCamHeight:0,maxCamHeight:1/0,keys:[33,34,35,36,38,40,39,37,38,40,39,37],zoomIncrement:50,panIncrement:100,pitchIncrement:.1,maxZoomInHeight:1600,maxZoomOutHeight:5e4},initialize:function(e,i){this._camera=e,i!==n&&(this._domElement=i),o.DomEvent.on(this._domElement,"contextmenu",o.DomEvent.preventDefault,this),o.DomEvent.on(this._domElement,"mousedown",this._mousedown,this),o.DomEvent.on(this._domElement,"mousewheel",this._mousewheel,this),o.DomEvent.on(this._domElement,"DOMMouseScroll",this._mousewheel,this),o.DomEvent.on(t,"keydown",this._keydown,this),o.DomEvent.on(t,"keyup",this._keyup,this),o.DomEvent.on(this._domElement,"touchstart",this._touchstart,this),o.DomEvent.on(this._domElement,"touchend",this._touchend,this),o.DomEvent.on(this._domElement,"touchmove",this._touchmove,this)},zoomup:function(){this._camera.position.z+=this.options.zoomIncrement,this._camera.position.z>this.options.maxZoomOutHeight&&(this._camera.position.z=this.options.maxZoomOutHeight)},zoomdown:function(){this._camera.position.z-=this.options.zoomIncrement,this._camera.position.z<this.options.maxZoomInHeight&&(this._camera.position.z=this.options.maxZoomInHeight)},zoominmax:function(){this._camera.position.z=this.options.maxZoomInHeight},zoomoutmax:function(){this._camera.position.z=this.options.maxZoomOutHeight},pannorth:function(){this._camera.position.y+=this.options.panIncrement},pansouth:function(){this._camera.position.y-=this.options.panIncrement},paneast:function(){this._camera.position.x+=this.options.panIncrement},panwest:function(){this._camera.position.x-=this.options.panIncrement},pitchup:function(){this._camera.rotation.x+=this.options.pitchIncrement},pitchdown:function(){this._camera.rotation.x-=this.options.pitchIncrement},rotatecw:function(){},rotateccw:function(){},_keydown:function(t){if(this._enabled!==!1&&(this._prevState=this._state,this._state===this._STATE.NONE))if(t.ctrlKey===!0)switch(t.keyCode){case this.options.keys[this._STATE.PITCHUP]:this.pitchup();break;case this.options.keys[this._STATE.PITCHDOWN]:this.pitchdown();break;case this.options.keys[this._STATE.ROTATECW]:this.rotatecw();break;case this.options.keys[this._STATE.ROTATECCW]:this.rotateccw()}else switch(t.keyCode){case this.options.keys[this._STATE.ZOOMUP]:this.zoomup();break;case this.options.keys[this._STATE.ZOOMDOWN]:this.zoomdown();break;case this.options.keys[this._STATE.ZOOMINMAX]:this.zoominmax();break;case this.options.keys[this._STATE.ZOOMOUTMAX]:this.zoomoutmax();break;case this.options.keys[this._STATE.PANNORTH]:this.pannorth();break;case this.options.keys[this._STATE.PANSOUTH]:this.pansouth();break;case this.options.keys[this._STATE.PANEAST]:this.paneast();break;case this.options.keys[this._STATE.PANWEST]:this.panwest();break;default:return}},_keyup:function(){this._enabled!==!1&&(this._state=this._prevState)},_mousedown:function(t){this._enabled!==!1&&console.log(t)},_mousewheel:function(t){this._enabled!==!1&&console.log(t)},_touchstart:function(t){this._enabled!==!1&&console.log(t)},_touchend:function(t){this._enabled!==!1&&console.log(t)},_touchmove:function(t){this._enabled!==!1&&console.log(t)}}),o.Model=o.Class.extend({_clock:new THREE.Clock,_loadManager:null,_camera:null,_origin:null,_logger:null,options:{logContainer:e.body,logOptions:{},threeJS:null,initialCameraPos:new o.LatLng(39.97,-105.26),initialCameraLook:new o.LatLng(40,-105.26),bounds:null,srtmDataSource:null,osmDataSource:null,render:{buildings:!0,fireHydrants:!0,roads:!0},modelContainer:e.body,texturePath:null},initialize:function(t){t=o.setOptions(this,t);var e=this._logger=new o.Logger(t.logContainer,t.logOptions);e.log("Logger initialized"),this._initContainer(t.modelContainer),e.log("Initializing core THREE.js components"),this._initThree(),e.log("Initializing camera"),this._initCamera(),e.log("Adding sunlight");var n=new o.Light;n._light.position=new THREE.Vector3(0,0,0),n._light.target.position=new THREE.Vector3(-100,100,-100),this._camera.add(n._light),this._scene.add(this._camera),o.Worker.sendMsg({action:"loadLibrary",url:t.threeJS});var i=this;return o.Worker.sendMsg({action:"generateTerrain",srtmDataSource:t.srtmDataSource,options:{numVertsX:200,numVertsY:400,bounds:[t.bounds._southWest,t.bounds._northEast]}},function(n){var s=new o.Terrain(n.data.geometryParts,t.bounds.getSouthWest());e.log("Adding terrain to the model"),i.addTerrain(s),e.hide(),i._startAnimation()}),this},objMsgHandler:function(t){console.log(t)},addTerrain:function(t){this._terrain=t,this._origin=t._origin;var e=t._latlon2meters(this.options.initialCameraPos);this._camera.position=new THREE.Vector3(e.x,e.y,3e3),e=t._latlon2meters(this.options.initialCameraLook),this._camera.lookAt(new THREE.Vector3(e.x,e.y,1640)),this._scene.add(t._mesh)},getTerrain:function(){return this._terrain},addObject:function(t){return this._scene.add(t),this},_addAxis:function(t,e,n){var i=new THREE.Vector3,o=new THREE.Vector3;switch(t){case"x":i.set(-e,0,0),o.set(e,0,0);break;case"y":i.set(0,-e,0),o.set(0,e,0);break;case"z":i.set(0,0,-e),o.set(0,0,e)}var s,r=new THREE.Geometry,a=new THREE.LineBasicMaterial({color:n,lineWidth:1});r.vertices.push(i,o),s=new THREE.Line(r,a),this._scene.add(s)},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Model container not found.");if(e._berries)throw new Error("Model container is already initialized.");e._berries=!0},_initThree:function(){this._scene=this._scene=new THREE.Scene,this._renderer=new THREE.WebGLRenderer,this._renderer.setSize(t.innerWidth,t.innerHeight),this._renderer.gammaInput=!0,this._renderer.gammaOutput=!0,this._renderer.shadowMapEnabled=!0,this._renderer.shadowMapSoft=!0,this._container.innerHTML="",this._container.appendChild(this._renderer.domElement)},_initCamera:function(){var e=this._camera=new THREE.PerspectiveCamera(60,t.innerWidth/t.innerHeight,10,5e5);e.up.set(0,0,1),this._controls=new o.DefaultControl(e)},_initLoadManager:function(){},_render:function(){this._renderer.render(this._scene,this._camera)},_startAnimation:function(){var e=this;console.log(e._scene);var n=function(){t.requestAnimationFrame(n),e._renderer.render(e._scene,e._camera)};n()}}),o.model=function(t,e){if(!THREE)throw new Error("three.js is not detected. Berries required three.js");return new o.Model(t,e)},o.Terrain=o.Class.extend({options:{},initialize:function(t,e,n){return n=o.setOptions(this,n),this._geometry=new THREE.PlaneGeometry(t.width,t.height,t.numVertsX-1,t.numVertsY-1),this._geometry.vertices=t.vertices,this._geometry.faces=t.faces,this._numVertsX=t.numVertsX,this._numVertsY=t.numVertsY,this._gridSpaceX=t.gridSpaceX,this._gridSpaceY=t.gridSpaceY,this._origin=e,this._createMesh(),this},heightAt:function(t,e,n){var i=new THREE.Vector3;if(!this._bounds.contains([t,e]))return console.error("Coordinates outside of bounds"),0;n||(n=this._latlon2meters(t,e)),i.x=n.x,i.y=n.y;var o=Math.floor(i.x/this._gridSpaceX),s=this._numVertsY-2-Math.floor(i.y/this._gridSpaceY),r=this._numVertsX*s+o,a=r+1,l=r+this._numVertsX,h=l+1,c=this._copyVertexByValue(this._geometry.vertices[r]),u=this._copyVertexByValue(this._geometry.vertices[a]),d=this._copyVertexByValue(this._geometry.vertices[h]),m=this._copyVertexByValue(this._geometry.vertices[l]);c.x+=this._mesh.position.x,u.x+=this._mesh.position.x,d.x+=this._mesh.position.x,m.x+=this._mesh.position.x,c.y+=this._mesh.position.y,u.y+=this._mesh.position.y,d.y+=this._mesh.position.y,m.y+=this._mesh.position.y;var g=i.x/this._gridSpaceX-Math.floor(i.x/this._gridSpaceX),f=i.y/this._gridSpaceY-Math.floor(i.y/this._gridSpaceY),p=this._lerp;return i.z=p(p(c.z,d.z,(1+g-f)/2),g>1-f?u.z:d.z,Math.abs(1-g-f)),i.z},_copyVertexByValue:function(t){return new THREE.Vector3(t.x,t.y,t.z)},_lerp:function(t,e,n){return t+(e-t)*n},worldVector:function(t,e){var n=this._latlon2meters(t,e),i=this.heightAt(t,e,n);return new THREE.Vector3(n.x,n.y,i)},addTo:function(t){return t.addTerrain(this),this},_createMesh:function(){var t=THREE.ImageUtils.loadTexture(o.Util.getTexturePath()+"/seamless-grass.jpg"),e=50,n=50;t.wrapS=t.wrapT=THREE.RepeatWrapping,t.repeat.set(Math.round(this._dataDepthInMeters/n),Math.round(this._dataWidthInMeters/e)),this._mesh=new THREE.Mesh(this._geometry,new THREE.MeshPhongMaterial({map:t})),this._mesh.castShadow=!0,this._mesh.receiveShadow=!0,this._mesh.translateX(this._geometry.width/2),this._mesh.translateY(this._geometry.height/2)},_latlon2meters:function(t,e){var n=o.latLng(t,e);return{x:this._origin.distanceTo([this._origin.lat,n.lng]),y:this._origin.distanceTo([n.lat,this._origin.lng]),straightLine:n.distanceTo(this._origin)}}}),o.Light=o.Class.extend({_position:null,_light:null,options:{},initialize:function(t){t=o.setOptions(this,t);var e=this._light=new THREE.DirectionalLight(16777215,1);e.castShadow=!0,e.shadowCameraVisible=!0,e.shadowMapWidth=4096,e.shadowMapHeight=4096;var n=500;return e.shadowCameraLeft=-n,e.shadowCameraRight=n,e.shadowCameraTop=n,e.shadowCameraBottom=-n,e.shadowCameraFar=1e3,e.shadowCameraNear=-100,e.shadowBias=.001,e.shadowDarkness=.5,this},addTo:function(t){return t.addObject(this._light),this}}),o.light=function(t,e){return new o.Light(t,e)},o.Road=o.Class.extend({_osmDC:null,_way:null,_geometry:null,options:{lanes:2,laneWidth:3.5},initialize:function(t,e,n,i){i=o.setOptions(this,i),this._way=t,this._osmDC=e;
var s=this.options.lanes*this.options.laneWidth;if(this._way.tags){var r=this._way.tags;if(r.width)s=r.width;else{var a=this.options.lanes;if(r.lanes)a=r.lanes;else if(r.highway)switch(r.highway){case"motorway":case"trunk":case"primary":case"secondary":a=4;break;case"tertiary":case"residential":a=2;break;case"service":case"track":a=1}var l=this.options.laneWidth;s=a*l}}var h=.25,c=[new THREE.Vector2(-s/2,0),new THREE.Vector2(-s/2,h),new THREE.Vector2(s/2,h),new THREE.Vector2(s/2,0)],u=new THREE.Shape(c),d=[];for(var m in this._way.nodes){m=Number(m);var g=this._way.nodes[m],f=this._osmDC.getNode(g),p=Number(f.lat),_=Number(f.lon),E=n.getTerrain().worldVector(p,_);E.z+=h,d.push(E)}var y;d[0].equals(d[d.length-1])?(d.pop(),y=new THREE.ClosedSplineCurve3(d)):y=new THREE.SplineCurve3(d);var v=d.length,w={tangents:[],normals:[],binormals:[]},T=new THREE.Vector3(1,0,0);for(m=0;v+1>m;m++){var b=m/v,M=y.getTangentAt(b).normalize();w.tangents[m]=M,w.normals[m]=T,w.binormals[m]=M.clone().cross(T)}this._geometry=new THREE.ExtrudeGeometry(u,{extrudePath:y,steps:v,frames:w,closed:!0})}}),o.road=function(t,e){return new o.Road(t,e)},o.Building=o.Class.extend({_way:{},_osmDC:null,_geometry:null,options:{levels:2,levelHeight:3.048,wallMaterial:o.Materials.CONCRETEWHITE},initialize:function(t,e,n,i){i=o.setOptions(this,i),this._way=t,this._osmDC=e;var s=this._getOutlinePoints(this._way.nodes,this._osmDC,n);return this._geometry=this._generateGeometry(s,this._way),this},_generateGeometry:function(t,e){var n,i,s=this._geometry=new THREE.Geometry,r=this._getHeight(e.tags),a=t[0].z;for(n in t)t[n].z<a&&(a=t[n].z);var l=a+r,h=THREE.Shape.Utils.isClockWise(t);h||t.reverse();var c=this._getWallMaterialIndex(e.tags),u=[];for(i in t){i=Number(i);var d=t[i],m=i!==t.length-1?i+1:0,g=t[m],f=new THREE.Geometry;f.vertices.push(new THREE.Vector3(d.x,d.y,a)),f.vertices.push(new THREE.Vector3(g.x,g.y,a)),f.vertices.push(new THREE.Vector3(g.x,g.y,l)),f.vertices.push(new THREE.Vector3(d.x,d.y,l)),f.faces.push(new THREE.Face3(2,1,0,null,null,c)),f.faces.push(new THREE.Face3(3,2,0,null,null,c)),THREE.GeometryUtils.merge(s,f),u.push(new THREE.Vector2(d.x,d.y))}var p=new THREE.Geometry,_=new THREE.Shape(u),E=_.extractPoints(),y=THREE.Shape.Utils.triangulateShape(E.shape,E.holes);for(n in E.shape){var v=E.shape[n];p.vertices.push(new THREE.Vector3(v.x,v.y,l))}for(n in y)p.faces.push(new THREE.Face3(y[n][0],y[n][1],y[n][2],null,null,o.Materials.ASPHALTGREY));return p.computeFaceNormals(),THREE.GeometryUtils.merge(s,p),s.computeFaceNormals(),s},_getOutlinePoints:function(t,e,n){var i,o,s,r,a=[];for(r in t){var l=t[r],h=e.getNode(l);o=Number(h.lat),s=Number(h.lon),i=n.getTerrain().worldVector(o,s),a.push(i)}return a},_getHeight:function(t){var e=this.options.levels*this.options.levelHeight;if(t)if(t.height)e=t.height;else{var n=this.options.levels;if(t["building:levels"])n=t["building:levels"];else if(t.building)switch(t.building){case"house":case"garage":case"roof":case"hut":n=1;break;case"school":n=2;break;case"apartments":case"office":n=3;break;case"hospital":n=4;break;case"hotel":n=10}var i=this.options.levelHeight;e=n*i}return e},_getWallMaterialIndex:function(t){var e;switch(t["building:material"]){case"glass":e=o.Materials.GLASSBLUE;break;case"wood":e=o.Materials.WOODBROWN;break;case"brick":e=o.Materials.BRICKRED;break;case"concrete":e=o.Materials.CONCRETEWHITE;break;default:e=this.options.wallMaterial}return e}}),o.building=function(t,e){return new o.Building(t,e)},o.FireHydrant=o.Class.extend({_node:null,options:{},initialize:function(t,e){return e=o.setOptions(this,e),this._node=t,this},addTo:function(t){var e=this._node,n=Number(e.lat),i=Number(e.lon),s=t.getTerrain().worldVector(n,i),r=o.Premades.fireHydrant.clone();r.position=s,t.addObject(r)}}),o.firehydrant=function(t,e){return new o.Building(t,e)},o.ObjectSet=o.Class.extend({_objects:[],options:{},initialize:function(t,e){e=o.setOptions(this,e),this._objects=[]},addObject:function(t){this._objects.push(t)},getMergedGeometries:function(){var t=new THREE.Geometry;for(var e in this._objects)THREE.GeometryUtils.merge(t,this._objects[e]._geometry);return t}}),o.objectset=function(t,e){return new o.ObjectSet(t,e)},o.RoadSet=o.ObjectSet.extend({addTo:function(t){var e=this.getMergedGeometries(),n=new THREE.Mesh(e,new THREE.MeshBasicMaterial({color:9802643}));n.receiveShadow=!0,console.log(n),t.addObject(n)}}),o.roadset=function(t,e){return new o.RoadSet(t,e)},o.BuildingSet=o.ObjectSet.extend({addTo:function(t){var e=this.getMergedGeometries(),n=new THREE.Mesh(e,new THREE.MeshFaceMaterial(o.Materials.MATERIALS));n.castShadow=!0,n.receiveShadow=!0,t.addObject(n)}}),o.buildingset=function(t,e){return new o.BuildingSet(t,e)},o.OSMDataContainer=o.Class.extend({_nodes:[],_ways:[],_relations:[],options:{},initialize:function(t,e){return e=o.setOptions(this,e),this.addData(t),this},addTo:function(t,e){for(var n in o.Options.render)if(o.Options.render[n]!==!1){var i,s;switch(n){case"roads":e.log("Adding roads");var r=this.get("roads"),a=new o.roadset;for(var l in r)i=r[l],a.addObject(new o.Road(i,this,t));a.addTo(t);break;case"buildings":e.log("Adding buildings");var h=this.get("buildings"),c=new o.buildingset;for(var u in h)i=h[u],c.addObject(new o.Building(i,this,t));c.addTo(t);break;case"fireHydrants":e.log("Adding fireHydrants");var d=this.get("fire_hydrants");for(var m in d)s=d[m],new o.FireHydrant(s).addTo(t)}}},addData:function(t){if(this._data)o.Util.arrayMerge(this._nodes,t.nodes),o.Util.arrayMerge(this._ways,t.ways),o.Util.arrayMerge(this._relations,t.relations);else{this._nodes=t.nodes,this._ways=t.ways,this._relations=t.relations;for(var e in this._ways)this._ways[e].nodes.length<2&&(delete this._ways[e],console.warn("Way "+e+" is a bug. It only has one node. Consider deleting it from OSM."))}},get:function(t){var e,n,i,o,s=[];switch(t){case"roads":var r=["motorway","motorway_link","trunk","trunk_link","primary","primary_link","secondary","secondary_link","tertiary","tertiary_link","residential","unclassified","service","track"];for(e in this._ways)n=this._ways[e],n.tags&&r.indexOf(n.tags.highway)>-1&&s.push(n);break;case"buildings":for(e in this._ways)if(n=this._ways[e],n.tags){var a=n.tags.building;a&&"no"!==a&&s.push(n)}break;case"fire_hydrants":for(i in this._nodes)if(o=this._nodes[i],o.tags){var l=o.tags.emergency;l&&"fire_hydrant"===l&&s.push(o)}}return s},getNode:function(t){return this._nodes[t]},getWay:function(t){return this._ways[t]},getRelation:function(t){return this._relations[t]}}),o.osmdata=function(t,e){return new o.OSMDataContainer(t,e)}}(window,document);
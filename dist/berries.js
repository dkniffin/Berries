/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
!function(t,e,n){var i=t.B,o={};o.version="0.0.1","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.B=i,this},t.B=o,o.Util={extend:function(t){var e,n,i,o,s=Array.prototype.slice.call(arguments,1);for(n=0,i=s.length;i>n;n++){o=s[n]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var n=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,n||arguments)}},stamp:function(){var t=0,e="_berries_id";return function(n){return n[e]=n[e]||++t,n[e]}}(),invokeEach:function(t,e,n){var i,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(i in t)e.apply(n,[i,t[i]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,n){var i,o;return function s(){var r=arguments;return i?(o=!0,void 0):(i=!0,setTimeout(function(){i=!1,o&&(s.apply(n,r),o=!1)},e),t.apply(n,r),void 0)}},falseFn:function(){return!1},formatNum:function(t,e){var n=Math.pow(10,e||5);return Math.round(t*n)/n},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,n){var i=[];for(var o in t)i.push(encodeURIComponent(n?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+i.join("&")},compileTemplate:function(t,e){return t=t.replace(/\{ *([\w_]+) *\}/g,function(t,n){return'" + o["'+n+'"]'+("function"==typeof e[n]?"(o)":"")+' + "'}),new Function("o",'return "'+t+'";')},template:function(t,e){var n=o.Util._templateCache=o.Util._templateCache||{};return n[t]=n[t]||o.Util.compileTemplate(t,e),n[t](e)},arrayMerge:function(t,e){for(var n=+e.length,i=0,o=t.length;n>i;i++)t[o++]=e[i];return t.length=o,t},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},getTexturePath:function(){var t,n,i,o,s,r=e.getElementsByTagName("script"),a=/[\/^]berries[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,n=r.length;n>t;t++)if(i=r[t].src,o=i.match(a))return s=i.split(a)[0],(s?s+"/":"")+"textures"},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){var n,i,o=["webkit","moz","o","ms"];for(n=0;n<o.length&&!i;n++)i=t[o[n]+e];return i}function n(e){var n=+new Date,o=Math.max(0,16-(n-i));return i=n+o,t.setTimeout(e,o)}var i=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||n,r=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,i,r,a){return e=o.bind(e,i),r&&s===n?(e(),void 0):s.call(t,e,a)},o.Util.cancelAnimFrame=function(e){e&&r.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},n=function(){};n.prototype=this.prototype;var i=new n;i.constructor=e,e.prototype=i;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[i].concat(t.includes)),delete t.includes),t.options&&i.options&&(t.options=o.extend({},i.options,t.options)),o.extend(i,t),i._initHooks=[];var r=this;return e.__super__=r.prototype,i.callInitHooks=function(){if(!this._initHooksCalled){r.prototype.callInitHooks&&r.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=i._initHooks.length;e>t;t++)i._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),n="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n)},function(){var i=!!t.ActiveXObject,s=i&&!t.XMLHttpRequest,r=i&&!e.querySelector,a=i&&!e.addEventListener,h=navigator.userAgent.toLowerCase(),l=-1!==h.indexOf("webkit"),u=-1!==h.indexOf("chrome"),c=-1!==h.indexOf("phantom"),d=-1!==h.indexOf("android"),f=-1!==h.search("android [23]"),m=typeof orientation!=n+"",p=t.navigator&&t.navigator.msPointerEnabled&&t.navigator.msMaxTouchPoints,_="devicePixelRatio"in t&&t.devicePixelRatio>1||"matchMedia"in t&&t.matchMedia("(min-resolution:144dpi)")&&t.matchMedia("(min-resolution:144dpi)").matches,g=e.documentElement,y=i&&"transition"in g.style,v="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix,E="MozPerspective"in g.style,T="OTransition"in g.style,w=!t.L_DISABLE_3D&&(y||v||E||T)&&!c,L=!t.L_NO_TOUCH&&!c&&function(){var t="ontouchstart";if(p||t in g)return!0;var n=e.createElement("div"),i=!1;return n.setAttribute?(n.setAttribute(t,"return;"),"function"==typeof n[t]&&(i=!0),n.removeAttribute(t),n=null,i):!1}();o.Browser={ie:i,ie6:s,ie7:r,ielt9:a,webkit:l,android:d,android23:f,chrome:u,ie3d:y,webkit3d:v,gecko3d:E,opera3d:T,any3d:w,mobile:m,mobileWebkit:m&&l,mobileWebkit3d:m&&v,mobileOpera:m&&t.opera,touch:L,msTouch:p,retina:_}}(),o.Logger=o.Class.extend({_logFeedObj:null,options:{debug:!1,messageClasses:{debug:"logMessageDebug",info:"logMessageInfo",warn:"logMessageWarn",error:"logMessageError"},colors:{debug:"0000ff",info:"000000",warn:"ffaa00",error:"ff0000"}},initialize:function(t,n){n=o.setOptions(this,n),this._logFeedObj=o.DomUtil.get(t);var i=e.createElement("style");i.type="text/css",i.innerHTML="."+n.messageClasses.debug+" { color: "+n.colors.debug+"; }",i.innerHTML+="."+n.messageClasses.info+" { color: "+n.colors.info+"; }",i.innerHTML+="."+n.messageClasses.warn+" { color: "+n.colors.warn+"; }",i.innerHTML+="."+n.messageClasses.error+" { color: "+n.colors.error+"; }",e.getElementsByTagName("head")[0].appendChild(i)},log:function(t,n){var i=this.options;n||(n="info");var o=e.createElement("p");o.innerHTML=t,o.className=i.messageClasses[n],this._logFeedObj.appendChild(o),console[n](t)},hide:function(){console.log(this._logFeedObj),this._logFeedObj.style.display="none"},show:function(){this._logFeedObj.style.display="display"}}),o.logger=function(t,e){return new o.Logger(t,e)},o.Point=function(t,e,n){this.x=n?Math.round(t):t,this.y=n?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,n=t.y-this.y;return Math.sqrt(e*e+n*n)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,i){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===n||null===t?t:new o.Point(t,e,i)},o.Transformation=function(t,e,n,i){this._a=t,this._b=e,this._c=n,this._d=i},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,n){var i=t.style[n];if(!i&&t.currentStyle&&(i=t.currentStyle[n]),(!i||"auto"===i)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);i=o?o[n]:null}return"auto"===i?null:i},getViewportOffset:function(t){var n,i=0,s=0,r=t,a=e.body,h=e.documentElement,l=o.Browser.ie7;do{if(i+=r.offsetTop||0,s+=r.offsetBeft||0,i+=parseInt(o.DomUtil.getStyle(r,"borderTopWidth"),10)||0,s+=parseInt(o.DomUtil.getStyle(r,"borderLeftWidth"),10)||0,n=o.DomUtil.getStyle(r,"position"),r.offsetParent===a&&"absolute"===n)break;if("fixed"===n){i+=a.scrollTop||h.scrollTop||0,s+=a.scrollLeft||h.scrollLeft||0;break}if("relative"===n&&!r.offsetLeft){var u=o.DomUtil.getStyle(r,"width"),c=o.DomUtil.getStyle(r,"max-width"),d=r.getBoundingClientRect();("none"!==u||"none"!==c)&&(s+=d.left+r.clientLeft),i+=d.top+(a.scrollTop||h.scrollTop||0);break}r=r.offsetParent}while(r);r=t;do{if(r===a)break;i-=r.scrollTop||0,s-=r.scrollLeft||0,o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!l||(s+=r.scrollWidth-r.clientWidth,l&&"hidden"!==o.DomUtil.getStyle(r,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(r,"overflow")&&(s+=17)),r=r.parentNode}while(r);return new o.Point(s,i)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,n,i){var o=e.createElement(t);return o.className=n,i&&i.appendChild(o),o},hasClass:function(t,e){return t.className.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(t.className)},addClass:function(t,e){o.DomUtil.hasClass(t,e)||(t.className+=(t.className?" ":"")+e)},removeClass:function(t,e){t.className=o.Util.trim((" "+t.className+" ").replace(" "+e+" "," "))},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var n=!1,i="DXImageTransform.Microsoft.Alpha";try{n=t.filters.item(i)}catch(o){if(1===e)return}e=Math.round(100*e),n?(n.Enabled=100!==e,n.Opacity=e):t.style.filter+=" progid:"+i+"(opacity="+e+")"}},testProp:function(t){for(var n=e.documentElement.style,i=0;i<t.length;i++)if(t[i]in n)return t[i];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,n="translate"+(e?"3d":"")+"(",i=(e?",0":"")+")";return n+t.x+"px,"+t.y+"px"+i},getScaleString:function(t,e){var n=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),i=" scale("+t+") ";return n+i},setPosition:function(t,e,n){t._leaflet_pos=e,!n&&o.Browser.any3d?(t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden")):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){var n=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault),n){var i=e.documentElement.style;this._userSelect=i[n],i[n]="none"}},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault),n&&(e.documentElement.style[n]=this._userSelect,delete this._userSelect)},disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.DomEvent={addListener:function(t,e,n,i){var s,r,a,h=o.stamp(n),l="_berries_"+e+h;return t[l]?this:(s=function(e){return n.call(i||t,e||o.DomEvent._getEvent())},o.Browser.msTouch&&0===e.indexOf("touch")?this.addMsTouchListener(t,e,s,h):(o.Browser.touch&&"dblclick"===e&&this.addDoubleTapListener&&this.addDoubleTapListener(t,s,h),"addEventListener"in t?"mousewheel"===e?(t.addEventListener("DOMMouseScroll",s,!1),t.addEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?(r=s,a="mouseenter"===e?"mouseover":"mouseout",s=function(e){return o.DomEvent._checkMouse(t,e)?r(e):void 0},t.addEventListener(a,s,!1)):"click"===e&&o.Browser.android?(r=s,s=function(t){return o.DomEvent._filterClick(t,r)},t.addEventListener(e,s,!1)):t.addEventListener(e,s,!1):"attachEvent"in t&&t.attachEvent("on"+e,s),t[l]=s,this))},removeListener:function(t,e,n){var i=o.stamp(n),s="_berries_"+e+i,r=t[s];return r?(o.Browser.msTouch&&0===e.indexOf("touch")?this.removeMsTouchListener(t,e,i):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,i):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",r,!1),t.removeEventListener(e,r,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",r,!1):t.removeEventListener(e,r,!1):"detachEvent"in t&&t.detachEvent("on"+e,r),t[s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableClickPropagation:function(t){for(var e=o.DomEvent.stopPropagation,n=o.Draggable.START.length-1;n>=0;n--)o.DomEvent.addListener(t,o.Draggable.START[n],e);return o.DomEvent.addListener(t,"click",o.DomEvent._fakeStop).addListener(t,"dblclick",e)},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,n){var i=o.Browser.ie7,s=e.body,r=e.documentElement,a=t.pageX?t.pageX-s.scrollLeft-r.scrollLeft:t.clientX,h=t.pageY?t.pageY-s.scrollTop-r.scrollTop:t.clientY,l=new o.Point(a,h);if(!n)return l;var u=n.getBoundingClientRect(),c=u.left-n.clientLeft,d=u.top-n.clientTop;return o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!i||(c+=n.scrollWidth-n.clientWidth,i&&"hidden"!==o.DomUtil.getStyle(n,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(n,"overflow")&&(c+=17)),l._subtract(new o.Point(c,d))},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var n=e.relatedTarget;if(!n)return!0;try{for(;n&&n!==t;)n=n.parentNode}catch(i){return!1}return n!==t},_getEvent:function(){var e=t.event;if(!e)for(var n=arguments.callee.caller;n&&(e=n.arguments[0],!e||t.Event!==e.constructor);)n=n.caller;return e},_filterClick:function(t,e){var n=t.timeStamp||t.originalEvent.timeStamp,i=o.DomEvent._lastClick&&n-o.DomEvent._lastClick;return i&&i>100&&1e3>i||t.target._simulatedClick&&!t._simulated?(o.DomEvent.stop(t),void 0):(o.DomEvent._lastClick=n,e(t))}},o.DomEvent.on=o.DomEvent.addListener,o.DomEvent.off=o.DomEvent.removeListener,o.LatLng=function(t,e){var n=parseFloat(t),i=parseFloat(e);if(isNaN(n)||isNaN(i))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=n,this.lng=i},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,n=o.LatLng.DEG_TO_RAD,i=(t.lat-this.lat)*n,s=(t.lng-this.lng)*n,r=this.lat*n,a=t.lat*n,h=Math.sin(i/2),l=Math.sin(s/2),u=h*h+l*l*Math.cos(r)*Math.cos(a);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var n=this.lng;return t=t||-180,e=e||180,n=(n+e)%(e-t)+(t>n||n===e?e:t),new o.LatLng(this.lat,n)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?new o.LatLng(t[0],t[1]):t===n||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var n=e?[t,e]:t,i=0,o=n.length;o>i;i++)this.extend(n[i])},o.LatLngBounds.prototype={extend:function(t){return t?(t="number"==typeof t[0]||"string"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this):this},pad:function(t){var e=this._southWest,n=this._northEast,i=Math.abs(e.lat-n.lat)*t,s=Math.abs(e.lng-n.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-i,e.lng-s),new o.LatLng(n.lat+i,n.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,n,i=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),n=t.getNorthEast()):e=n=t,e.lat>=i.lat&&n.lat<=s.lat&&e.lng>=i.lng&&n.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,n=this._northEast,i=t.getSouthWest(),s=t.getNorthEast(),r=s.lat>=e.lat&&i.lat<=n.lat,a=s.lng>=e.lng&&i.lng<=n.lng;return r&&a},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var e=o.LatLng.DEG_TO_RAD,n=this.MAX_LATITUDE,i=Math.max(Math.min(n,t.lat),-n),s=t.lng*e,r=i*e;return r=Math.log(Math.tan(Math.PI/4+r/2)),new o.Point(s,r)},unproject:function(t){var e=o.LatLng.RAD_TO_DEG,n=t.x*e,i=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*e;return new o.LatLng(i,n)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,e){var n=this.projection.project(t),i=this.scale(e);return this.transformation._transform(n,i)},pointToLatLng:function(t,e){var n=this.scale(e),i=this.transformation.untransform(t,n);return this.projection.unproject(i)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var e=this.projection.project(t),n=6378137;return e.multiplyBy(n)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.DefaultControl=o.Class.extend({_enabled:!0,_camera:{},_domElement:e,_STATE:{NONE:-1,ZOOMUP:0,ZOOMDOWN:1,ZOOMINMAX:2,ZOOMOUTMAX:3,PANNORTH:4,PANSOUTH:5,PANEAST:6,PANWEST:7,PITCHUP:8,PITCHDOWN:9,ROTATECW:10,ROTATECCW:11},_state:-1,_prevState:-1,options:{minCamHeight:0,maxCamHeight:1/0,keys:[33,34,35,36,38,40,39,37,38,40,39,37],zoomIncrement:10,panIncrement:10,pitchIncrement:10,maxZoomInHeight:1800,maxZoomOutHeight:1e4},initialize:function(e,i){this._camera=e,i!==n&&(this._domElement=i),o.DomEvent.on(this._domElement,"contextmenu",o.DomEvent.preventDefault,this),o.DomEvent.on(this._domElement,"mousedown",this._mousedown,this),o.DomEvent.on(this._domElement,"mousewheel",this._mousewheel,this),o.DomEvent.on(this._domElement,"DOMMouseScroll",this._mousewheel,this),o.DomEvent.on(t,"keydown",this._keydown,this),o.DomEvent.on(t,"keyup",this._keyup,this),o.DomEvent.on(this._domElement,"touchstart",this._touchstart,this),o.DomEvent.on(this._domElement,"touchend",this._touchend,this),o.DomEvent.on(this._domElement,"touchmove",this._touchmove,this)},zoomup:function(){this._camera.position.y+=this.options.zoomIncrement,this._camera.position.y>this.options.maxZoomOutHeight&&(this._camera.position.y=this.options.maxZoomOutHeight)},zoomdown:function(){this._camera.position.y-=this.options.zoomIncrement,this._camera.position.y<this.options.maxZoomInHeight&&(this._camera.position.y=this.options.maxZoomInHeight)},zoominmax:function(){this._camera.position.y=this.options.maxZoomInHeight},zoomoutmax:function(){this._camera.position.y=this.options.maxZoomOutHeight},pannorth:function(){this._camera.position.z+=this.options.panIncrement},pansouth:function(){this._camera.position.z-=this.options.panIncrement},paneast:function(){this._camera.position.x+=this.options.panIncrement},panwest:function(){this._camera.position.x-=this.options.panIncrement},pitchup:function(){},pitchdown:function(){},rotatecw:function(){},rotateccw:function(){},_keydown:function(t){if(this._enabled!==!1&&(this._prevState=this._state,this._state===this._STATE.NONE))if(t.ctrlKey===!0)switch(t.keyCode){case this.options.keys[this._STATE.PITCHUP]:this.pitchup();break;case this.options.keys[this._STATE.PITCHDOWN]:this.pitchdown();break;case this.options.keys[this._STATE.ROTATECW]:this.rotatecw();break;case this.options.keys[this._STATE.ROTATECCW]:this.rotateccw()}else switch(t.keyCode){case this.options.keys[this._STATE.ZOOMUP]:this.zoomup();break;case this.options.keys[this._STATE.ZOOMDOWN]:this.zoomdown();break;case this.options.keys[this._STATE.ZOOMINMAX]:this.zoominmax();break;case this.options.keys[this._STATE.ZOOMOUTMAX]:this.zoomoutmax();break;case this.options.keys[this._STATE.PANNORTH]:this.pannorth();break;case this.options.keys[this._STATE.PANSOUTH]:this.pansouth();break;case this.options.keys[this._STATE.PANEAST]:this.paneast();break;case this.options.keys[this._STATE.PANWEST]:this.panwest();break;default:return}},_keyup:function(){this._enabled!==!1&&(this._state=this._prevState)},_mousedown:function(t){this._enabled!==!1&&console.log(t)},_mousewheel:function(t){this._enabled!==!1&&console.log(t)},_touchstart:function(t){this._enabled!==!1&&console.log(t)},_touchend:function(t){this._enabled!==!1&&console.log(t)},_touchmove:function(t){this._enabled!==!1&&console.log(t)}}),o.Model=o.Class.extend({_clock:new THREE.Clock,options:{},initialize:function(t,e){return e=o.setOptions(this,e),this._initContainer(t),this._initThree(),this._initCamera(),this},addTerrain:function(t){this._terrain=t,this._scene.add(t._mesh)},getTerrain:function(){return this._terrain},addObject:function(t){return this._scene.add(t),this},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._berries)throw new Error("Map container is already initialized.");e._berries=!0},_initThree:function(){this._scene=this._scene=new THREE.Scene,this._renderer=new THREE.WebGLRenderer,this._renderer.setSize(t.innerWidth,t.innerHeight),this._container.innerHTML="",this._container.appendChild(this._renderer.domElement)},_initCamera:function(){var e=this._camera=new THREE.PerspectiveCamera(60,t.innerWidth/t.innerHeight,10,2e4);e.position.x=2e3,e.position.y=5e3,e.position.z=7065,e.lookAt(new THREE.Vector3(4311,1640,7065)),this._controls=new o.DefaultControl(e)},_render:function(){this._renderer.render(this._scene,this._camera)},_startAnimation:function(){var e=this,n=function(){t.requestAnimationFrame(n),e._renderer.render(e._scene,e._camera)};n()}}),o.model=function(t,e){if(!THREE)throw new Error("three.js is not detected. Berries required three.js");return new o.Model(t,e)},o.Terrain=o.Class.extend({_numWidthGridPts:100,_numDepthGridPts:100,_numWGPHalf:function(){return this._numWidthGridPts/2},_numDGPHalf:function(){return this._numDepthGridPts/2},_dataWidthInMeters:100,_dataDepthInMeters:100,_origin:new o.LatLng(0,0),_gridHeightLookup:{},_lookupOffset:{x:0,z:0},_lookupSpacing:{x:0,z:0},_bounds:new o.LatLngBounds,_eleBounds:{},options:{gridSpace:100,dataType:"SRTM_vector"},initialize:function(t,e){e=o.setOptions(this,e),this._data=this.addData(t),this._geometry=new THREE.PlaneGeometry(this._dataWidthInMeters,this._dataDepthInMeters,this._numWidthGridPts-1,this._numDepthGridPts-1),this._geometry.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2)),this._updateGeometry(),this._createMesh(),this._mesh.translateX(this._dataWidthInMeters/2),this._mesh.translateZ(this._dataDepthInMeters/2)},addTo:function(t){return t.addTerrain(this),this},addData:function(t){switch(this.options.dataType){case"SRTM_vector":return this._addSRTMData(t);default:throw new Error("Unsupported terrain data type")}},heightAt:function(t,e,n){var i;if(!this._bounds.contains([t,e]))throw new Error("Coordinates outside of bounds");n||(n=this._latlon2meters(t,e));var o=(n.x-this._lookupOffset.x)/this._lookupSpacing.x,s=(n.y-this._lookupOffset.z)/this._lookupSpacing.z,r=Math.floor(o)-this._numWGPHalf(),a=Math.ceil(o)-this._numWGPHalf(),h=Math.floor(s)-this._numDGPHalf(),l=Math.ceil(s)-this._numDGPHalf(),u=this._gridHeightLookup[r][h],c=this._gridHeightLookup[r][l],d=this._gridHeightLookup[a][h],f=this._gridHeightLookup[a][l];return i=(u+c+d+f)/4},worldVector:function(t,e){var n=this._latlon2meters(t,e),i=this.heightAt(t,e,n);return new THREE.Vector3(n.x,i,n.y)},_latlon2meters:function(t,e){var n=o.latLng(t,e);return{x:this._origin.distanceTo([n.lat,this._origin.lng]),y:this._origin.distanceTo([this._origin.lat,n.lng]),straightLine:n.distanceTo(this._origin)}},_addSRTMData:function(t){var e={nodes:[]};this._updateWorldDimensions(t.minLat,t.maxLat,t.minLon,t.maxLon,t.minEle,t.maxEle);for(var n in t.nodes){var i=new o.LatLng(t.nodes[n].lat,t.nodes[n].lon),s=this._latlon2meters(i);e.nodes.push({latlng:i,ele:t.nodes[n].ele,xm:s.x,ym:s.y})}return e},_updateWorldDimensions:function(t,e,n,i,s,r){var a=this._origin=new o.LatLng(t,n);this._bounds=new o.LatLngBounds([t,n],[e,i]),this._eleBounds={min:s,max:r};var h=this._dataWidthInMeters=a.distanceTo([a.lat,i]),l=this._dataDepthInMeters=a.distanceTo([e,a.lng]);this._numWidthGridPts=this._customRound(h/this.options.gridSpace,"nearest",2),this._numDepthGridPts=this._customRound(l/this.options.gridSpace,"nearest",2)},_updateGeometry:function(){var t=this._data.nodes,e=this._geometry,n=[];for(var i in t){var o=t[i].xm,s=t[i].ym,r=this._customRound(o,"down",this.options.gridSpace)/this.options.gridSpace,a=this._customRound(s,"down",this.options.gridSpace)/this.options.gridSpace;n[r]||(n[r]=[]),n[r][a]||(n[r][a]=[]),n[r][a].push(i)}this._lookupOffset.x=e.vertices[this._numWGPHalf()].x,this._lookupOffset.z=e.vertices[this._numWidthGridPts*this._numDGPHalf()].z,this._lookupSpacing.x=e.vertices[2].x-e.vertices[1].x,this._lookupSpacing.z=e.vertices[2*this._numWidthGridPts].z-e.vertices[this._numWidthGridPts].z;for(var h,l,u,c,d=0,f=0;f<this._numDepthGridPts;f++)for(var m=f*this.options.gridSpace,p=0;p<this._numWidthGridPts;p++){for(var _=p*this.options.gridSpace,g=1,y=[];0===y.length;){h=p-(g-1),l=f-(g-1),u=p+g,c=f+g;var v,E;if("undefined"!=typeof n[h]&&"undefined"!=typeof n[h][l])for(v in n[h][l])E=n[h][l][v],y.push(t[E]);if("undefined"!=typeof n[h]&&"undefined"!=typeof n[h][c])for(v in n[h][c])E=n[h][c][v],y.push(t[E]);if("undefined"!=typeof n[u]&&"undefined"!=typeof n[u][l])for(v in n[u][l])E=n[u][l][v],y.push(t[E]);if("undefined"!=typeof n[u]&&"undefined"!=typeof n[u][c])for(v in n[u][c])E=n[u][c][v],y.push(t[E]);g++}var T=this._findClosestPoint(_,m,y);e.vertices[d].y=T.z;var w=Math.round((e.vertices[d].x-this._lookupOffset.x)/this._lookupSpacing.x),L=e.vertices[d].y,M=Math.round((e.vertices[d].z-this._lookupOffset.z)/this._lookupSpacing.z);this._gridHeightLookup[w]||(this._gridHeightLookup[w]=[]),this._gridHeightLookup[w][M]=L,d++}},_findClosestPoint:function(t,e,n){var i={i:0,x:0,y:0,z:0,d:40075160};for(var o in n){var s=this._distance(t,e,n[o].xm,n[o].ym);s<i.d&&(i.i=o,i.x=n[o].xm,i.y=n[o].ym,i.z=n[o].ele,i.d=s)}return i},_createMesh:function(){var t=THREE.ImageUtils.loadTexture(o.Util.getTexturePath()+"/dirt3.jpg"),e=10,n=10;t.wrapS=t.wrapT=THREE.RepeatWrapping,t.repeat.set(Math.round(this._dataDepthInMeters/n),Math.round(this._dataWidthInMeters/e)),this._mesh=new THREE.Mesh(this._geometry,new THREE.MeshBasicMaterial({map:t}))},_customRound:function(t,e,n){switch(e){case"nearest":var i;return i=t%n>=n/2?parseInt(t/n,10)*n+n:parseInt(t/n,10)*n;case"down":return n*Math.floor(t/n);case"up":return n*Math.ceil(t/n)}},_distance:function(t,e,n,i){return Math.sqrt(Math.pow(n-t,2)+Math.pow(i-e,2))}}),o.terrain=function(t,e){return new o.Terrain(t,e)},o.Light=o.Class.extend({options:{},initialize:function(t,e,n,i){return i=o.setOptions(this,i),this._lat=t,this._lon=e,this._ele=n,this},addTo:function(t){var e=this._latlon2meters(this._lat,this._lon),n=e.x,i=e.y,o=this._ele,s=new THREE.DirectionalLight(16777215);return s.position.set(n,o,i).normalize(),t.addObject(s),this},_latlon2meters:function(t,e){return{x:111e3*t,y:85e3*e}}}),o.light=function(t,e){return new o.Light(t,e)},o.Road=o.Class.extend({options:{lanes:2,laneWidth:10},initialize:function(t,e,n){n=o.setOptions(this,n),this._way=t,this._nodes=e},addTo:function(t){var e=.25,n=this.options.lanes*this.options.laneWidth,i=4,o=[new THREE.Vector2(-1,0),new THREE.Vector2(-1,-n/2-e*i+5),new THREE.Vector2(-1,-n/2-e*i),new THREE.Vector2(.1,-n/2-e*i+.1),new THREE.Vector2(.75*e,-n/2),new THREE.Vector2(e,-n/2+e*i),new THREE.Vector2(e,n/2-e*i),new THREE.Vector2(.75*e,n/2),new THREE.Vector2(.1,n/2+e*i-.1),new THREE.Vector2(-1,n/2+e*i),new THREE.Vector2(-1,n/2+e*i-5),new THREE.Vector2(-1,0)],s=new THREE.Shape(o),r=[];for(var a in this._way.nodes){var h=this._way.nodes[a],l=Number(this._nodes[h].lat),u=Number(this._nodes[h].lon),c=t.getTerrain().worldVector(l,u);c.y+=e,r.push(c)}var d=new THREE.SplineCurve3(r),f=new THREE.ExtrudeGeometry(s,{extrudePath:d}),m=new THREE.Mesh(f,new THREE.MeshBasicMaterial({color:9802643}));return t.addObject(m),this}}),o.road=function(t,e){return new o.Road(t,e)},o.OSMDataContainer=o.Class.extend({_nodes:[],_ways:[],_relations:[],options:{render:["roads"]},initialize:function(t,e){return e=o.setOptions(this,e),this.addData(t),this},addTo:function(t){for(var e in this.options.render){var n=this.options.render[e];switch(n){case"roads":var i=this.get("roads");for(var s in i){var r=i[s],a=[];for(var h in r.nodes){var l=r.nodes[h];a[l]=this._nodes[l]}new o.Road(r,a).addTo(t)}}}},addData:function(t){this._data?(o.Util.arrayMerge(this._nodes,t.nodes),o.Util.arrayMerge(this._ways,t.ways),o.Util.arrayMerge(this._relations,t.relations)):(this._nodes=t.nodes,this._ways=t.ways,this._relations=t.relations)},get:function(t){var e=[];switch(t){case"roads":var n=["motorway","motorway_link","trunk","trunk_link","primary","primary_link","secondary","secondary_link","tertiary","tertiary_link","residential","unclassified","service","track"];for(var i in this._ways)if(this._ways[i].tags&&n.indexOf(this._ways[i].tags.highway)>-1){var o=this._ways[i];
e.push(o)}}return e},getNode:function(t){return this._nodes[t]},getWay:function(t){return this._ways[t]},getRelation:function(t){return this._relations[t]}}),o.osmdata=function(t,e){return new o.OSMDataContainer(t,e)}}(window,document);
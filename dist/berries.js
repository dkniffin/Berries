/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
!function(t,e,n){var i=t.B,o={};o.version="0.0.1","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.B=i,this},t.B=o,o.Util={extend:function(t){var e,n,i,o,r=Array.prototype.slice.call(arguments,1);for(n=0,i=r.length;i>n;n++){o=r[n]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var n=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,n||arguments)}},stamp:function(){var t=0,e="_leaflet_id";return function(n){return n[e]=n[e]||++t,n[e]}}(),invokeEach:function(t,e,n){var i,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(i in t)e.apply(n,[i,t[i]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,n){var i,o;return function r(){var s=arguments;return i?(o=!0,void 0):(i=!0,setTimeout(function(){i=!1,o&&(r.apply(n,s),o=!1)},e),t.apply(n,s),void 0)}},falseFn:function(){return!1},formatNum:function(t,e){var n=Math.pow(10,e||5);return Math.round(t*n)/n},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,n){var i=[];for(var o in t)i.push(encodeURIComponent(n?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+i.join("&")},compileTemplate:function(t,e){return t=t.replace(/\{ *([\w_]+) *\}/g,function(t,n){return'" + o["'+n+'"]'+("function"==typeof e[n]?"(o)":"")+' + "'}),new Function("o",'return "'+t+'";')},template:function(t,e){var n=o.Util._templateCache=o.Util._templateCache||{};return n[t]=n[t]||o.Util.compileTemplate(t,e),n[t](e)},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){var n,i,o=["webkit","moz","o","ms"];for(n=0;n<o.length&&!i;n++)i=t[o[n]+e];return i}function n(e){var n=+new Date,o=Math.max(0,16-(n-i));return i=n+o,t.setTimeout(e,o)}var i=0,r=t.requestAnimationFrame||e("RequestAnimationFrame")||n,s=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,i,s,a){return e=o.bind(e,i),s&&r===n?(e(),void 0):r.call(t,e,a)},o.Util.cancelAnimFrame=function(e){e&&s.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},n=function(){};n.prototype=this.prototype;var i=new n;i.constructor=e,e.prototype=i;for(var r in this)this.hasOwnProperty(r)&&"prototype"!==r&&(e[r]=this[r]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[i].concat(t.includes)),delete t.includes),t.options&&i.options&&(t.options=o.extend({},i.options,t.options)),o.extend(i,t),i._initHooks=[];var s=this;return e.__super__=s.prototype,i.callInitHooks=function(){if(!this._initHooksCalled){s.prototype.callInitHooks&&s.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=i._initHooks.length;e>t;t++)i._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),n="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n)},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,n){var i=t.style[n];if(!i&&t.currentStyle&&(i=t.currentStyle[n]),(!i||"auto"===i)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);i=o?o[n]:null}return"auto"===i?null:i},getViewportOffset:function(t){var n,i=0,r=0,s=t,a=e.body,l=e.documentElement,h=o.Browser.ie7;do{if(i+=s.offsetTop||0,r+=s.offsetBeft||0,i+=parseInt(o.DomUtil.getStyle(s,"borderTopWidth"),10)||0,r+=parseInt(o.DomUtil.getStyle(s,"borderLeftWidth"),10)||0,n=o.DomUtil.getStyle(s,"position"),s.offsetParent===a&&"absolute"===n)break;if("fixed"===n){i+=a.scrollTop||l.scrollTop||0,r+=a.scrollLeft||l.scrollLeft||0;break}if("relative"===n&&!s.offsetLeft){var u=o.DomUtil.getStyle(s,"width"),c=o.DomUtil.getStyle(s,"max-width"),d=s.getBoundingClientRect();("none"!==u||"none"!==c)&&(r+=d.left+s.clientLeft),i+=d.top+(a.scrollTop||l.scrollTop||0);break}s=s.offsetParent}while(s);s=t;do{if(s===a)break;i-=s.scrollTop||0,r-=s.scrollLeft||0,o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!h||(r+=s.scrollWidth-s.clientWidth,h&&"hidden"!==o.DomUtil.getStyle(s,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(s,"overflow")&&(r+=17)),s=s.parentNode}while(s);return new o.Point(r,i)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,n,i){var o=e.createElement(t);return o.className=n,i&&i.appendChild(o),o},hasClass:function(t,e){return t.className.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(t.className)},addClass:function(t,e){o.DomUtil.hasClass(t,e)||(t.className+=(t.className?" ":"")+e)},removeClass:function(t,e){t.className=o.Util.trim((" "+t.className+" ").replace(" "+e+" "," "))},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var n=!1,i="DXImageTransform.Microsoft.Alpha";try{n=t.filters.item(i)}catch(o){if(1===e)return}e=Math.round(100*e),n?(n.Enabled=100!==e,n.Opacity=e):t.style.filter+=" progid:"+i+"(opacity="+e+")"}},testProp:function(t){for(var n=e.documentElement.style,i=0;i<t.length;i++)if(t[i]in n)return t[i];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,n="translate"+(e?"3d":"")+"(",i=(e?",0":"")+")";return n+t.x+"px,"+t.y+"px"+i},getScaleString:function(t,e){var n=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),i=" scale("+t+") ";return n+i},setPosition:function(t,e,n){t._leaflet_pos=e,!n&&o.Browser.any3d?(t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden")):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){var n=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault),n){var i=e.documentElement.style;this._userSelect=i[n],i[n]="none"}},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault),n&&(e.documentElement.style[n]=this._userSelect,delete this._userSelect)},disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.LatLng=function(t,e){var n=parseFloat(t),i=parseFloat(e);if(isNaN(n)||isNaN(i))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=n,this.lng=i},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,n=o.LatLng.DEG_TO_RAD,i=(t.lat-this.lat)*n,r=(t.lng-this.lng)*n,s=this.lat*n,a=t.lat*n,l=Math.sin(i/2),h=Math.sin(r/2),u=l*l+h*h*Math.cos(s)*Math.cos(a);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var n=this.lng;return t=t||-180,e=e||180,n=(n+e)%(e-t)+(t>n||n===e?e:t),new o.LatLng(this.lat,n)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?new o.LatLng(t[0],t[1]):t===n||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var n=e?[t,e]:t,i=0,o=n.length;o>i;i++)this.extend(n[i])},o.LatLngBounds.prototype={extend:function(t){return t?(t="number"==typeof t[0]||"string"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this):this},pad:function(t){var e=this._southWest,n=this._northEast,i=Math.abs(e.lat-n.lat)*t,r=Math.abs(e.lng-n.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-i,e.lng-r),new o.LatLng(n.lat+i,n.lng+r))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,n,i=this._southWest,r=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),n=t.getNorthEast()):e=n=t,e.lat>=i.lat&&n.lat<=r.lat&&e.lng>=i.lng&&n.lng<=r.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,n=this._northEast,i=t.getSouthWest(),r=t.getNorthEast(),s=r.lat>=e.lat&&i.lat<=n.lat,a=r.lng>=e.lng&&i.lng<=n.lng;return s&&a},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Model=o.Class.extend({_clock:new THREE.Clock,options:{render:{}},initialize:function(t,e){return e=o.setOptions(this,e),this._initContainer(t),this._initThree(),this._initCamera(),this},addThreeGeometry:function(t){return this._scene.add(t),this},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._berries)throw new Error("Map container is already initialized.");e._berries=!0},_initThree:function(){this._scene=this._scene=new THREE.Scene,this._renderer=new THREE.WebGLRenderer,this._renderer.setSize(t.innerWidth,t.innerHeight),this._container.innerHTML="",this._container.appendChild(this._renderer.domElement)},_initCamera:function(){var e=this._camera=new THREE.PerspectiveCamera(60,t.innerWidth/t.innerHeight,.1,2e4);this._controls=new THREE.FirstPersonControls(e),this._controls.movementSpeed=3e3,this._controls.lookSpeed=.1,e.position.x=-3750,e.position.y=3750,e.position.z=3e3},_render:function(){this._controls.update(this._clock.getDelta()),this._renderer.render(this._scene,this._camera)}}),o.model=function(t,e){if(!THREE)throw new Error("three.js is not detected. Berries required three.js");return new o.Model(t,e)},o.Terrain=o.Class.extend({_worldWidth:100,_worldDepth:100,_worldHalfWidth:100,_worldHalfDepth:100,_originXInMeters:0,_originYInMeters:0,options:{planeWidth:7500,planeHeight:7500,gridSpace:100,dataType:"SRTM_vector"},initialize:function(t,e){e=o.setOptions(this,e),this._data=this.addData(t),this._geometry=new THREE.PlaneGeometry(e.planeWidth,e.planeHeight,this._worldWidth-1,this._worldDepth-1),this._geometry.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2)),this._updateGeometry()},addTo:function(t){var e=new THREE.Mesh(this._geometry,new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("lib/textures/seamless-dirt.jpg")}));return t.addThreeGeometry(e),this},addData:function(t){switch(this.options.dataType){case"SRTM_vector":return this._addSRTMData(t);default:throw new Error("Unsupported terrain data type")}},_addSRTMData:function(t){var e=t;this._updateWorldDimensions(e.minLat,e.maxLat,e.minLon,e.maxLon);for(var n in e.nodes){var i=this._latlon2meters(e.nodes[n].lat,e.nodes[n].lon);e.nodes[n].xm=i.x,e.nodes[n].ym=i.y}return e},_updateWorldDimensions:function(t,e,n,i){var o=this._latlon2meters(t,n),r=this._latlon2meters(e,i);this._worldWidth=this._customRound(Math.abs(r.x-o.x)/this.options.gridSpace,"nearest",2),this._worldDepth=this._customRound(Math.abs(r.y-o.y)/this.options.gridSpace,"nearest",2),this._worldHalfWidth=this._worldWidth/2,this._worldHalfDepth=this._worldDepth/2,this._originXInMeters=o.x,this._originYInMeters=o.y},_customRound:function(t,e,n){switch(e){case"nearest":var i;return i=t%n>=n/2?parseInt(t/n,10)*n+n:parseInt(t/n,10)*n;case"down":return n*Math.floor(t/n);case"up":return n*Math.ceil(t/n)}},_latlon2meters:function(t,e){return{x:111e3*t,y:85e3*e}},_updateGeometry:function(){for(var t=this._data.nodes,e=this._geometry,n=new Array(this._worldWidth+5),i=0;i<n.length;i++){n[i]=new Array(this._worldDepth+5);for(var o=0;o<n[i].length;o++)n[i][o]=[]}for(var r in t){var s=t[r].xm,a=t[r].ym,l=this._customRound(s-this._originXInMeters,"down",this.options.gridSpace)/this.options.gridSpace,h=this._customRound(a-this._originYInMeters,"down",this.options.gridSpace)/this.options.gridSpace;n[l][h].push(r)}for(var u,c,d,f,p=0,m=0;m<this._worldDepth;m++)for(var g=this._originYInMeters+m*this.options.gridSpace,_=0;_<this._worldWidth;_++){for(var y=this._originXInMeters+_*this.options.gridSpace,w=1,L=[];0===L.length;){u=_-(w-1),c=m-(w-1),d=_+w,f=m+w;var v,E;if("undefined"!=typeof n[u]&&"undefined"!=typeof n[u][c])for(v in n[u][c])E=n[u][c][v],L.push(t[E]);if("undefined"!=typeof n[u]&&"undefined"!=typeof n[u][f])for(v in n[u][f])E=n[u][f][v],L.push(t[E]);if("undefined"!=typeof n[d]&&"undefined"!=typeof n[d][c])for(v in n[d][c])E=n[d][c][v],L.push(t[E]);if("undefined"!=typeof n[d]&&"undefined"!=typeof n[d][f])for(v in n[d][f])E=n[d][f][v],L.push(t[E]);w++}var T=this._findClosestPoint(y,g,L);e.vertices[p].y=T.z,p++}},_findClosestPoint:function(t,e,n){var i={i:0,x:0,y:0,z:0,d:40075160};for(var o in n){var r=this._distance(t,e,n[o].xm,n[o].ym);r<i.d&&(i.i=o,i.x=n[o].xm,i.y=n[o].ym,i.z=n[o].ele,i.d=r)}return i},_distance:function(t,e,n,i){return Math.sqrt(Math.pow(n-t,2)+Math.pow(i-e,2))}}),o.terrain=function(t,e){return new o.Terrain(t,e)},o.Light=o.Class.extend({options:{},initialize:function(t,e,n,i){return i=o.setOptions(this,i),this._lat=t,this._lon=e,this._ele=n,this},addTo:function(t){var e=this._latlon2meters(this._lat,this._lon),n=e.x,i=e.y,o=this._ele,r=new THREE.DirectionalLight(16777215);return r.position.set(n,o,i).normalize(),t.addThreeGeometry(r),this},_latlon2meters:function(t,e){return{x:111e3*t,y:85e3*e}}}),o.light=function(t,e){return new o.Light(t,e)}}(window,document);
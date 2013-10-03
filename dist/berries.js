/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
!function(t,n,e){var i=t.B,o={};o.version="0.0.1","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.B=i,this},t.B=o,o.Util={extend:function(t){var n,e,i,o,r=Array.prototype.slice.call(arguments,1);for(e=0,i=r.length;i>e;e++){o=r[e]||{};for(n in o)o.hasOwnProperty(n)&&(t[n]=o[n])}return t},bind:function(t,n){var e=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(n,e||arguments)}},stamp:function(){var t=0,n="_leaflet_id";return function(e){return e[n]=e[n]||++t,e[n]}}(),invokeEach:function(t,n,e){var i,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(i in t)n.apply(e,[i,t[i]].concat(o));return!0}return!1},limitExecByInterval:function(t,n,e){var i,o;return function r(){var s=arguments;return i?(o=!0,void 0):(i=!0,setTimeout(function(){i=!1,o&&(r.apply(e,s),o=!1)},n),t.apply(e,s),void 0)}},falseFn:function(){return!1},formatNum:function(t,n){var e=Math.pow(10,n||5);return Math.round(t*e)/e},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,n){return t.options=o.extend({},t.options,n),t.options},getParamString:function(t,n,e){var i=[];for(var o in t)i.push(encodeURIComponent(e?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(n&&-1!==n.indexOf("?")?"&":"?")+i.join("&")},compileTemplate:function(t,n){return t=t.replace(/\{ *([\w_]+) *\}/g,function(t,e){return'" + o["'+e+'"]'+("function"==typeof n[e]?"(o)":"")+' + "'}),new Function("o",'return "'+t+'";')},template:function(t,n){var e=o.Util._templateCache=o.Util._templateCache||{};return e[t]=e[t]||o.Util.compileTemplate(t,n),e[t](n)},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function n(n){var e,i,o=["webkit","moz","o","ms"];for(e=0;e<o.length&&!i;e++)i=t[o[e]+n];return i}function e(n){var e=+new Date,o=Math.max(0,16-(e-i));return i=e+o,t.setTimeout(n,o)}var i=0,r=t.requestAnimationFrame||n("RequestAnimationFrame")||e,s=t.cancelAnimationFrame||n("CancelAnimationFrame")||n("CancelRequestAnimationFrame")||function(n){t.clearTimeout(n)};o.Util.requestAnimFrame=function(n,i,s,a){return n=o.bind(n,i),s&&r===e?(n(),void 0):r.call(t,n,a)},o.Util.cancelAnimFrame=function(n){n&&s.call(t,n)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var n=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},e=function(){};e.prototype=this.prototype;var i=new e;i.constructor=n,n.prototype=i;for(var r in this)this.hasOwnProperty(r)&&"prototype"!==r&&(n[r]=this[r]);t.statics&&(o.extend(n,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[i].concat(t.includes)),delete t.includes),t.options&&i.options&&(t.options=o.extend({},i.options,t.options)),o.extend(i,t),i._initHooks=[];var s=this;return n.__super__=s.prototype,i.callInitHooks=function(){if(!this._initHooksCalled){s.prototype.callInitHooks&&s.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,n=i._initHooks.length;n>t;t++)i._initHooks[t].call(this)}},n},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var n=Array.prototype.slice.call(arguments,1),e="function"==typeof t?t:function(){this[t].apply(this,n)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(e)},o.Point=function(t,n,e){this.x=e?Math.round(t):t,this.y=e?Math.round(n):n},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var n=t.x-this.x,e=t.y-this.y;return Math.sqrt(n*n+e*e)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,n,i){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===e||null===t?t:new o.Point(t,n,i)},o.Transformation=function(t,n,e,i){this._a=t,this._b=n,this._c=e,this._d=i},o.Transformation.prototype={transform:function(t,n){return this._transform(t.clone(),n)},_transform:function(t,n){return n=n||1,t.x=n*(this._a*t.x+this._b),t.y=n*(this._c*t.y+this._d),t},untransform:function(t,n){return n=n||1,new o.Point((t.x/n-this._b)/this._a,(t.y/n-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?n.getElementById(t):t},getStyle:function(t,e){var i=t.style[e];if(!i&&t.currentStyle&&(i=t.currentStyle[e]),(!i||"auto"===i)&&n.defaultView){var o=n.defaultView.getComputedStyle(t,null);i=o?o[e]:null}return"auto"===i?null:i},getViewportOffset:function(t){var e,i=0,r=0,s=t,a=n.body,l=n.documentElement,h=o.Browser.ie7;do{if(i+=s.offsetTop||0,r+=s.offsetBeft||0,i+=parseInt(o.DomUtil.getStyle(s,"borderTopWidth"),10)||0,r+=parseInt(o.DomUtil.getStyle(s,"borderLeftWidth"),10)||0,e=o.DomUtil.getStyle(s,"position"),s.offsetParent===a&&"absolute"===e)break;if("fixed"===e){i+=a.scrollTop||l.scrollTop||0,r+=a.scrollLeft||l.scrollLeft||0;break}if("relative"===e&&!s.offsetLeft){var u=o.DomUtil.getStyle(s,"width"),c=o.DomUtil.getStyle(s,"max-width"),d=s.getBoundingClientRect();("none"!==u||"none"!==c)&&(r+=d.left+s.clientLeft),i+=d.top+(a.scrollTop||l.scrollTop||0);break}s=s.offsetParent}while(s);s=t;do{if(s===a)break;i-=s.scrollTop||0,r-=s.scrollLeft||0,o.DomUtil.documentIsLtr()||!o.Browser.webkit&&!h||(r+=s.scrollWidth-s.clientWidth,h&&"hidden"!==o.DomUtil.getStyle(s,"overflow-y")&&"hidden"!==o.DomUtil.getStyle(s,"overflow")&&(r+=17)),s=s.parentNode}while(s);return new o.Point(r,i)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(n.body,"direction")),o.DomUtil._docIsLtr},create:function(t,e,i){var o=n.createElement(t);return o.className=e,i&&i.appendChild(o),o},hasClass:function(t,n){return t.className.length>0&&new RegExp("(^|\\s)"+n+"(\\s|$)").test(t.className)},addClass:function(t,n){o.DomUtil.hasClass(t,n)||(t.className+=(t.className?" ":"")+n)},removeClass:function(t,n){t.className=o.Util.trim((" "+t.className+" ").replace(" "+n+" "," "))},setOpacity:function(t,n){if("opacity"in t.style)t.style.opacity=n;else if("filter"in t.style){var e=!1,i="DXImageTransform.Microsoft.Alpha";try{e=t.filters.item(i)}catch(o){if(1===n)return}n=Math.round(100*n),e?(e.Enabled=100!==n,e.Opacity=n):t.style.filter+=" progid:"+i+"(opacity="+n+")"}},testProp:function(t){for(var e=n.documentElement.style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return!1},getTranslateString:function(t){var n=o.Browser.webkit3d,e="translate"+(n?"3d":"")+"(",i=(n?",0":"")+")";return e+t.x+"px,"+t.y+"px"+i},getScaleString:function(t,n){var e=o.DomUtil.getTranslateString(n.add(n.multiplyBy(-1*t))),i=" scale("+t+") ";return e+i},setPosition:function(t,n,e){t._leaflet_pos=n,!e&&o.Browser.any3d?(t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(n),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden")):(t.style.left=n.x+"px",t.style.top=n.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){var e=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault),e){var i=n.documentElement.style;this._userSelect=i[e],i[e]="none"}},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault),e&&(n.documentElement.style[e]=this._userSelect,delete this._userSelect)},disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.LatLng=function(t,n){var e=parseFloat(t),i=parseFloat(n);if(isNaN(e)||isNaN(i))throw new Error("Invalid LatLng object: ("+t+", "+n+")");this.lat=e,this.lng=i},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var n=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return n<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var n=6378137,e=o.LatLng.DEG_TO_RAD,i=(t.lat-this.lat)*e,r=(t.lng-this.lng)*e,s=this.lat*e,a=t.lat*e,l=Math.sin(i/2),h=Math.sin(r/2),u=l*l+h*h*Math.cos(s)*Math.cos(a);return 2*n*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,n){var e=this.lng;return t=t||-180,n=n||180,e=(e+n)%(n-t)+(t>e||e===n?n:t),new o.LatLng(this.lat,e)}},o.latLng=function(t,n){return t instanceof o.LatLng?t:o.Util.isArray(t)?new o.LatLng(t[0],t[1]):t===e||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):new o.LatLng(t,n)},o.LatLngBounds=function(t,n){if(t)for(var e=n?[t,n]:t,i=0,o=e.length;o>i;i++)this.extend(e[i])},o.LatLngBounds.prototype={extend:function(t){return t?(t="number"==typeof t[0]||"string"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this):this},pad:function(t){var n=this._southWest,e=this._northEast,i=Math.abs(n.lat-e.lat)*t,r=Math.abs(n.lng-e.lng)*t;return new o.LatLngBounds(new o.LatLng(n.lat-i,n.lng-r),new o.LatLng(e.lat+i,e.lng+r))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var n,e,i=this._southWest,r=this._northEast;return t instanceof o.LatLngBounds?(n=t.getSouthWest(),e=t.getNorthEast()):n=e=t,n.lat>=i.lat&&e.lat<=r.lat&&n.lng>=i.lng&&e.lng<=r.lng},intersects:function(t){t=o.latLngBounds(t);var n=this._southWest,e=this._northEast,i=t.getSouthWest(),r=t.getNorthEast(),s=r.lat>=n.lat&&i.lat<=e.lat,a=r.lng>=n.lng&&i.lng<=e.lng;return s&&a},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,n){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,n)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var n=o.LatLng.DEG_TO_RAD,e=this.MAX_LATITUDE,i=Math.max(Math.min(e,t.lat),-e),r=t.lng*n,s=i*n;return s=Math.log(Math.tan(Math.PI/4+s/2)),new o.Point(r,s)},unproject:function(t){var n=o.LatLng.RAD_TO_DEG,e=t.x*n,i=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*n;return new o.LatLng(i,e)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,n){var e=this.projection.project(t),i=this.scale(n);return this.transformation._transform(e,i)},pointToLatLng:function(t,n){var e=this.scale(n),i=this.transformation.untransform(t,e);return this.projection.unproject(i)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var n=this.projection.project(t),e=6378137;return n.multiplyBy(e)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.Model=o.Class.extend({_clock:new THREE.Clock,options:{},initialize:function(t,n){return n=o.setOptions(this,n),this._initContainer(t),this._initThree(),this._initCamera(),this},addTerrain:function(t){this._terrain=t,this._scene.add(t._mesh)},addObject:function(t){return this._scene.add(t),this},_initContainer:function(t){var n=this._container=o.DomUtil.get(t);if(!n)throw new Error("Map container not found.");if(n._berries)throw new Error("Map container is already initialized.");n._berries=!0},_initThree:function(){this._scene=this._scene=new THREE.Scene,this._renderer=new THREE.WebGLRenderer,this._renderer.setSize(t.innerWidth,t.innerHeight),this._container.innerHTML="",this._container.appendChild(this._renderer.domElement)},_initCamera:function(){var n=this._camera=new THREE.PerspectiveCamera(60,t.innerWidth/t.innerHeight,.1,2e4);this._controls=new THREE.FirstPersonControls(n),this._controls.movementSpeed=3e3,this._controls.lookSpeed=.1,n.position.x=-3750,n.position.y=3750,n.position.z=3e3},_render:function(){this._controls.update(this._clock.getDelta()),this._renderer.render(this._scene,this._camera)}}),o.model=function(t,n){if(!THREE)throw new Error("three.js is not detected. Berries required three.js");return new o.Model(t,n)},o.Terrain=o.Class.extend({_numWidthGridPts:100,_numDepthGridPts:100,_numWGPHalf:function(){return this._numWidthGridPts/2},_numDGPHalf:function(){return this._numDepthGridPts/2},_dataWidthInMeters:100,_dataDepthInMeters:100,_origin:new o.LatLng(0,0),options:{gridSpace:100,dataType:"SRTM_vector"},initialize:function(t,n){n=o.setOptions(this,n),this._data=this.addData(t),this._geometry=new THREE.PlaneGeometry(this._dataDepthInMeters,this._dataWidthInMeters,this._numWidthGridPts-1,this._numDepthGridPts-1),this._geometry.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2)),this._updateGeometry(),this._mesh.translateX(this._dataWidthInMeters/2),this._mesh.translateZ(this._dataDepthInMeters/2)},addTo:function(t){return t.addTerrain(this),this},addData:function(t){switch(this.options.dataType){case"SRTM_vector":return this._addSRTMData(t);default:throw new Error("Unsupported terrain data type")}},heightAt:function(t,n,e){var i,o=this._latlon2meters(t,n);console.log(o);var r=new THREE.LineBasicMaterial({color:16711680}),s=new THREE.Geometry;s.vertices.push(new THREE.Vector3(o.x,2300,o.y)),s.vertices.push(new THREE.Vector3(o.x,0,o.y));var a=new THREE.Line(s,r);e.addObject(a);var l=new THREE.Raycaster(new THREE.Vector3(o.x,1e4,o.y),new THREE.Vector3(0,-1,0));return console.log(l.intersectObject(this._mesh)),i},_latlon2meters:function(t,n){var e=o.latLng(t,n);return{x:e.distanceTo([e.lat,this._origin.lng]),y:e.distanceTo([this._origin.lat,e.lng]),straightLine:e.distanceTo(this._origin)}},_addSRTMData:function(t){var n={nodes:[]};this._updateWorldDimensions(t.minLat,t.maxLat,t.minLon,t.maxLon);for(var e in t.nodes){var i=new o.LatLng(t.nodes[e].lat,t.nodes[e].lon),r=this._latlon2meters(i);n.nodes.push({latlng:i,ele:t.nodes[e].ele,xm:r.x,ym:r.y})}return n},_updateWorldDimensions:function(t,n,e,i){var r=this._origin=new o.LatLng(t,e),s=this._dataWidthInMeters=r.distanceTo([r.lat,i]),a=this._dataDepthInMeters=r.distanceTo([n,r.lng]);this._numWidthGridPts=this._customRound(s/this.options.gridSpace,"nearest",2),this._numDepthGridPts=this._customRound(a/this.options.gridSpace,"nearest",2)},_customRound:function(t,n,e){switch(n){case"nearest":var i;return i=t%e>=e/2?parseInt(t/e,10)*e+e:parseInt(t/e,10)*e;case"down":return e*Math.floor(t/e);case"up":return e*Math.ceil(t/e)}},_updateGeometry:function(){for(var t=this._data.nodes,n=this._geometry,e=new Array(this._numWidthGridPts+5),i=0;i<e.length;i++){e[i]=new Array(this._numDepthGridPts+5);for(var o=0;o<e[i].length;o++)e[i][o]=[]}for(var r in t){var s=t[r].xm,a=t[r].ym,l=this._customRound(s,"down",this.options.gridSpace)/this.options.gridSpace,h=this._customRound(a,"down",this.options.gridSpace)/this.options.gridSpace;e[l][h].push(r)}for(var u,c,d,f,p=0,m=0;m<this._numDepthGridPts;m++)for(var g=m*this.options.gridSpace,_=0;_<this._numWidthGridPts;_++){for(var y=_*this.options.gridSpace,L=1,v=[];0===v.length;){u=_-(L-1),c=m-(L-1),d=_+L,f=m+L;var w,T;if("undefined"!=typeof e[u]&&"undefined"!=typeof e[u][c])for(w in e[u][c])T=e[u][c][w],v.push(t[T]);if("undefined"!=typeof e[u]&&"undefined"!=typeof e[u][f])for(w in e[u][f])T=e[u][f][w],v.push(t[T]);if("undefined"!=typeof e[d]&&"undefined"!=typeof e[d][c])for(w in e[d][c])T=e[d][c][w],v.push(t[T]);if("undefined"!=typeof e[d]&&"undefined"!=typeof e[d][f])for(w in e[d][f])T=e[d][f][w],v.push(t[T]);L++}var E=this._findClosestPoint(y,g,v);n.vertices[p].y=E.z,p++}this._mesh=new THREE.Mesh(this._geometry,new THREE.MeshBasicMaterial({color:255}))},_findClosestPoint:function(t,n,e){var i={i:0,x:0,y:0,z:0,d:40075160};for(var o in e){var r=this._distance(t,n,e[o].xm,e[o].ym);r<i.d&&(i.i=o,i.x=e[o].xm,i.y=e[o].ym,i.z=e[o].ele,i.d=r)}return i},_distance:function(t,n,e,i){return Math.sqrt(Math.pow(e-t,2)+Math.pow(i-n,2))}}),o.terrain=function(t,n){return new o.Terrain(t,n)},o.Light=o.Class.extend({options:{},initialize:function(t,n,e,i){return i=o.setOptions(this,i),this._lat=t,this._lon=n,this._ele=e,this},addTo:function(t){var n=this._latlon2meters(this._lat,this._lon),e=n.x,i=n.y,o=this._ele,r=new THREE.DirectionalLight(16777215);return r.position.set(e,o,i).normalize(),t.addObject(r),this},_latlon2meters:function(t,n){return{x:111e3*t,y:85e3*n}}}),o.light=function(t,n){return new o.Light(t,n)},o.OSMDataContainer=o.Class.extend({options:{render:["roads"]},initialize:function(t,n){return n=o.setOptions(this,n),this.addData(t),this},addTo:function(t){for(var n in this.options.render){var e=this.options.render[n];switch(e){case"roads":var i=this.get("roads");console.log(i)}}console.log(t)},addData:function(t){if(this._data){for(var n=+t.length,e=0,i=this._data.length;n>e;e++)this._data[i++]=t[e];this._data.length=i}else this._data=t},get:function(t){var n=[],e=this;switch(t){case"roads":var i=["motorway","motorway_link","trunk","trunk_link","primary","primary_link","secondary","secondary_link","tertiary","tertiary_link","residential","unclassified","service","track"];this._data.way.forEach(function(t){var o=e._normalizeTagsArray(t.tag),r=e._getTagValue(o,"highway");i.indexOf(r)>-1&&n.push(t)})}return n},_getTagValue:function(t,n){for(var e=this,i=this._normalizeTagsArray(t),o=0;o<i.length;o++)if(e._KVmatches(i[o],n))return i[o]["@v"];return null},_hasTag:function(t,n,e){for(var i=this,o=this._normalizeTagsArray(t),r=0;r<o.length;r++)if(i._KVmatches(o[r],n,e))return!0;return!1},_KVmatches:function(t,n,e){return t["@k"]===n&&("undefined"==typeof e||t["@v"]===e)},_normalizeTagsArray:function(t){return t instanceof Array?t:"undefined"==typeof t?[]:[t]}}),o.osmdata=function(t,n){return new o.OSMDataContainer(t,n)}}(window,document);
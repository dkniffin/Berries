/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
B={},B.Worker={w:"undefined"==typeof window?self:new Worker("lib/js/berries/dist/berries-worker-src.js"),onMsgHandlers:{},addMsgHandler:function(t,e){B.Worker.onMsgHandlers[t]=e},sendMsg:function(t,e,n){e&&this.addMsgHandler(t.action,e),B.Worker.w.postMessage(t,n)}},B.Worker.w.onmessage=function(t){if("undefined"==typeof B.Worker.onMsgHandlers[t.data.action])throw new Error("Unknown action type recieved: "+t.data.action);B.Worker.onMsgHandlers[t.data.action](t)},B.Worker.addMsgHandler("loadLibrary",function(t){B.Logger.log("debug","Loading "+t.data.url),importScripts(t.data.url)}),B.Worker.addMsgHandler("loadDefaultMats",function(){B.Materials.initDefaults()}),B.Logger={log:function(t,e){B.Worker.sendMsg({action:"log",type:t,message:e})}},B.OSMData={},B.Worker.addMsgHandler("loadOSMData",function(t){var e=B.OSMData.url=t.data.url,n=new XMLHttpRequest;n.open("GET",e,!0),n.onload=function(){var t=B.OSMData.data=JSON.parse(n.responseText);for(var e in t.ways)t.ways[e].nodes.length<2&&(delete t.ways[e],console.warn("Way "+e+" is a bug. It only has one node. Consider deleting it from OSM."));B.Logger.log("info","Returning OSM Data"),B.Worker.sendMsg({action:"loadOSMData",data:t})},B.Logger.log("info","Loading OSM Data"),n.send(null)}),B.Class=function(){},B.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},n=function(){};n.prototype=this.prototype;var a=new n;a.constructor=e,e.prototype=a;for(var r in this)this.hasOwnProperty(r)&&"prototype"!==r&&(e[r]=this[r]);t.statics&&(B.extend(e,t.statics),delete t.statics),t.includes&&(B.Util.extend.apply(null,[a].concat(t.includes)),delete t.includes),t.options&&a.options&&(t.options=B.extend({},a.options,t.options)),B.extend(a,t),a._initHooks=[];var o=this;return e.__super__=o.prototype,a.callInitHooks=function(){if(!this._initHooksCalled){o.prototype.callInitHooks&&o.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=a._initHooks.length;e>t;t++)a._initHooks[t].call(this)}},e},B.Class.include=function(t){B.extend(this.prototype,t)},B.Class.mergeOptions=function(t){B.extend(this.prototype.options,t)},B.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),n="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(n)},B.Util={extend:function(t){var e,n,a,r,o=Array.prototype.slice.call(arguments,1);for(n=0,a=o.length;a>n;n++){r=o[n]||{};for(e in r)r.hasOwnProperty(e)&&(t[e]=r[e])}return t},bind:function(t,e){var n=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,n||arguments)}},stamp:function(){var t=0,e="_berries_id";return function(n){return n[e]=n[e]||++t,n[e]}}(),invokeEach:function(t,e,n){var a,r;if("object"==typeof t){r=Array.prototype.slice.call(arguments,3);for(a in t)e.apply(n,[a,t[a]].concat(r));return!0}return!1},limitExecByInterval:function(t,e,n){var a,r;return function o(){var i=arguments;return a?(r=!0,void 0):(a=!0,setTimeout(function(){a=!1,r&&(o.apply(n,i),r=!1)},e),t.apply(n,i),void 0)}},falseFn:function(){return!1},formatNum:function(t,e){var n=Math.pow(10,e||5);return Math.round(t*n)/n},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return B.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=B.extend({},t.options,e),t.options},getParamString:function(t,e,n){var a=[];for(var r in t)a.push(encodeURIComponent(n?r.toUpperCase():r)+"="+encodeURIComponent(t[r]));return(e&&-1!==e.indexOf("?")?"&":"?")+a.join("&")},compileTemplate:function(t,e){return t=t.replace(/\{ *([\w_]+) *\}/g,function(t,n){return'" + o["'+n+'"]'+("function"==typeof e[n]?"(o)":"")+' + "'}),new Function("o",'return "'+t+'";')},template:function(t,e){var n=B.Util._templateCache=B.Util._templateCache||{};return n[t]=n[t]||B.Util.compileTemplate(t,e),n[t](e)},arrayMerge:function(t,e){for(var n=+e.length,a=0,r=t.length;n>a;a++)t[r++]=e[a];return t.length=r,t},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},getBerriesPath:function(){var t,e,n,a,r,o=document.getElementsByTagName("script"),i=/[\/^]berries[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,e=o.length;e>t;t++)if(n=o[t].src,a=n.match(i))return r=n.split(i)[0],r?r+"/":""},getTexturePath:function(){return this.getBerriesPath()+"textures"},getObjPath:function(){return this.getBerriesPath()+"obj"},getDaePath:function(){return this.getBerriesPath()+"dae"},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},"undefined"!=typeof window&&!function(){function t(t){var e,n,a=["webkit","moz","o","ms"];for(e=0;e<a.length&&!n;e++)n=window[a[e]+t];return n}function e(t){var e=+new Date,a=Math.max(0,16-(e-n));return n=e+a,window.setTimeout(t,a)}var n=0,a=window.requestAnimationFrame||t("RequestAnimationFrame")||e,r=window.cancelAnimationFrame||t("CancelAnimationFrame")||t("CancelRequestAnimationFrame")||function(t){window.clearTimeout(t)};B.Util.requestAnimFrame=function(t,n,r,o){return t=B.bind(t,n),r&&a===e?(t(),void 0):a.call(window,t,o)},B.Util.cancelAnimFrame=function(t){t&&r.call(window,t)}}(),B.extend=B.Util.extend,B.bind=B.Util.bind,B.stamp=B.Util.stamp,B.setOptions=B.Util.setOptions,B.LatLng=function(t,e){var n=parseFloat(t),a=parseFloat(e);if(isNaN(n)||isNaN(a))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=n,this.lng=a},B.extend(B.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),B.LatLng.prototype={equals:function(t){if(!t)return!1;t=B.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=B.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+B.Util.formatNum(this.lat,t)+", "+B.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=B.latLng(t);var e=6378137,n=B.LatLng.DEG_TO_RAD,a=(t.lat-this.lat)*n,r=(t.lng-this.lng)*n,o=this.lat*n,i=t.lat*n,s=Math.sin(a/2),l=Math.sin(r/2),u=s*s+l*l*Math.cos(o)*Math.cos(i);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var n=this.lng;return t=t||-180,e=e||180,n=(n+e)%(e-t)+(t>n||n===e?e:t),new B.LatLng(this.lat,n)}},B.latLng=function(t,e){return t instanceof B.LatLng?t:B.Util.isArray(t)?new B.LatLng(t[0],t[1]):void 0===t||null===t?t:"object"==typeof t&&"lat"in t?new B.LatLng(t.lat,"lng"in t?t.lng:t.lon):new B.LatLng(t,e)},B.LatLngBounds=function(t,e){if(t)for(var n=e?[t,e]:t,a=0,r=n.length;r>a;a++)this.extend(n[a])},B.LatLngBounds.prototype={extend:function(t){return t?(t="number"==typeof t[0]||"string"==typeof t[0]||t instanceof B.LatLng?B.latLng(t):B.latLngBounds(t),t instanceof B.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new B.LatLng(t.lat,t.lng),this._northEast=new B.LatLng(t.lat,t.lng)):t instanceof B.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this):this},pad:function(t){var e=this._southWest,n=this._northEast,a=Math.abs(e.lat-n.lat)*t,r=Math.abs(e.lng-n.lng)*t;return new B.LatLngBounds(new B.LatLng(e.lat-a,e.lng-r),new B.LatLng(n.lat+a,n.lng+r))},getCenter:function(){return new B.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new B.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new B.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof B.LatLng?B.latLng(t):B.latLngBounds(t);var e,n,a=this._southWest,r=this._northEast;return t instanceof B.LatLngBounds?(e=t.getSouthWest(),n=t.getNorthEast()):e=n=t,e.lat>=a.lat&&n.lat<=r.lat&&e.lng>=a.lng&&n.lng<=r.lng},intersects:function(t){t=B.latLngBounds(t);var e=this._southWest,n=this._northEast,a=t.getSouthWest(),r=t.getNorthEast(),o=r.lat>=e.lat&&a.lat<=n.lat,i=r.lng>=e.lng&&a.lng<=n.lng;return o&&i},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=B.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},B.latLngBounds=function(t,e){return!t||t instanceof B.LatLngBounds?t:new B.LatLngBounds(t,e)},B.Materials={MATERIALS:[],addMaterial:function(t,e){if(!t.match(/^[A-Z0-9]+$/))throw new Error("Material name does not match regex. Must be all uppercase alpha-numerical characters");if("undefined"!=typeof this[t])throw new Error("Material with name already exists. Use update instead.");this.MATERIALS.push(e),this[t]=this.MATERIALS.length-1},updateMaterial:function(t,e){if("undefined"==typeof this[t])throw new Error("Material does not exist yet. Cannot update.");var n=this[t];this.MATERIALS[n]=e},getMaterial:function(t){return B.Materials.MATERIALS[this[t]]}},B.Materials.initDefaults=function(){B.Materials.addMaterial("BRICKRED",new THREE.MeshPhongMaterial({color:8658727,side:THREE.DoubleSide})),B.Materials.addMaterial("CONCRETEWHITE",new THREE.MeshPhongMaterial({color:15921906,side:THREE.DoubleSide})),B.Materials.addMaterial("GLASSBLUE",new THREE.MeshPhongMaterial({color:40413,side:THREE.DoubleSide})),B.Materials.addMaterial("ASPHALTGREY",new THREE.MeshPhongMaterial({color:7697781,side:THREE.DoubleSide})),B.Materials.addMaterial("WOODBROWN",new THREE.MeshPhongMaterial({color:11439968,side:THREE.DoubleSide}))},B.Worker.addMsgHandler("generateTerrain",function(t){var e=t.data.options;terrain={};var n=new XMLHttpRequest;n.responseType="arraybuffer",n.open("GET",t.data.srtmDataSource,!0),n.onload=function(){if(n.response){var t=new Uint16Array(n.response);B.Logger.log("info","Getting SRTM data");var a=B.latLngBounds([[e.bounds[0].lat,e.bounds[0].lng],[e.bounds[1].lat,e.bounds[1].lng]]),r=e.numVertsX,o=e.numVertsY,i=a.getSouthWest(),s=i.distanceTo(a.getSouthEast()),l=i.distanceTo(a.getNorthWest());B.Logger.log("log","Creating the terrain geometry");var u=terrain.geometry=new THREE.PlaneGeometry(s,l,r-1,o-1),g=s/(r-1),h=l/(o-1);B.Logger.log("debug","Populating vertices");for(var c=0,d=u.vertices.length;d>c;c++)u.vertices[c].z=4347*(t[c]/65535);B.Logger.log("debug","Done populating vertices"),u.computeFaceNormals(),u.computeVertexNormals(),B.Logger.log("debug","Returning geometry..."),B.Logger.log("debug","Sorry, this is gonna take a while...it needs to be refactored..."),B.Worker.sendMsg({action:"generateTerrain",geometryParts:{vertices:u.vertices,faces:u.faces,width:s,height:l,numVertsX:r,numVertsY:o,gridSpaceX:g,gridSpaceY:h}})}},n.send(null)});var getHeight=function(t,e){var n=e.levels*e.levelHeight;if(t)if(t.height)n=t.height;else{var a=e.levels;if(t["building:levels"])a=t["building:levels"];else if(t.building)switch(t.building){case"house":case"garage":case"roof":case"hut":a=1;break;case"school":a=2;break;case"apartments":case"office":a=3;break;case"hospital":a=4;break;case"hotel":a=10}var r=e.levelHeight;n=a*r}return n},getWallMaterialIndex=function(t,e){var n;switch(t["building:material"]){case"glass":n=B.Materials.GLASSBLUE;break;case"wood":n=B.Materials.WOODBROWN;break;case"brick":n=B.Materials.BRICKRED;break;case"concrete":n=B.Materials.CONCRETEWHITE;break;default:n=e}return n};B.Worker.addMsgHandler("generateBuilding",function(t){B.Logger.log("info","Generating Building");var e=t.data.options;B.Logger.log("info",e);var n,a,r=t.data.tags,o=t.data.outlinePoints,i=new THREE.Geometry,s=getHeight(r,e.heightOptions),l=o[0].z;for(n in o)o[n].z<l&&(l=o[n].z);var u=l+s,g=THREE.Shape.Utils.isClockWise(o);g||o.reverse();var h=getWallMaterialIndex(r,e.defaultBuildingMaterial),c=[];for(a in o){a=Number(a);var d=o[a],f=a!==o.length-1?a+1:0,p=o[f],E=new THREE.Geometry;E.vertices.push(new THREE.Vector3(d.x,d.y,l)),E.vertices.push(new THREE.Vector3(p.x,p.y,l)),E.vertices.push(new THREE.Vector3(p.x,p.y,u)),E.vertices.push(new THREE.Vector3(d.x,d.y,u)),E.faces.push(new THREE.Face3(2,1,0,null,null,h)),E.faces.push(new THREE.Face3(3,2,0,null,null,h)),THREE.GeometryUtils.merge(i,E),c.push(new THREE.Vector2(d.x,d.y))}var m=new THREE.Geometry,L=new THREE.Shape(c),M=L.extractPoints(),w=THREE.Shape.Utils.triangulateShape(M.shape,M.holes);for(n in M.shape){var y=M.shape[n];m.vertices.push(new THREE.Vector3(y.x,y.y,u))}for(n in w)m.faces.push(new THREE.Face3(w[n][0],w[n][1],w[n][2],null,null,B.Materials.ASPHALTGREY));m.computeFaceNormals(),THREE.GeometryUtils.merge(i,m),i.computeFaceNormals(),B.Logger.log("debug",i)});
/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
B={},B.Worker={w:"undefined"==typeof window?self:new Worker("lib/js/berries/dist/berries-worker-src.js"),onMsgHandlers:{},addMsgHandler:function(e,r){B.Worker.onMsgHandlers[e]=r},sendMsg:function(e){B.Worker.w.postMessage(e)}},B.Worker.w.onmessage=function(e){if("undefined"==typeof B.Worker.onMsgHandlers[e.data.action])throw new Error("Unknown action type recieved from worker");B.Worker.onMsgHandlers[e.data.action](e)},B.Worker.addMsgHandler("generateBuilding",function(){B.Worker.sendMsg({action:"log",type:"info",message:"got to generateBuilding"})});
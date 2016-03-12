'use strict';

require.config({
	baseUrl: "/scripts",
	paths: {
		underscore: 'underscore/underscore-min',
		jquery: 'jquery/dist/jquery',
		knockout: 'knockout/build/output/knockout-latest',
		babylonjs: 'babylonjs/babylon.max'
	}

});


require(['jquery', 'babylonjs'], function($, bjs) {
	var canvas = document.getElementById("canvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine);

	engine.runRenderLoop(function () {
		scene.render();
	});
});

function createScene(engine){
	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false);

	var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, 0), scene);

	var box = BABYLON.MeshBuilder.CreateBox('box', {}, scene);

	return scene;
}
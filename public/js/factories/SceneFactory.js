define(['babylonjs'], function (bjs) {
	var instance = null;

	var SceneFactory = function () {

		this.canvas = document.getElementById("canvas");
		this.engine = new BABYLON.Engine(this.canvas, true);

	};

	SceneFactory.prototype.createScene = function () {
		var scene = new BABYLON.Scene(this.engine);

		var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, false);

		var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, 0), scene);

		var box = BABYLON.MeshBuilder.CreateBox('box', {}, scene);

		this.engine.runRenderLoop(function () {
			scene.render();
		});

		return scene;
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new SceneFactory();
			}
			return instance;
		}
	};
});


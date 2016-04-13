define(['babylonjs'], function (bjs) {
	var instance = null;

	var SceneFactory = function () {

		this.canvas = document.getElementById("canvas");
		this.engine = new BABYLON.Engine(this.canvas, true);

	};

	SceneFactory.prototype.createScene = function () {
		var _this = this;
		var scene = new BABYLON.Scene(this.engine);

		var camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, false);

		// setup light
		var light = new BABYLON.DirectionalLight('Dir0', new BABYLON.Vector3(1, -1, 0), scene);
		light.intensity = 0.9;
		var ambientLight = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(1, -1, 0), scene);
		ambientLight.intensity = 0.8;

		// TODO background animation for menu
		//var box = BABYLON.MeshBuilder.CreateBox('box', {}, scene);

		var fpsDisplay = document.getElementById('fps');
		_this.engine.runRenderLoop(function () {
			scene.render();
			if(fpsDisplay) {
				fpsDisplay.innerHTML = _this.engine.getFps().toFixed() + " fps";
			}
		});

		_this.resize = function () {
			_this.engine.resize();
		};
		window.removeEventListener("resize", _this.resize);
		window.addEventListener("resize", _this.resize);

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


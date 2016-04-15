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

		camera.upperBetaLimit = 0.9;
		camera.lowerRadiusLimit = 5;
		camera.upperRadiusLimit = 40;
		camera.panningSensibility = 100;

		camera.attachControl(canvas, false, false);

		// setup light
		var light = new BABYLON.DirectionalLight('Dir0', new BABYLON.Vector3(1, -1, 0), scene);
		light.intensity = 0.8;
		//light.diffuse = new BABYLON.Color3(0.6,0.4,0);
		//light.specular = new BABYLON.Color3(1,0.6,0);

		var ambientLight = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(1, -1, 0), scene);
		ambientLight.intensity = 0.8;
		//ambientLight.diffuse = new BABYLON.Color3(0.6,0.4,0);
		//ambientLight.specular = new BABYLON.Color3(1,0.6,0);

		//scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
		//scene.fogStart = 40.0;
		//scene.fogEnd = 60.0;

		var cameraTargetBoundingBox = new BABYLON.Vector3(100, 100, 50);

		scene.registerBeforeRender(function(){
			if(camera.target.x > cameraTargetBoundingBox.x || camera.target.z > cameraTargetBoundingBox.z){
				camera.setTarget(new BABYLON.Vector3(
					Math.min(camera.target.x, cameraTargetBoundingBox.x),
					camera.target.y,
					Math.min(camera.target.z, cameraTargetBoundingBox.z)
				));
			}
			if(camera.target.x < -cameraTargetBoundingBox.x || camera.target.z < -cameraTargetBoundingBox.z){
				camera.setTarget(new BABYLON.Vector3(
					Math.max(camera.target.x, -cameraTargetBoundingBox.x),
					camera.target.y,
					Math.max(camera.target.z, -cameraTargetBoundingBox.z)
				));
			}
		});


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

		//document.addEventListener("contextmenu", function(e){
		//	e.preventDefault();
		//}, false);

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


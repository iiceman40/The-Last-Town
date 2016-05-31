define(['babylonjs', 'pepjs', 'knockout', 'TerrainTilesService'], function (bjs, pepjs, ko, TerrainTilesService) {
	var instance = null;

	var SceneFactory = function () {
		this.canvas = document.getElementById("canvas");
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = null;
	};

	SceneFactory.prototype.createScene = function () {
		this.scene = new BABYLON.Scene(this.engine);
		this.setupCamera(this.scene);
		this.setupEnvironment(this.scene);
		this.setupRenderLoop(this.scene);
		this.registerEvents(this.scene);
		return this.scene;
	};

	SceneFactory.prototype.setupRenderLoop = function(scene){
		var _this = this;
		var fpsDisplay = document.getElementById('fps');
		this.engine.runRenderLoop(function () {
			scene.render();
			if(fpsDisplay) {
				fpsDisplay.innerHTML = _this.engine.getFps().toFixed() + " fps";
			}
		});
	};

	SceneFactory.prototype.setupCamera = function(scene){
		var camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), scene);

		/*
		camera.lowerRadiusLimit = 7;
		camera.upperRadiusLimit = 80;
		camera.panningSensibility = 100;

		scene.registerBeforeRender(function(){
			camera.upperBetaLimit = Math.max(0.01, 1.5 * (1 - camera.radius/40));
			camera.lowerBetaLimit = Math.max(0.01, 1.5 * (1 - camera.radius/40));
		});
		*/

		camera.keysUp = [];
		camera.keysDown = [];
		camera.keysLeft = [];
		camera.keysRight = [];

		// TODO add key events for panning the camera

		camera.attachControl(canvas, false, false);

		// camera panning limits
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
	};

	SceneFactory.prototype.setupEnvironment = function(scene){
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
	};

	SceneFactory.prototype.registerEvents = function(scene){
		var _this = this;

		this.canvas.addEventListener("pointerup", function () {
			var pickResult = scene.pick(scene.pointerX, scene.pointerY),
				terrainTilesService = TerrainTilesService.getInstance(),
				selectDisc = terrainTilesService.getSelectDisc();
			if(selectDisc) {
				selectDisc.isVisible = true;
				if (pickResult.hit && pickResult.pickedMesh && selectDisc) {
					ko.postbox.publish("selectedMesh", pickResult.pickedMesh.uniqueId);
					selectDisc.position = pickResult.pickedMesh.position.clone();
					selectDisc.position.y = 0.005;
				}
			}
		});

		var step = 0;
		this.canvas.addEventListener("pointermove", function () {
			if(step === 0) {
				var pickResult = scene.pick(scene.pointerX, scene.pointerY, function(){
					return true;
				}, true);
				var terrainTilesService = TerrainTilesService.getInstance(),
					hoverDisc = terrainTilesService.getHoverDisc();
				if(hoverDisc) {
					hoverDisc.isVisible = true;
					if (pickResult.hit && pickResult.pickedMesh && hoverDisc) {
						hoverDisc.position = pickResult.pickedMesh.position.clone();
						hoverDisc.position.y = 0.006;
					}
				}
			}
			step = (step + 1) % 3;
		});

		window.addEventListener("resize", function () {
			_this.engine.resize();
		});

		//document.addEventListener("contextmenu", function(e){
		//	e.preventDefault();
		//}, false);
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


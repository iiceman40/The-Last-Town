define(['babylonjs', 'pepjs', 'knockout', 'TerrainTilesService', 'TilesRenderService'], function (bjs, pepjs, ko, TerrainTilesService, TilesRenderService) {
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

		camera.lowerRadiusLimit = 17;
		camera.upperRadiusLimit = 80;
		camera.panningSensibility = 100;

		// scene.registerBeforeRender(function(){
		// 	camera.upperBetaLimit = Math.max(0.01, 1.5 * (1 - camera.radius/40)) + 0.3;
		// 	camera.lowerBetaLimit = Math.max(0.01, 1.5 * (1 - camera.radius/40));
		// });

		camera.keysUp = [];
		camera.keysDown = [];
		camera.keysLeft = [];
		camera.keysRight = [];

		// camera.panningAxis = new BABYLON.Vector3(1, 0, 1);
		// camera.inertialPanningX = 0;
		// camera.inertialPanningY = 0;

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
		light.intensity = 1;
		//light.diffuse = new BABYLON.Color3(0.6,0.4,0);
		//light.specular = new BABYLON.Color3(1,0.6,0);

		var ambientLight = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(1, -1, 0), scene);
		ambientLight.intensity = 1;
		//ambientLight.diffuse = new BABYLON.Color3(0.6,0.4,0);
		//ambientLight.specular = new BABYLON.Color3(1,0.6,0);

		//scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
		//scene.fogStart = 40.0;
		//scene.fogEnd = 60.0;

		// ko.postbox.subscribe("worldTime", function(newValue) {
		// 	ambientLight.intensity = 1 - Math.pow(newValue - 12, 2) / 240;
		// 	ambientLight.diffuse.g = 1 - Math.pow(newValue - 12, 2) / 240;
		// 	ambientLight.diffuse.b = 1 - Math.pow(newValue - 12, 2) / 240;
		// });
	};

	// TODO move events to another class??
	SceneFactory.prototype.registerEvents = function(scene){
		var _this = this,
			pointerPosition = {};

		this.canvas.addEventListener("pointerdown", function () {
			pointerPosition = {x: scene.pointerX, y: scene.pointerY};
		});
		this.canvas.addEventListener("pointerup", function () {
			var pickResult = scene.pick(scene.pointerX, scene.pointerY),
				clickIntended = Math.abs(scene.pointerX - pointerPosition.x) + Math.abs(scene.pointerY - pointerPosition.y) < 10;

			if (pickResult.hit && pickResult.pickedMesh && clickIntended) {
				ko.postbox.publish("selectTile", {
					meshName:     pickResult.pickedMesh.name,
					meshFaceId:   pickResult.faceId,
					meshPosition: pickResult.pickedMesh.position
				});
			}
		});

		/*
		var step = 0;
		this.canvas.addEventListener("pointermove", function () {
			if(step ===0) {
				var pickResult = scene.pick(scene.pointerX, scene.pointerY),
					terrainTilesService = TerrainTilesService.getInstance(),
					tilesRenderService = TilesRenderService.getInstance(),
					hoverDisc = terrainTilesService.getHoverDisc();

				if (pickResult.hit && pickResult.pickedMesh && hoverDisc) {
					hoverDisc.isVisible = true;

					var SPS = tilesRenderService.solidParticleSystemsByMeshName[pickResult.pickedMesh.name];

					var meshFaceId = pickResult.faceId;
					if (meshFaceId === -1 || SPS === undefined) {
						return;
					}
					var idx = SPS.pickedParticles[meshFaceId].idx;
					var p = SPS.particles[idx];

					//ko.postbox.publish("selectedMesh", pickResult.pickedMesh.uniqueId);
					hoverDisc.position = p.position.clone().add(pickResult.pickedMesh.position);
					hoverDisc.position.y = 0.01;
				}
			}
			step = (step + 1) % 3;
		});
		*/

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


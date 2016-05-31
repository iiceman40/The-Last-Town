define([
	'TilesRenderService', 'TileDecorationsRenderService', 'babylonjs'
], function (
	TilesRenderService, TileDecorationsRenderService, bjs
) {
	var instance = null;

	var RenderService = function () {
		this.models = {};
		this.babylonViewModel = null;
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();
	};

	RenderService.prototype.initMap = function(map, babylonViewModel){
		var _this = this;
		this.scene = babylonViewModel.scene;
		this.babylonViewModel = babylonViewModel;

		// TODO use asset manager for textures and models
		// TODO use asset manager and prepare only one when loading game and not for each map
		BABYLON.SceneLoader.ImportMesh("townhall", "assets/models/improvements/", "houses.babylon", _this.scene, function (newMeshes, particleSystems) {
			_this.models.townhall = newMeshes[0];
			_this.models.townhall.scaling = new BABYLON.Vector3(0.46, 0.46, 0.46);
			_this.models.townhall.layerMask = 0;
			_this.models.townhall.freezeWorldMatrix();
		});

		BABYLON.SceneLoader.ImportMesh("trees", "assets/models/trees/", "trees.babylon", _this.scene, function (newMeshes, particleSystems) {
			_this.models.trees = newMeshes[0];
			//_this.tileDecorationsRenderService.renderTileDecorations();
			_this.tilesRenderService.renderTiles(map, babylonViewModel);
		});
	};

	RenderService.prototype.initPlayers = function(players, babylonViewModel){
		// TODO init player avatars
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new RenderService();
			}
			return instance;
		}
	};
});

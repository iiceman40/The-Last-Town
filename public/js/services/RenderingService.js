define([
	'TilesRenderService', 'TileDecorationsRenderService', 'babylonjs'
], function (
	TilesRenderService, TileDecorationsRenderService, bjs
) {
	var instance = null;

	var RenderService = function () {
		this.models = {};
		this.assetsInitialized = false;
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();
	};

	RenderService.prototype.initAssets = function(babylonJsViewModel, callback){
		if(!this.assetsInitialized) {
			var _this = this,
				scene = babylonJsViewModel.scene,
				assetsManager = new BABYLON.AssetsManager(scene),
				improvementsTask = assetsManager.addMeshTask('improvements task', "townhall", "assets/models/improvements/", "houses.babylon"),
				decorationsTask = assetsManager.addMeshTask('decorations task', "trees", "assets/models/trees/", "trees.babylon");

			improvementsTask.onSuccess = function(task){
				_this.models.townhall = task.loadedMeshes[0];
				_this.models.townhall.scaling = new BABYLON.Vector3(0.46, 0.46, 0.46);
				_this.models.townhall.layerMask = 0;
				_this.models.townhall.freezeWorldMatrix();
			};

			decorationsTask.onSuccess = function (task) {
				_this.models.trees = task.loadedMeshes[0];
			};

			assetsManager.onFinish = function (task) {
				console.log('assets loaded', _this.models);
				_this.assetsInitialized = true;
				callback.call();
			};

			assetsManager.load();
		}
	};

	RenderService.prototype.initMap = function(babylonViewModel){
		var _this = this;

		if(!_this.assetsInitialized){
			_this.initAssets(babylonViewModel, function(){
				_this.renderMap(babylonViewModel);
			});
		}

	};

	RenderService.prototype.renderMap = function(babylonViewModel){
		this.tileDecorationsRenderService.renderTileDecorations(babylonViewModel);
		this.tilesRenderService.renderTiles(babylonViewModel);
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

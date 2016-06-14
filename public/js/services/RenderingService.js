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
				decorationsTask = assetsManager.addMeshTask('decorations task', "tree", "assets/models/trees/", "tree_simple.babylon");

			improvementsTask.onSuccess = function(task){
				_this.models.townhall = task.loadedMeshes[0];
				_this.models.townhall.scaling = new BABYLON.Vector3(0.46, 0.46, 0.46);
				_this.models.townhall.layerMask = 0;
				_this.models.townhall.isPickable = false;
				_this.models.townhall.freezeWorldMatrix();
			};

			decorationsTask.onSuccess = function (task) {
				_this.models.tree = task.loadedMeshes[0];
				_this.models.tree.layerMask = 0;
				_this.models.tree.isPickable = false;
				_this.models.tree.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
				_this.models.tree.bakeCurrentTransformIntoVertices();
			};

			assetsManager.onFinish = function (task) {
				_this.assetsInitialized = true;
				babylonJsViewModel.models = _this.models;
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
		} else {
			_this.renderMap(babylonViewModel);
		}

	};

	RenderService.prototype.renderMap = function(babylonViewModel){
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

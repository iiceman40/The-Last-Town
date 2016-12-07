define([
	'TilesRenderService', 'TileDecorationsRenderService', 'MaterialsService', 'CameraService', 'babylonjs'
], function (
	TilesRenderService, TileDecorationsRenderService, MaterialsService, CameraService, bjs
) {
	var instance = null;

	/**
	 *
	 * @constructor
	 */
	var RenderService = function () {
		this.models = {};
		this.assetsInitialized = false;
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();
		this.materialsService = MaterialsService.getInstance();
	};

	/**
	 *
	 * @param babylonViewModel
	 * @param callback
	 */
	RenderService.prototype.initAssets = function(babylonViewModel, callback){
		if(!this.assetsInitialized) {
			var _this = this,
				scene = babylonViewModel.scene,
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
				babylonViewModel.models = _this.models;
				callback.call();
			};

			assetsManager.load();
		}
	};

	/**
	 *
	 * @param babylonViewModel
	 */
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

	/**
	 *
	 * @param babylonViewModel
	 */
	RenderService.prototype.renderMap = function(babylonViewModel){
		this.tilesRenderService.renderTiles(babylonViewModel);
	};

	/**
	 *
	 * @param {BabylonViewModel} babylonViewModel
	 */
	RenderService.prototype.initPlayers = function(babylonViewModel){
		var _this   = this,
			/** @type {BABYLON.Scene} scene */
			scene   = babylonViewModel.scene,
			/** @type {GameViewModel} game */
			game    = babylonViewModel.currentGame(),
			map     = game.map(),
			players = game.players();

		console.log({game: game, map: map, players: players});

		// offset of the map - TODO move to some kind of map service?
		var startPosition = new BABYLON.Vector3(
			-map.width * babylonViewModel.settings.hexagonSize / 2,
			0,
			-map.height * babylonViewModel.settings.hexagonSize / 2
		);

		for(var i = 0; i < players.length; i++) {
			var player = players[i],
				playerAvatar = BABYLON.MeshBuilder.CreateBox('playerAvatar', {size: 0.5, height: 2}, scene),
				tile = map.matrix[player.position().y][player.position().x];

			playerAvatar.material = _this.materialsService.materials.select;

			// place player avatar - TODo put in separate function placePlayerOnTile ... in tile service? player service?
			playerAvatar.position = tile.position.add(startPosition);
			playerAvatar.position.x += 0.7;
			playerAvatar.position.z -= 0.7;
			playerAvatar.position.y += tile.position.y;

			player.avatar = playerAvatar;

			// TODO create and retrieve player from global currentPlayer observable/postBox
			if (player.user() === babylonViewModel.user()._id()) {
				var cameraService = CameraService.getInstance({
					babylonViewModel: babylonViewModel
				});
				cameraService.centerOnPlayer(player);
			}
		}
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

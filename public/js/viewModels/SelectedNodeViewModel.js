'use strict';

define(['knockout', 'RenderingService'], function (ko, RenderingService) {
	var SelectedNodeViewModel = function (data, terrainTileInstance, editMapViewModel) {
		var _this = this;

		this.terrain = ko.observable(data.terrain);
		this.x = ko.observable(data.x);
		this.y = ko.observable(data.y);
		this.z = ko.observable(data.z);

		this.terrainTileInstance = terrainTileInstance;
		this.babylonViewModel = editMapViewModel.babylonViewModel;
		this.scene = editMapViewModel.scene;
		this.renderingService = RenderingService.getInstance();

		// TODO edit improvements

		this.terrain.subscribe(function () {
			var position = _this.terrainTileInstance.position.clone();

			if (_this.terrainTileInstance.tileDecoration instanceof BABYLON.InstancedMesh) {
				_this.terrainTileInstance.tileDecoration.dispose();
			}
			_this.terrainTileInstance.dispose();

			var terrainTypeIndex = _this.terrain();
			var selectedTerrainTile = _this.babylonViewModel.terrainTiles[terrainTypeIndex];

			_this.terrainTileInstance = selectedTerrainTile.createInstance(terrainTypeIndex + '-' + _this.x + '-' + _this.y);
			position.y = _this.terrainTileInstance.position.y;

			_this.terrainTileInstance.position = position;
			_this.terrainTileInstance.mapNode = data;

			if (terrainTypeIndex === 'forest') {
				_this.renderingService.createForestTerrainTileDecoration(_this.terrainTileInstance);
			}

			_this.babylonViewModel.octree = _this.scene.createOrUpdateSelectionOctree();

			// TODO send tile update information to server
		})
	};

	return SelectedNodeViewModel;
});
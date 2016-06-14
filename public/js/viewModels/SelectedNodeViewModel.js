'use strict';

define(['knockout', 'RenderingService', 'TilesRenderService', 'TileDecorationsRenderService', 'underscore'],
	function (ko, RenderingService, TilesRenderService, TileDecorationsRenderService, _) {
	var SelectedNodeViewModel = function (data, particle, editMapViewModel) {
		var _this = this;

		this.terrain = ko.observable(data.terrain);
		this.x = ko.observable(data.x);
		this.y = ko.observable(data.y);
		this.z = ko.observable(data.z);

		this.babylonViewModel = editMapViewModel.babylonViewModel;
		this.scene = editMapViewModel.scene;
		this.renderingService = RenderingService.getInstance();
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();

		// TODO make improvements editable

		this.previousTerrainType = this.terrain();
		this.terrain.subscribe(function (newTerrainType) {
			if(!_this.babylonViewModel.map.indexedTiles.hasOwnProperty(newTerrainType)){
				_this.babylonViewModel.map.indexedTiles[newTerrainType] = [];
			}

			var previousIndexTiles = _this.babylonViewModel.map.indexedTiles[_this.previousTerrainType],
				tileIndexInPreviousIndexTiles = previousIndexTiles.indexOf(data);

			previousIndexTiles.splice(tileIndexInPreviousIndexTiles, 1);

			var newIndexTiles = _this.babylonViewModel.map.indexedTiles[newTerrainType];

			data.terrain = newTerrainType;
			newIndexTiles.push(data);


			// get old terrain type SPS
			var previousTerrainTypeMeshName = 'SPS_' + _this.previousTerrainType,
				previousTerrainSPS = _this.tilesRenderService.solidParticleSystemsByMeshName[previousTerrainTypeMeshName],
				previousTerrainMesh = _this.scene.getMeshByName(previousTerrainTypeMeshName);

			// hide this particle
			//particle.scale.x = 0;
			//particle.scale.y = 0;
			//particle.scale.z = 0;

			//previousTerrainSPS.updateParticle(particle);
			//previousTerrainSPS.setParticles();

			// dispose SPS and mesh
			if(previousTerrainMesh) previousTerrainMesh.dispose();
			if(previousTerrainSPS) previousTerrainSPS.dispose();

			// rebuild SPS
			_this.tilesRenderService.buildSpsForTerrainType(_this.previousTerrainType, editMapViewModel.babylonViewModel.map);


			// get new terrain type SPS and dispose
			var newTerrainTypeMeshName = 'SPS_' + newTerrainType,
				newTerrainSPS = _this.tilesRenderService.solidParticleSystemsByMeshName[newTerrainTypeMeshName],
				newTerrainMesh = _this.scene.getMeshByName(newTerrainTypeMeshName);

			// dispose SPS and mesh
			if(newTerrainMesh) newTerrainMesh.dispose();
			if(newTerrainSPS) newTerrainSPS.dispose();

			// rebuild SPS
			_this.tilesRenderService.buildSpsForTerrainType(newTerrainType, editMapViewModel.babylonViewModel.map);

			// FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// TODO improve decorations - too slow and not clean - try chunks and refactor tileDecorationsService
			// FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			if(_this.previousTerrainType === 'forest' || newTerrainType === 'forest'){
				_this.babylonViewModel.forestSPS.dispose();
				_this.babylonViewModel.forestMesh.dispose();
				_this.tileDecorationsRenderService.renderTileDecorationsForTerrainType(
					'forest',
					_this.babylonViewModel.map,
					_this.tilesRenderService.options,
					_this.babylonViewModel
				);
			}

			// now that the terrain type has been changed set the new type as the previous type
			_this.previousTerrainType = newTerrainType;

			// TODO send tile update information to server
		})
	};

	return SelectedNodeViewModel;
});
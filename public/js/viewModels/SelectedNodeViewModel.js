'use strict';

define([
	'knockout', 'RenderingService', 'TilesRenderService', 'TileDecorationsRenderService', 'underscore'
], function (ko, RenderingService, TilesRenderService, TileDecorationsRenderService, _) {

	var SelectedNodeViewModel = function (data, particle, babylonViewModel) {
		var _this = this;

		this.tile = data;
		this.terrain = ko.observable(data.terrain);
		this.x = ko.observable(data.x);
		this.y = ko.observable(data.y);
		this.z = ko.observable(data.z);

		this.babylonViewModel = babylonViewModel;
		this.scene = babylonViewModel.scene;
		this.renderingService = RenderingService.getInstance();
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();

		this.oldTerrainType = this.terrain();

		this.terrain.subscribe(function (newTerrainType) {
			_this.updateTile(_this.oldTerrainType, newTerrainType);
			// TODO send tile update information to server
		});

		// TODO make improvements editable
	};

	/**
	 * @param oldTerrainType
	 * @param newTerrainType
	 */
	SelectedNodeViewModel.prototype.updateTile = function(oldTerrainType, newTerrainType){
		var _this = this;

		// determine the chunk the tile is in
		var oldChunkIndex = _this.tile.chunkIndex,
			oldChunk = _this.tilesRenderService.indexChunks[oldTerrainType][oldChunkIndex];

		console.log('old chunk', oldChunk, oldChunkIndex);

		// remove the tile from that chunk
		oldChunk.splice(oldChunk.indexOf(_this.tile), 1);

		// TODO move to separate method??
		// find enw chunk
		var newChunkIndex = -1;
		var newChunk = null;
		if(_this.tilesRenderService.indexChunks.hasOwnProperty(newTerrainType)) {
			var chunks = _this.tilesRenderService.indexChunks[newTerrainType];
			for (var chunkIndex in chunks) {
				if(chunks.hasOwnProperty(chunkIndex)) {
					var chunk = chunks[chunkIndex];
					if(chunk.length < _this.tilesRenderService.maxChunkSize){
						newChunkIndex = chunkIndex;
						newChunk = chunk;
						break;
					}
				}
			}
		} else {
			_this.tilesRenderService.indexChunks[newTerrainType] = {};
			newChunkIndex = 0;
			newChunk = [];
			_this.tilesRenderService.indexChunks[newTerrainType][newChunkIndex] = newChunk;
		}

		// add the tile to the new chunk
		newChunk.push(_this.tile);

		// init terrain type if it doesn't exist yet
		if(!_this.babylonViewModel.map.indexedTiles.hasOwnProperty(newTerrainType)){
			_this.babylonViewModel.map.indexedTiles[newTerrainType] = [];
		}

		var oldIndexTiles = _this.babylonViewModel.map.indexedTiles[_this.oldTerrainType],
			tileIndexInOldIndexTiles = oldIndexTiles.indexOf(_this.tile);

		oldIndexTiles.splice(tileIndexInOldIndexTiles, 1);

		var newIndexTiles = _this.babylonViewModel.map.indexedTiles[newTerrainType];

		// update the terrain in the the with the enw type
		_this.tile.terrain = newTerrainType;
		newIndexTiles.push(_this.tile);

		// now that the terrain type has been changed set the new type as the old type
		_this.tile.chunkIndex = newChunkIndex;

		// TODO get the SPS of the old chunk that previously contained the tile and dispose and re-render it
		this.reRenderSolidParticleSystem(oldTerrainType, oldChunkIndex);

		// TODO get the SPS of the new chunk that now contains the tile and dispose and re-render it
		this.reRenderSolidParticleSystem(newTerrainType, newChunkIndex);

		//_this.handleTileDecorations(oldTerrainType, newTerrainType); // FIXME update tile decorations doesn't work properly

		_this.oldTerrainType = newTerrainType;
	};

	/**
	 * @param terrainType
	 * @param chunkIndex
	 */
	SelectedNodeViewModel.prototype.reRenderSolidParticleSystem = function(terrainType, chunkIndex){
		// get terrain type SPS and dispose
		var _this = this,
			terrainTypeMeshName = 'SPS_' + terrainType + '_' + chunkIndex,
			terrainSPS = _this.tilesRenderService.solidParticleSystemsByMeshName[terrainTypeMeshName],
			terrainMesh = _this.scene.getMeshByName(terrainTypeMeshName);
		// dispose SPS and mesh
		if(terrainMesh) terrainMesh.dispose();
		if(terrainSPS) terrainSPS.dispose();
		// rebuild SPS
		_this.tilesRenderService.buildSpsForChunk(terrainType, chunkIndex);
	};

	/**
	 * TODO move to TileDecorationService?
	 * @param oldTerrainType
	 * @param newTerrainType
	 */
	SelectedNodeViewModel.prototype.handleTileDecorations = function(oldTerrainType, newTerrainType){
		var _this = this;

		// FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// TODO improve decorations - too slow and not clean - try chunks and refactor tileDecorationsService
		// FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		if(oldTerrainType === 'forest' || newTerrainType === 'forest'){

			// TODO get the right chunk to dispose and re-render
			_this.babylonViewModel.forestSPS.dispose();
			_this.babylonViewModel.forestMesh.dispose();

			// TODO if old one was forest, remove it from the chunk

			// TODO if new one is forest
			// TODO decide where to add the new decoration
			// TODO check if a chunk with less items than max chunk size is available
			// TODO if all chunks are full, create a new chunk
			// TODO set the decoration chunk index

			_this.tileDecorationsRenderService.renderTileDecorationsForChunk(
				_this.tile.decorationChunkIndex, // FIXME this only works if the tile already was in a chunk
				_this.tilesRenderService.options,
				_this.babylonViewModel
			);
		}
	};

	return SelectedNodeViewModel;
});
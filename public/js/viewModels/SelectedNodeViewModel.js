'use strict';

define([
	'knockout', 'RenderingService', 'TilesRenderService', 'DecorationsRenderService', 'underscore'
], function (ko, RenderingService, TilesRenderService, DecorationsRenderService, _) {

	/**
	 *
	 * @param { {terrain: (string), x: (int), y: (int), z: (int), chunkIndex: (int)} } data
	 * @param {{}} particle
	 * @param {{}} babylonViewModel
	 * @constructor
	 */
	var SelectedNodeViewModel = function (data, particle, babylonViewModel) {
		var _this = this;

		this.tile = data;
		this.terrain = ko.observable(data.terrain);
		this.altitude = ko.observable(data.altitude);
		this.x = ko.observable(data.x);
		this.y = ko.observable(data.y);
		this.z = ko.observable(data.z);

		this.particle = particle;

		this.chunkIndex = ko.observable(data.chunkIndex);

		this.babylonViewModel = babylonViewModel;
		this.scene = babylonViewModel.scene;
		this.renderingService = RenderingService.getInstance();
		this.tilesRenderService = TilesRenderService.getInstance();
		this.tileDecorationsRenderService = DecorationsRenderService.getInstance();

		this.oldTerrainType = this.terrain();

		this.terrain.subscribe(function (newTerrainType) {
			_this.updateTile(_this.oldTerrainType, newTerrainType);
			// TODO send tile update information to server
		});

		this.altitude.subscribe(function (newAltitude) {
			_this.tile.altitude = newAltitude;
			_this.updateTile();
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

		oldTerrainType = oldTerrainType || _this.terrain();
		newTerrainType = newTerrainType || _this.terrain();

		// determine the chunk the tile is in
		var oldChunkIndex = _this.tile.chunkIndex,
			oldChunk = _this.tilesRenderService.indexedChunks[oldTerrainType][oldChunkIndex];

		// remove the tile from that chunk
		oldChunk.splice(oldChunk.indexOf(_this.tile), 1);

		// add the tile to the new chunk
		var newChunkIndex = _this.findNewChunkIndex(newTerrainType),
			newChunk = _this.tilesRenderService.indexedChunks[newTerrainType][newChunkIndex];
		newChunk.push(_this.tile);
		_this.chunkIndex(newChunkIndex);

		// init terrain type if it doesn't exist yet
		if(!_this.babylonViewModel.map.indexedTiles.hasOwnProperty(newTerrainType)){
			_this.babylonViewModel.map.indexedTiles[newTerrainType] = [];
		}

		// update the terrain in the the with the enw type
		_this.tile.terrain = newTerrainType;

		// now that the terrain type has been changed set the new type as the old type
		_this.tile.chunkIndex = newChunkIndex;

		// get the SPS of the old chunk that previously contained the tile and dispose and re-render it
		this.reRenderSolidParticleSystem(oldTerrainType, oldChunkIndex);

		// get the SPS of the new chunk that now contains the tile and dispose and re-render it
		this.reRenderSolidParticleSystem(newTerrainType, newChunkIndex);

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

		// FIXME SOME TILES GET LOST WHEN CHANGING TERRAINS - TRY WITH ONE OF THE BIG LAKES

		// TODO check if also a decoration SPS needs to be re-build
		_this.handleTileDecorations(terrainType, chunkIndex);
	};

	/**
	 *
	 * @param {string} newTerrainType
	 * @returns {number}
	 */
	SelectedNodeViewModel.prototype.findNewChunkIndex = function(newTerrainType){
		var _this = this,
			newChunkIndex = -1,
			newChunk = null;
		if(_this.tilesRenderService.indexedChunks.hasOwnProperty(newTerrainType)) {
			var chunks = _this.tilesRenderService.indexedChunks[newTerrainType];
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
			_this.tilesRenderService.indexedChunks[newTerrainType] = {};
			newChunkIndex = 0;
			newChunk = [];
			_this.tilesRenderService.indexedChunks[newTerrainType][newChunkIndex] = newChunk;
		}

		return newChunkIndex
	};

	/**
	 * @param terrainType
	 * @param chunkIndex
	 */
	SelectedNodeViewModel.prototype.handleTileDecorations = function(terrainType, chunkIndex){
		var _this = this,
			decorationsMeshName = 'SPS_' + terrainType + '_' + chunkIndex + '_decorations',
			decorationsSPS = _this.tileDecorationsRenderService.solidParticleSystemsByMeshName[decorationsMeshName],
			decorationsMesh = _this.scene.getMeshByName(decorationsSPS);

		if(decorationsSPS) decorationsSPS.dispose();
		if(decorationsMesh) decorationsMesh.dispose();

		_this.tileDecorationsRenderService.buildDecorationSpsForChunk(
			terrainType,
			chunkIndex,
			_this.tilesRenderService.indexedChunks,
			_this.tilesRenderService.babylonViewModel,
			_this.tilesRenderService.options
		);

	};

	/**
	 * converts the node to a data transfer object
	 */
	SelectedNodeViewModel.prototype.toDto = function() {
		return {
			tile: this.tile
		}
	};

	return SelectedNodeViewModel;
});
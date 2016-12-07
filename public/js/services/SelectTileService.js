define(
	[
		'babylonjs', 'SelectedNodeViewModel', 'TerrainTilesService', 'TilesRenderService'
	], function (bjs, SelectedNodeViewModel, TerrainTilesService, TilesRenderService) {
		var instance = null;

		/**
		 *
		 * @param { {babylonViewModel: ({})} } params
		 * @constructor
		 */
		var SelectTileService = function (params) {
			this.babylonViewModel = params.babylonViewModel;
			this.terrainTilesService = TerrainTilesService.getInstance();
			this.tilesRenderService = TilesRenderService.getInstance();
		};

		/**
		 * @param {{meshName: (string), meshFaceId: (number), meshPosition: (BABYLON.Vector3)}} data
		 * @return {SelectedNodeViewModel}
		 */
		SelectTileService.prototype.pickTileByParticleData = function (data) {
			var _this = this,
				selectDisc = this.terrainTilesService.getSelectDisc(),
				SPS = this.tilesRenderService.solidParticleSystemsByMeshName[data.meshName];

			if (data.meshFaceId == -1 || SPS === undefined) {
				console.log('SPS undefined', data.meshName)
			}

			var idx = SPS.pickedParticles[data.meshFaceId].idx,
				p = SPS.particles[idx];

			selectDisc.isVisible = true;
			selectDisc.position = p.position.clone().add(data.meshPosition);
			selectDisc.position.y = 0.005;

			return new SelectedNodeViewModel(p.tile, p, _this.babylonViewModel);
		};

		return {
			getInstance: function (params) {
				if (!instance) {
					instance = new SelectTileService(params);
				}
				return instance;
			}
		};
	});


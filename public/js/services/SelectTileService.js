define(
	[
		'babylonjs', 'SelectedNodeViewModel', 'TilesRenderService'
	], function (bjs, SelectedNodeViewModel, TilesRenderService) {
		var instance = null;

		/**
		 *
		 * @param { {babylonViewModel: ({})} } params
		 * @constructor
		 */
		var SelectTileService = function (params) {
			this.babylonViewModel = params.babylonViewModel;
			this.tilesRenderService = TilesRenderService.getInstance();
		};

		/**
		 * @param {{meshName: (string), meshFaceId: (number), meshPosition: (BABYLON.Vector3)}} data
		 * @return {SelectedNodeViewModel}
		 */
		SelectTileService.prototype.pickTileByParticleData = function (data) {
			var _this = this,
				SPS = this.tilesRenderService.solidParticleSystemsByMeshName[data.meshName];

			if (data.meshFaceId == -1 || SPS === undefined) {
				console.log('SPS undefined', data.meshName);
				return null;
			}

			var idx = SPS.pickedParticles[data.meshFaceId].idx,
				p = SPS.particles[idx];

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


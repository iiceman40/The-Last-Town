define(
	['babylonjs', 'PlayerViewModel'], function (bjs, PlayerViewModel) {
		var instance = null;

		/**
		 *
		 * @param { {babylonViewModel: ({})} } params
		 * @constructor
		 */
		var CameraService = function (params) {
			this.babylonViewModel = params.babylonViewModel;
		};

		/**
		 *
		 * @param {PlayerViewModel} player
		 */
		CameraService.prototype.centerOnPlayer = function(player) {
			var _this = this;
			if(player instanceof PlayerViewModel && player.avatar !== null) {
				/** @type {BABYLON.TargetCamera|BABYLON.Camera} activeCamera */
				var camera = _this.babylonViewModel.scene.activeCamera;
				camera.setTarget(player.avatar.position.clone());
			}
		};

		return {
			getInstance: function (params) {
				if (!instance) {
					instance = new CameraService(params);
				}
				return instance;
			}
		};
	});


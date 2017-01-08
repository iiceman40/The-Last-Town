define(
	['knockout', 'babylonjs', 'MaterialsService', 'SelectTileService', 'SelectedNodeViewModel'],
	function (ko, bjs, MaterialsService, SelectTileService, SelectedNodeViewModel) {
		var instance = null;

		/**
		 *
		 * @param { {babylonViewModel: ({})} } params
		 * @constructor
		 */
		var HighlightService = function (params) {
			var _this = this;

			this.babylonViewModel = params.babylonViewModel;
			this.scene            = this.babylonViewModel.scene;
			this.baseTileHeight   = this.babylonViewModel.settings.baseTileHeight;
			this.hexagonSize      = this.babylonViewModel.settings.hexagonSize;

			this.selectTileService = SelectTileService.getInstance();

			this.materialsService = MaterialsService.getInstance({
				scene: _this.scene
			});

			this.selectMarkerTypes = null;
			this.selectMarkerTypes = {
				default: null,
				mountain: null,
				cave: null
			};

			this.hoverMarker = null;
			this.hoverMarkerTypes = {
				default: null,
				mountain: null,
				cave: null
			};

			// ko.postbox.subscribe("hoverTile", function(data) {
			// 	var node = this.selectTileService.pickTileByParticleData(data);
			// 	if(node instanceof SelectedNodeViewModel) {
			// 		_this.hoverTile(node, data);
			// 	}
			// }, this);
		};

		/**
		 * @param node
		 * @param data
		 */
		HighlightService.prototype.selectTile = function(node, data) {
			if(this.selectMarker instanceof BABYLON.Mesh) {
				this.selectMarker.isVisible = false;
			}
			this.selectMarker = this.getMarker(node.terrain(), this.materialsService.materials.select);
			this.selectMarker.position = node.particle.position.clone().add(data.meshPosition);
			this.adjustMarkerToTerrainType(this.selectMarker, node.tile);
			this.selectMarker.isVisible = true;
		};

		/**
		 *
		 * @param marker
		 * @param tile
		 */
		HighlightService.prototype.adjustMarkerToTerrainType = function(marker, tile) {
			var tileHeight, yPosition, height, terrainType = tile.terrain;

			switch (terrainType) {
				case 'mountain':
					tileHeight = 3;
					yPosition = tileHeight / 2 + tile.altitude * 0.08 + 0.12;
					height = tileHeight + tile.altitude * 0.16 + 0.1;
					break;
				case 'cave':
					tileHeight = 1;
					yPosition = tileHeight / 2 + tile.altitude * 0.05;
					height = tileHeight + tile.altitude * 0.1 + 0.2;
					break;
				default:
					tileHeight = this.baseTileHeight * 0.1;
					yPosition = tileHeight / 2 + tile.altitude * 0.05;
					height = tileHeight + tile.altitude * 0.1 + 0.1;
			}

			marker.position.y = yPosition;
			marker.scaling.y = height;
		};

		/**
		 * @param node
		 * @param data
		 */
		HighlightService.prototype.hoverTile = function(node, data) {
			var _this = this;

			if(this.hoverMarker instanceof BABYLON.Mesh) {
				this.hoverMarker.isVisible = false;
			}
			this.hoverMarker = this.getMarker(node.terrain(), this.materialsService.materials.hover);
			this.hoverMarker.position = node.particle.position.clone().add(data.meshPosition);
			this.adjustMarkerToTerrainType(this.hoverMarker, node.tile);
			this.hoverMarker.isVisible = true;
		};

		/**
		 * TODO crate selection for paths
		 * @param {array} path
		 */
		HighlightService.prototype.selectPath = function(path) {
			var _this = this;
			console.log('TODO - implement selected path highlighting');
		};

		/**
		 *
		 * @param {string} terrainType
		 * @param {BABYLON.StandardMaterial} material
		 * @returns {BABYLON.Mesh}
		 */
		HighlightService.prototype.getMarker = function(terrainType, material){
			var marker = this.selectMarkerTypes.default;

			if(marker instanceof BABYLON.Mesh === false) {
				marker = this.initDefaultMarker(material);
			}

			if(terrainType === 'mountain') {
				marker = this.initMountainMarker(material);
			}

			if(terrainType === 'cave') {
				marker = this.initCaveMarker(material);
			}

			return marker;
		};

		/**
		 * @param {BABYLON.Material} material
		 * @returns {Mesh|*|null}
		 */
		HighlightService.prototype.initDefaultMarker = function(material) {
			var marker = BABYLON.Mesh.CreateCylinder(
				'selectMarker',         // name
				this.baseTileHeight,    // height
				this.hexagonSize + 0.2, // diameter top
				this.hexagonSize + 0.2, // diameter bottom
				6,                      // tessellation
				1,                      // subdivisions
				this.scene,             // scene
				false                   // updateable
			);
			marker.convertToFlatShadedMesh();
			marker.rotation.y = Math.PI / 2;
			marker.bakeCurrentTransformIntoVertices();
			marker.isPickable = false;
			marker.flipFaces();

			marker.material = material;

			marker.isVisible = false;
			return marker;
		};

		/**
		 * @param {BABYLON.Material} material
		 * @returns {Mesh}
		 */
		HighlightService.prototype.initMountainMarker = function(material){
			var marker = BABYLON.Mesh.CreateCylinder(
				'mountainSelectMarker',   // name
				this.baseTileHeight,      // height
				0,                        // diameter top
				this.hexagonSize + 0.2,   // diameter bottom
				6,                        // tessellation
				1,                        // subdivisions
				this.scene,               // scene
				false                     // updateable
			);
			marker.convertToFlatShadedMesh();
			marker.rotation.y = Math.PI / 2;
			marker.bakeCurrentTransformIntoVertices();
			marker.isPickable = false;
			marker.flipFaces();

			marker.material = material;

			marker.isVisible = false;
			return marker;
		};

		/**
		 * @param {BABYLON.Material} material
		 * @returns {Mesh}
		 */
		HighlightService.prototype.initCaveMarker = function(material){
			var marker = BABYLON.Mesh.CreateCylinder(
				'caveSelectMarker',     // name
				this.baseTileHeight,    // height
				this.hexagonSize/3*2 + 0.2, // diameter top
				this.hexagonSize + 0.2,     // diameter bottom
				6,                      // tessellation
				1,                      // subdivisions
				this.scene,             // scene
				false                   // updateable
			);
			marker.convertToFlatShadedMesh();
			marker.rotation.y = Math.PI / 2;
			marker.bakeCurrentTransformIntoVertices();
			marker.isPickable = false;
			marker.flipFaces();

			marker.material = material;

			marker.isVisible = false;
			return marker;
		};

		return {
			getInstance: function (params) {
				if (!instance) {
					instance = new HighlightService(params);
				}
				return instance;
			}
		};
	});


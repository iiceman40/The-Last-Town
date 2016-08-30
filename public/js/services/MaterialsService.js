define(['babylonjs'], function (bjs) {
	var instance = null;
	// TODO rename to factory

	var MaterialsService = function (params) {

		this.scene = params.scene;
		this.materials = {};

	};

	MaterialsService.prototype.initMaterials = function () {
		var _this = this;
		var scene = this.scene;

		this.materials.snow = new BABYLON.StandardMaterial('snowMaterial', scene);
		this.materials.snow.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.85);

		this.materials.grass = new BABYLON.StandardMaterial('grassMaterial', scene);
		this.materials.grass.diffuseColor = new BABYLON.Color3(0.25, 0.35, 0.15);
		this.materials.grass.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
		this.materials.grass.specularPower = 128;

		this.materials.forest = new BABYLON.StandardMaterial('forestMaterial', scene);
		this.materials.forest.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.1);
		this.materials.forest.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
		this.materials.forest.specularPower = 128;

		this.materials.stone = new BABYLON.StandardMaterial('stoneMaterial', scene);
		this.materials.stone.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		this.materials.stone.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
		this.materials.stone.specularPower = 128;

		this.materials.mountain = this.materials.stone;
		this.materials.cave = this.materials.stone;

		this.materials.mud = new BABYLON.StandardMaterial('mudMaterial', scene);
		this.materials.mud.diffuseColor = new BABYLON.Color3(0.2, 0.07, 0.0);
		this.materials.mud.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
		this.materials.mud.specularPower = 128;

		this.materials.dirt = new BABYLON.StandardMaterial('dirtMaterial', scene);
		this.materials.dirt.diffuseColor = new BABYLON.Color3(0.55, 0.31, 0.15);
		this.materials.dirt.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
		this.materials.dirt.specularPower = 128;

		this.materials.desert = new BABYLON.StandardMaterial('desertMaterial', scene);
		this.materials.desert.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.5);
		this.materials.desert.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
		this.materials.desert.specularPower = 128;

		this.materials.water = new BABYLON.StandardMaterial('waterMaterial', scene);
		this.materials.water.diffuseColor = new BABYLON.Color3(0.18, 0.18, 0.42);

		this.materials.mainTownTile = new BABYLON.StandardMaterial('mainTownTileMaterial', scene);
		this.materials.mainTownTile.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);
		this.materials.mainTownTile.emissiveColor = new BABYLON.Color3(0.2, 0, 0.5);

		this.materials.select  = new BABYLON.StandardMaterial('brightRedMaterial', scene);
		this.materials.select .diffuseColor = new BABYLON.Color3(0.5, 0, 0);
		this.materials.select .specularColor = new BABYLON.Color3(0, 0, 0);
		this.materials.select .emissiveColor = new BABYLON.Color3(1, 0, 0);

		this.materials.hover = new BABYLON.StandardMaterial('brightGreenMaterial', scene);
		this.materials.hover.diffuseColor = new BABYLON.Color3(0, 0.5, 0);
		this.materials.hover.emissiveColor = new BABYLON.Color3(0, 0.2, 0);

		this.materials.tree = new BABYLON.StandardMaterial('treeMaterial', scene);
		this.materials.tree.diffuseColor = new BABYLON.Color3(0.10, 0.20, 0.05);
		this.materials.tree.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
		this.materials.tree.specularPower = 32;

		return this.materials;
	};

	return {
		getInstance: function (params) {
			if (!instance) {
				instance = new MaterialsService(params);
			}
			return instance;
		}
	};
});


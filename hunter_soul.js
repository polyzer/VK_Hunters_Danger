/*
	Душа охотника нужна для того, чтобы уничтожить улей
*/
let HunterSoul = function (json_params)
{
	let json_params_names = [
		"Scene"
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.State = GAME_CONSTANTS.HUNTER_SOULS.HUNTER_SOUL.STATES.LIVE;
	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(GAME_CONSTANTS.HUNTER_SOULS.BLACK.INDEX);
	this.BBox = new THREE.Box3();
};

HunterSoul.prototype.setPosition = function (position)
{
	this.Mesh.position.copy(position);
};

HunterSoul.prototype.getBBox = function ()
{
	this.BBox.setFromObject(this.Mesh);
	return this.BBox;
};

HunterSoul.prototype.getMesh = function ()
{
	return this.Mesh;
};

HunterSoul.prototype.getState = function ()
{
	return this.State;
};

HunterSoul.prototype.update = function ()
{
	this.Mesh.rotation.y += 0.01;
};
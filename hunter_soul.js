/*
	Душа охотника нужна для того, чтобы уничтожить улей
*/
var HunterSoul = function (json_params)
{
	var json_params_names = [
		"Scene"
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(GAME_CONSTANTS.HUNTER_SOULS.BLACK.INDEX);
};

HunterSoul.prototype.getMesh = function ()
{
	return this.Mesh;
};
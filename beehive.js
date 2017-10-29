/*
	Из улья появляются новые охотники!
	Для каждого из них определяется своя скорость создания охотников.
	Всё будет зависеть от типа улья.
*/
var Beehive = function (json_params)
{
	var json_params_names = [
		"Scene",
		"StartPosition",
		"LocalUserMeshPosition",
		"PlayerAttackCallback"
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(GAME_CONSTANTS.BEEHIVES.BLACK.INDEX);
	this.Mesh.position.copy(this.StartPosition);
	this.Health = GAME_CONSTANTS.BEEHIVES.BLACK.HEALTH.MAX;
	this.State = GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.LIVE;
	
	this.HunterIndex = GAME_CONSTANTS.HUNTERS.BLACK.INDEX;
	this.Hunter = null;
	/*Время, по прошествию которого, должен создаваться*/
	this.TimeToCreateHunter = GAME_CONSTANTS.BEEHIVES.BLACK.TIME_TO_CREATE_HUNTER_SEC;

	this.BBox = new THREE.Box3();
	this.Scene.add(this.Mesh);
};
/*
Обрабатывается в основном цикле программы.
*/
Beehive.prototype.update = function (delta)
{
	this.TimeToCreateHunter -= delta;
	if(this.TimeToCreateHunter <= 0)
	{
		this.createHunter();
		this.TimeToCreateHunter = GAME_CONSTANTS.BEEHIVES.BLACK.TIME_TO_CREATE_HUNTER_SEC;
	}
	this.controlHealth();
};

Beehive.prototype.getState = function ()
{
	return this.State;
};

Beehive.prototype.onHit = function (json_params)
{
	if(json_params)
	{
		if(json_params.Damage)
		{
			this.Health -= json_params.Damage;
		}
	}
};

Beehive.prototype.getBBox = function ()
{
	return this.BBox.setFromObject(this.Mesh);
};

Beehive.prototype.createHunter = function ()
{
	this.Hunter = new Hunter({
		Scene: this.Scene, 
		LocalUserMeshPosition: this.LocalUserMeshPosition,
		StartPosition: this.Mesh.position.clone(),
		AttackCallback: this.PlayerAttackCallback
	});
	this.State = GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.HUNTER_CREATED;
};

Beehive.prototype.getHunter = function ()
{
	if(	this.State === GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.HUNTER_CREATED){
		this.State = GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.LIVE;
	}
	return this.Hunter;
};

Beehive.prototype.controlHealth = function ()
{
	if(this.Health <= 0)
	{
		this.State = GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.DEAD;
	}
};


Beehive.prototype.getMesh = function ()
{
	return this.Mesh;
};

Beehive.prototype.setMesh = function (mesh)
{
	this.Mesh = mesh;
};
/*
	Какая-то странная функция, похоже, что отвечает за то,
	в каком углу куба будет создан охотник!
*/
Beehive.prototype.getRandomMinusMult = function ()
{
	var multip = -1;
	if(Math.round(Math.random()) === 1)
	{
		multip = multip*multip;
	}
	return multip;	
}

/*
Охотятся за юзером.
Питаются его Энергией.
На самом деле, при попадании в игрока, игрок вылетает из игры.
*/
var Hunter = function (json_params)
{
	var json_params_names = [
		"Scene", //Сцена, в которую будет добавлен Hunter
		"LocalUserMeshPosition", //Mesh.position пользователя
		"StartPosition", //Позиция, с которой будет появляться Охотник
		"AttackCallback" //Это колбек, который будет вызван при атаке
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(GAME_CONSTANTS.HUNTERS.BLACK.INDEX);
	this.Health = GAME_CONSTANTS.HUNTERS.BLACK.HEALTH.MAX;
	this.State = GAME_CONSTANTS.HUNTERS.HUNTER.STATES.LIVE;
	this.Speed = Math.random() * (GAME_CONSTANTS.HUNTERS.BLACK.SPEED.MAX - GAME_CONSTANTS.HUNTERS.BLACK.SPEED.MIN) +
		GAME_CONSTANTS.HUNTERS.BLACK.SPEED.MIN;
	this.Damage = 100;
	this.Index = GAME_CONSTANTS.HUNTERS.BLACK.INDEX;


	this.Mesh.position.copy(this.StartPosition);

	this.Soul = new HunterSoul({Scene: this.Scene});

	this.TargetMovingTimeBorder = 3;
	this.RandomMovingTimeBorder = 1;
	this.MovingTimeCounter = 0;
	this.RandomMovingVector = new THREE.Vector3();

	this.BoundingRadius = 500;
	this.BBox = new THREE.Box3();
	this.MovingType = 0;
	this.Scene.add(this.Mesh);
};

Hunter.prototype.getSoul = function ()
{
	return this.Soul;
};

Hunter.prototype.onHit = function (json_params)
{
	if(json_params)
	{
		if(json_params.Damage)
		{
			this.Health -= json_params.Damage;
		}
	}
};

Hunter.prototype.getState = function ()
{
	return this.State;
};

Hunter.prototype.getBBox = function ()
{
	return this.BBox.setFromObject(this.Mesh);
};

/*
Обрабатывается в основном цикле программы.
*/
Hunter.prototype.update = function (delta)
{
	this.move(delta);
	this.controlHealth();
};

Hunter.prototype.controlHealth = function ()
{
	if(this.Health <= 0)
	{
		this.State = GAME_CONSTANTS.HUNTERS.HUNTER.STATES.DEAD;
	}
};

Hunter.prototype.move = function (mul)
{
	var distTo = this.Mesh.position.distanceTo(this.LocalUserMeshPosition);
	if(distTo < this.BoundingRadius)
	{
		this.AttackCallback({Damage: this.Damage});
	}
	var temp_v = this.LocalUserMeshPosition.clone();
	if(this.MovingType === 0)
	{	
		temp_v.sub(this.Mesh.position);
		temp_v.normalize();
		temp_v.multiplyScalar(mul*1000);
		this.Mesh.position.add(temp_v);
		this.Mesh.lookAt(this.LocalUserMeshPosition);
		console.log(this.Mesh.position);
		this.MovingTimeCounter += mul;
		if(this.MovingTimeCounter > this.TargetMovingTimeBorder)
		{
			this.RandomMovingVector.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
			this.RandomMovingVector.multiplyScalar(mul);
			this.MovingTimeCounter = 0;
			this.MovingType = 1;				
		}
	} else
	{
		this.Mesh.position.add(this.RandomMovingVector);			
		this.MovingTimeCounter += mul;
		if(this.MovingTimeCounter > this.RandomMovingTimeBorder)
		{
			this.MovingTimeCounter = 0;
			this.MovingType = 0;				
		}
	}
};

Hunter.prototype.getMesh = function ()
{
	return this.Mesh;
};

Hunter.prototype.setMesh = function (mesh)
{
	this.Mesh = mesh;
};
/*
	Какая-то странная функция, похоже, что отвечает за то,
	в каком углу куба будет создан охотник!
*/
Hunter.prototype.getRandomMinusMult = function ()
{
	var multip = -1;
	if(Math.round(Math.random()) === 1)
	{
		multip = multip*multip;
	}
	return multip;	
}

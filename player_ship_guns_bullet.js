
let Bullet = function (json_params)
{	
	let json_params_names = [
	//Направление полёта
		"Direction",	//Позиция, с которой летит патрон
		"StartPosition"
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Distance = 15000;
	this.Speed = 10000;
	this.MeshIndex = GAME_CONSTANTS.BULLETS.GREEN_PLASMA.INDEX;
	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(this.MeshIndex);
	this.Damage = 500;

	this.Mesh.position.copy(this.StartPosition);
	this.BBox = new THREE.Box3();
	this.BBox.setFromObject(this.Mesh);
	
	this.State = GAME_CONSTANTS.BULLETS.BULLET.STATES.LIVE;		
};

Bullet.prototype.getDamage = function ()
{
	return this.Damage;
};

Bullet.prototype.getBBox = function ()
{
	return this.BBox.setFromObject(this.Mesh);
};

Bullet.prototype.getMesh = function ()
{
	return this.Mesh;
};

Bullet.prototype.onHit = function ()
{
	this.State = GAME_CONSTANTS.BULLETS.BULLET.STATES.DEAD;
};

Bullet.prototype.addToScene = function (scene)
{
	scene.add(this.Mesh);
};

Bullet.prototype.removeFromScene = function (scene)
{
	scene.remove(this.Mesh);
};

Bullet.prototype.update = function (delta)
{
	this.BBox.setFromObject(this.Mesh);
	this.move(delta);
};

Bullet.prototype.move = function (time_delta)
{
	if(this.Distance > 0)
	{
		let del = this.Speed * time_delta;
		let vec = this.Direction.clone();
		vec.multiplyScalar(del);
		this.Mesh.position.add(vec);
		this.Distance -= vec.length();
	}else
	{
		this.State = GAME_CONSTANTS.BULLETS.BULLET.STATES.DEAD;
	}

};

Bullet.prototype.setState = function (status)
{
	if(status !== undefined)
		this.State = status;
	else
		throw new Error("have no status");
};

Bullet.prototype.getState = function ()
{
	return this.State;
};
/*Отслеживает попадание в противников
 *В работе учитываем всех мешей: RemotePlayers.length + LocalPlayer
 */
Bullet.prototype.collisionControl = function ()
{
	if(this.BBox.intersectsBox(this.AllPlayers[0].getShip().BBox))
	{
		if(this.AllPlayers[0].ID === this.OwnerID)
			return;
		this.AllPlayers[0].getShip().onDamaged({damage: this.Damage});
		this.setStatus("dead");
		return;
	}
	
	for(let i=0; i<this.AllPlayers[1].length; i++)
	{
		if(this.BBox.intersectsBox(this.AllPlayers[1][i].getShip().BBox))
		{
			if(this.AllPlayers[1][i].ID === this.OwnerID)
				return;

			this.AllPlayers[1][i].getShip().onDamaged({damage: this.Damage});
			this.setStatus("dead");
			return;
		}
	}
	
};

let GreenPlasmaBullet = Bullet;

let RedPlasmaBullet = function ()
{
	let json_params_names = [
	//Направление полёта
		"Direction",	//Позиция, с которой летит патрон
		"StartPosition"
	];

	setParametersByArray.call(this, json_params, json_params_names);

	this.Distance =  10000;
	this.Speed =  8000;
	this.MeshIndex = GAME_CONSTANTS.BULLETS.RED_PLASMA.INDEX;
	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByMeshIndex(this.MeshIndex);

	this.BBox = new THREE.Box3();
	this.BBox.setFromObject(this.Mesh);
	
	this.Status = "live";			
};

RedPlasmaBullet.prototype = Object.create(Bullet.prototype);
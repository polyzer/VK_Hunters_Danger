/*
 * Класс описывает куб, которым будет управлять игрок (удаленный - remote, местный - local)
 * В объект может передаваться камера - в случае, когда кораблем управляет локальный игрок
 * Для удаленного игрока передавать камеру не нужно!
 * */


var PlayerShip = function (json_params)
{	
	var json_params_names = [
		"Scene", 
		"Camera"
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Geometry = new THREE.BoxBufferGeometry(200, 200, 200);
	this.Material = new THREE.MeshStandardMaterial({emissive: "#57d9ff"});
	
	this.State = "live"; // ("live", "dead")
	
	this.Health = 500; // 
	this.Bullets = [];


	this.BulletsCounter = GLOBAL_OBJECTS.getBulletsCounterDiv();
	this.BulletsCounter.appendChild(document.createTextNode("0"));
	// Для локального игрока
	if(this.Camera !== null)
	{
		this.ShipMesh = new THREE.Mesh(this.Geometry, this.Material);		
		this.Mesh = new THREE.Object3D();
		this.Mesh.position.set(0,0,0);
		this.ShipMesh.position.set(0, 0, 0);
		this.BBox = new THREE.Box3();
		this.BBox.setFromObject(this.ShipMesh);	
		
		this.Camera.position.copy(this.ShipMesh.position);
		
		this.Camera.position.y = this.ShipMesh.position.y + 400;
		this.Camera.position.z = this.ShipMesh.position.z + 400;
		var vec = this.Mesh.getWorldDirection();
		vec.z -= 400;
		this.Camera.lookAt(vec);
		this.Mesh.add(this.ShipMesh);
		this.Mesh.add(this.Camera);
	}	else
	// Для удаленного игрока
	{
		this.Mesh = new THREE.Mesh(this.Geometry, this.Material);
		this.BBox = new THREE.Box3();
		this.BBox.setFromObject(this.Mesh);	
	}

	this.AvailableAmmunition = [{Count: 1000, Bullet: GreenPlasmaBullet}];
	this.Gun = new PlasmaGun({
		Scene: this.Scene,
		StartPosition: this.Mesh.position,
		AvailableAmmunition: this.AvailableAmmunition,
		Bullets: this.Bullets
	});
	
	this.Scene.add(this.Mesh);
//	this.Scene.add(this.BBox);

};

PlayerShip.prototype.getBullets = function ()
{
	return this.Bullets;
};

PlayerShip.prototype.getBulletsCount = function ()
{
	return this.Gun.getBulletsCount();
};

/*Функция возвращает стандартные параметры с установленным параметром position;
 */

PlayerShip.prototype.getBulletParametersByGunAndBulletTypes = function (json_params)
{
	var ret = {};
	if(json_params.gun_type === "plasma_gun")
	{
		ret = this.Gun.getBulletParametersByBulletType(json_params);
		ret.gun_type = "plasma_gun";
		ret.start_position = this.getPosition();
		return ret;
	}
};

PlayerShip.prototype.setRandomPosition = function ()
{
	this.Mesh.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200);				
};

PlayerShip.prototype.update = function ()
{
	this.Life();
	this.BulletsCounter.firstChild.data = this.getBulletsCount();
};

// это функция, которая должна вызываться в главной игровой функции
PlayerShip.prototype.Life = function ()
{
	this.BBox.setFromObject(this.Mesh);	
	
//	this.statusControl();
	
	this.Gun.update();
};

/*Контролирует изменение статуса игрока.
 *СТАТУС = {"live", "dead"};
 */
PlayerShip.prototype.statusControl = function ()
{
	this.healthAndDeadControl();
};

PlayerShip.prototype.healthAndDeadControl = function()
{
	if(this.Health <= 0)
	{
		this.Status = "dead";
	}
};
/*IN:
 * json_params = {
 * 	damage: damage
 * }
 */

PlayerShip.prototype.onDamaged = function (json_params) 
{
	if(json_params !== undefined)
	{
		if(json_params.Damage !== undefined)
		{
			this.Health -= json_params.Damage;
		}
	}
};
/* Устанавливает позицию корабля
 */ 
PlayerShip.prototype.setPosition = function (json_params)
{
	if(typeof(json_params) === "string")
		json_params = JSON.parse(json_params);
	
//	this.Mesh.position.set();	
	this.Mesh.position.copy(json_params);
};
/* Устанавливает поворот корабля в пространстве
 */
PlayerShip.prototype.setRotation = function (json_params)
{
	if(typeof(json_params) === "string")
		json_params = JSON.parse(json_params);
		
	this.Mesh.rotation.copy(json_params);
};
/* Стреляет в направлении, которое было указано в параметре,
 * снаряд летит с определенной скоростью
 * Принимает на вход:
 * {
 *  distance: json_params.parameters.distance,
 * 	speed: json_params.parameters.speed,
 * 	start_position: json_params.parameters.start_position,
 * 	direction: json_params.direction,
 *	gun_type: "gun_type",
 *  bullet_type: "bullet_type",
 *  remote_players: json_params.remote_players,
 *  all_players: json_params.all_players
 * }
 */
PlayerShip.prototype.shoot = function (json_params)
{
	// var gun = this.getGunByType(json_params);
	// json_params.mesh = gun.getBulletMeshByBulletType(json_params);
	// gun.shoot(json_params);
	this.Gun.shoot(json_params);
};

PlayerShip.prototype.getGunByType = function (json_params)
{
	if(json_params.gun_type !== undefined)
	{
		if(json_params.gun_type === "plasma_gun")
		{
			return this.Gun;
		}
	}
};

/* Возвращает позицию корабля 
 */
PlayerShip.prototype.getPosition = function ()
{
	return this.Mesh.position.clone();
};
/* Возвращает поворот корабля
 */
PlayerShip.prototype.getRotation = function ()
{
	return this.Mesh.rotation.clone();
};

PlayerShip.prototype.getMesh = function ()
{
	return this.Mesh;
};

PlayerShip.prototype.removeMesh = function ()
{
	this.Scene.remove(this.Mesh);
};

/*Класс описывает оружие, которое производит выстрелы.
 *PlasmaGun стреляет кубами с шейдерами, которые будут напоминать выстрелы. 
 */

var PlasmaGun = function (json_params)
{
	var json_params_names = [
		"Bullets", //Сюда будут добавляться выпущенные пули
		"Scene",
		"StartPosition", //Позиция пользователя
		"AvailableAmmunition" //Доступное оружие
	];
	setParametersByArray.call(this, json_params, json_params_names);

	this.Clock = new THREE.Clock();

	/*
		Массив с доступными патронами.
		this.AvailableAmmunition = [{Count: int, Bullet: Bullet}, {{Count: int, Bullet: Bullet}, ...];
	*/
	this.CurrentAmmunition = this.AvailableAmmunition[0];
};

PlasmaGun.prototype.getBulletsCount = function ()
{
	return this.CurrentAmmunition["Count"];
};

/*Устанавливает текущий указатель на патроны по какому-то признаку*/
PlasmaGun.prototype.setCurrentAmmunition = function (index)
{
	this.CurrentAmmunition = this.AvailableAmmunition[index];
};


/*Метод производит выстрел.
 *В параметре приходят параметры для создания пули
 */ 
PlasmaGun.prototype.shoot = function (json_params)
{
	//Если количество патронов < 0, то выход.
	if(this.CurrentAmmunition["Count"] <= 0)
	{
		return;
	}else
	{
		this.CurrentAmmunition["Count"]--;
	}
	//Если патроны есть, то мы должны стрелять;
	var bullet = new this.CurrentAmmunition["Bullet"]({
		Direction: json_params.Direction,
		StartPosition: this.StartPosition.clone()
	});
	bullet.addToScene(this.Scene);
	this.Bullets.push(bullet);
};

/*По переданному типу пули мы производим копирование ее характеристик
 * и затем возвращаем их 
 *
 */
PlasmaGun.prototype.getBulletParametersByBulletType = function (json_params)
{
	var ret = {};

	if(json_params.BulletType !== undefined)
	{
		for(var bullet_params in this.BulletTypes)
		{
			if(this.BulletTypes[bullet_params]["bullet_type"] == json_params.bullet_type)
			{
				for(var param in this.BulletTypes[bullet_params])
				{
					// source_mesh нам копировать не нужно для пересылки!
					if(param !== "source_mesh")
						ret[param] = this.BulletTypes[bullet_params][param];
				}
//				console.log(ret);
				return ret;
			}
		}
	}
	return ret;
};
/*Возвращает mesh объект в зависимости от параметров:
 * IN:
 * json_params = {
 * 	bullet_type: type
 * }
 * OUT:
 * THREE.Mesh().clone();
 */
PlasmaGun.prototype.getBulletMeshByBulletType = function (json_params)
{
	if(json_params.bullet_type !== undefined)
	{
		for(var bullet_params in this.BulletTypes)
		{
			if(this.BulletTypes[bullet_params]["bullet_type"] === json_params.bullet_type)
			{
				return this.BulletTypes[bullet_params]["source_mesh"].clone();
			}
		}
	}
	throw Error("Problems int PlasmaGun.prototype.getBulletMeshByBulletType");
//	return;
};

/*Метод обрабатывает движение пули!
 */
PlasmaGun.prototype.bulletsMovingControl = function (time_delta)
{
	for(var i=0; i<this.Bullets.length; i++)
	{
		if(this.Bullets[i].Distance > 0)
		{
			var del = this.Bullets[i].Speed * time_delta;
			var vec = this.Bullets[i].Direction.clone();
			vec.multiplyScalar(del);
			this.Bullets[i].Mesh.position.add(vec);
			this.Bullets[i].Distance -= vec.length();
		}else
		{
			this.Bullets[i].removeFromScene(this.Scene);
			this.Bullets.splice(i,1);
			--i;
		}
	}
};

PlasmaGun.prototype.bulletsControl = function ()
{
	
	for(var j=0;j<this.Bullets.length; j++)
	{
		this.Bullets[j].update();
		if(this.Bullets[j].getStatus() == "dead")
		{
			this.Bullets[j].removeFromScene(this.Scene);
			this.Bullets.splice(j,1);
			j--;			
		}
	}
	var delta = this.Clock.getDelta();
	this.bulletsMovingControl(delta);
	
};


PlasmaGun.prototype.update = function ()
{
//	this.bulletsControl();
};


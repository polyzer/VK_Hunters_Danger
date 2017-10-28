/*
Класс описывает комнату, в которой будет находиться что-то.
В каждой комнате должно быть:
1) Сцена - this.Scene; Может быть импортирована из файла
2) Ограничивающая область - this.SkyBox;
3) Освещение - this.Lightning;
4) Функция, которая должна быть обработана в комнате, каждый момент времени - this.update();
5) 
*/
var Room = function (json_params)
{
	this.Scene = new THREE.Scene();
	this.Size = new THREE.Vector3(
			Math.random()*(GAME_CONSTANTS.ROOM_SIZES.MAX.x - GAME_CONSTANTS.ROOM_SIZES.MIN.x) + GAME_CONSTANTS.ROOM_SIZES.MIN.x,
			Math.random()*(GAME_CONSTANTS.ROOM_SIZES.MAX.y - GAME_CONSTANTS.ROOM_SIZES.MIN.y) + GAME_CONSTANTS.ROOM_SIZES.MIN.y,
			Math.random()*(GAME_CONSTANTS.ROOM_SIZES.MAX.z - GAME_CONSTANTS.ROOM_SIZES.MIN.z) + GAME_CONSTANTS.ROOM_SIZES.MIN.z
	);

	this.SkyBox = new THREE.Mesh(
		new THREE.BoxGeometry(this.Size.x, this.Size.y, this.Size.z), 
		new THREE.MeshStandardMaterial({
			color: 0x9999ff, 
			side: THREE.BackSide,
			map: THREE.ImageUtils.loadTexture("./images/bg_1_1.png")
		})
	);
	this.SkyBox.scale.set(2,2,2);
	this.AmbientLight = new THREE.AmbientLight( 0xffffff, 5 );

	var json_params_names = [
	];

	setParametersByArray.call(this, json_params, json_params_names);

	this.Scene.add(this.SkyBox);
	this.Scene.add(this.AmbientLight);

	this.UpdatableObjects = [];
};
/*
Основная функция, обрабатывающая все процессы, происходящие в комнате
*/
Room.prototype.update = function ()
{
	for(var i=0; i<this.UpdatableObjects.length; i++)
	{
		if(this.UpdatableObjects[i].update)
			this.UpdatableObjects[i].update();
	}
};
/*Возвращает произвольную точку в комнате*/
Room.prototype.getRandomPointInRoom = function ()
{
	return new THREE.Vector3(
		this.Size.x* Math.random() * getRandomMinusMult(),
		this.Size.y* Math.random() * getRandomMinusMult(),
		this.Size.z* Math.random() * getRandomMinusMult(),		
	);
};


Room.prototype.getScene = function ()
{
	return this.Scene;
};
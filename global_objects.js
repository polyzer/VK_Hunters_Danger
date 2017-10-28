/*
Класс содержит
MeshesBase: база всех мешей приложения;
Person: структура, которая описывает все данные, связанные с необходимыми данными в приложении
Должен существовать только один экземпляр данного объекта.
*/
var GlobalObjects = function ()
{
	this.setMeshesBaseBF = this.setMeshesBase.bind(this);
	/*Содержит все Меши игры в себе.*/
	this.MeshesBase = null;
	/*Персона содержит все данные, необходимые.*/
	this.Person = null;
	/*Объект Менюхи.*/
	this.Menu = null;
	/*Объект игры, в котором всё воспроизводится.*/
	this.Game = null;
	/*Эта структура содержит.*/
	this.Room = null;
	/*Предполагается, что Level будет хранить все данные, которые должны быть в комнате.*/
	this.Level = null;
	window.GLOBAL_OBJECTS = this;

	this.meshes_base_promise = new Promise(function (resolve) {
		resolve(new MeshesBase());
	});
	this.meshes_base_promise.then(this.setMeshesBaseBF);

	this.addAllInputElements();
};

GlobalObjects.prototype.addAllInputElements = function ()
{
	var el = document.createElement("div");
	el.setAttribute("id", "BulletsCounter");
	document.body.appendChild(el);

};

GlobalObjects.prototype.makeRightStreamRequest = function()
{
	if(json_params instanceof Object)
		if(navigator.mediaDevices !== undefined)
		{
			navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(this.setStreamBF)
			.catch(this.onStreamErrorBF);
		} else
		{
			navigator.getUserMedia(
				{video: true, audio: true}, 
				this.setStreamBF,
				this.onStreamErrorBF);
		}
	else
		throw new Error("json_params must be instance of Object");
}

GlobalObjects.prototype.createRoom = function ()
{
	this.Room = new Room();
};

GlobalObjects.prototype.setRoom = function (room)
{
	this.Room = room;
};

GlobalObjects.prototype.getRoom = function ()
{
	return this.Room;
};

GlobalObjects.prototype.setStream = function (stream)
{
	this.Stream = stream;
};

GlobalObjects.prototype.getStream = function ()
{
	return this.Stream;
};

GlobalObjects.prototype.setGame = function(game)
{
	this.Game = game;
};

GlobalObjects.prototype.getGame = function()
{
	return this.Game;
};

GlobalObjects.prototype.createMeshesBase = function ()
{
	this.MeshesBase = new MeshesBase();
};

GlobalObjects.prototype.getMeshesBase = function ()
{
	return this.MeshesBase;
};

GlobalObjects.prototype.setMeshesBase = function (meshes_base)
{
	this.MeshesBase = meshes_base;
};

GlobalObjects.prototype.createMenu = function ()
{
	this.Menu = new Menu();
};

GlobalObjects.prototype.setMenu = function (menu)
{
	this.Menu = menu;
};

GlobalObjects.prototype.getMenu = function ()
{
	return this.Menu;
};

GlobalObjects.prototype.createPerson = function ()
{
	this.Person = new Person();
};

GlobalObjects.prototype.getPerson = function ()
{
	return this.Person;
};
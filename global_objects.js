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

	this.LocalPlayerHealthLineDiv = null;
	this.BulletsCounterDiv = null;
	this.addAllInputElements();

	this.meshes_base_promise = new Promise(function (resolve) {
		resolve(new MeshesBase());
	});
	this.meshes_base_promise.then(this.setMeshesBaseBF);

};

GlobalObjects.prototype.addAllInputElements = function ()
{
	this.GameContainer = document.createElement("div");
	this.GameContainer.setAttribute("id", "MainContainer");

	this.MenuContainer = document.createElement("div");
	this.MenuContainer.setAttribute("id", "MenuContainer");

	this.BulletsCounterDiv = document.createElement("div");
	this.BulletsCounterDiv.setAttribute("id", "BulletsCounterDiv");

	this.LocalPlayerHealthLineDiv = document.createElement("div");
	this.LocalPlayerHealthLineDiv.setAttribute("id", "LocalPlayerHealthLineDiv");
	this.LocalPlayerHealthLineDiv.setAttribute("data-width-coeff", GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_WIDTH * 0.25);
	this.LocalPlayerHealthLineDiv.style.position = "absolute";
	this.LocalPlayerHealthLineDiv.style.left = "20%";
	this.LocalPlayerHealthLineDiv.style.top = "10%";
	this.LocalPlayerHealthLineDiv.style.height = "10%";
	this.LocalPlayerHealthLineDiv.style.width = this.LocalPlayerHealthLineDiv.widthCoeff + "px";
	this.LocalPlayerHealthLineDiv.style.backgroundColor = "red";
};

GlobalObjects.prototype.getGameContainer = function ()
{
	return this.GameContainer;
};

GlobalObjects.prototype.getMenuContainer = function ()
{
	return this.MenuContainer;
};

GlobalObjects.prototype.setLocalPlayerHealthLineDiv = function (percent)
{
	var tvar = percent * this.LocalPlayerHealthLineDiv.widthCoeff;
	if(tvar > 0)
		this.LocalPlayerHealthLineDiv.style.width = tvar + "px";
	else
		this.LocalPlayerHealthLineDiv.style.width = 0 + "px";
};

GlobalObjects.prototype.getBulletsCounterDiv = function ()
{
	return this.BulletsCounterDiv;
};

GlobalObjects.prototype.getLocalPlayerHealthLineDiv = function ()
{
	return this.LocalPlayerHealthLineDiv;
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
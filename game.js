
let Game = function (json_params) 
{
	// подготовка
	this.Container = GLOBAL_OBJECTS.getGameContainer();

	document.body.appendChild(this.Container);

	this.Camera = new THREE.PerspectiveCamera(
		GAME_CONSTANTS.CAMERA_PARAMETERS.ANGLE, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_WIDTH/GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_HEIGHT, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.NEAR, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.FAR
	);
	
	this.Room = new Room();
	this.Scene = this.Room.getScene();
	this.Renderer = new THREE.WebGLRenderer();
	this.Renderer.setSize(
		GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_WIDTH, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.SCREEN_HEIGHT
	);
	
	this.Container.appendChild(this.Renderer.domElement);
	this.Container.appendChild(GLOBAL_OBJECTS.getLocalPlayerHealthLineDiv());
	this.Clock = new THREE.Clock();
	this.Delta = 0;
		
	// ВНИМАНИЕ: В игре используется глобальный объект		
	// this.NetMessagesObject = new _NetMessages({nickname: this.Nickname, id: this.ID});
	
	// Список удаленных игроков;
	this.RemotePlayers = [];
 
 	// this.NetMessagesObject = json_params.net_messages_object;
	this.Ship = new PlayerShip({Scene: this.Scene, Camera: this.Camera});

	// Локальный игрок
	this.LocalPlayer = new LocalPlayer({Ship: this.Ship, Camera: this.Camera, Scene: this.Scene});
	/*
		Все игроки в системе.
		[0] - LocalPlayer;
		[1] - RemotePlayers - удаленные игроки
	  	структура, хранящая всех игроков, включая локального;	
	*/
	this.AllPlayers = [];
	/*Идентификатор комнаты будет устанавливаться,
		когда пользователь будет в комнате;
	*/
	// this.RoomID = null;
	// if(json_params.room_id !== undefined)
	// 	this.setRoomID(json_params.room_id);

	// this.Peer = json_params.peer;
		
	// this.createPlayersByExistingConnectionsBF = this.createPlayersByExistingConnections.bind(this);
	 this.updateWorkingProcessBF = this.updateWorkingProcess.bind(this);
	// this.createPlayerByRecievedConnectionBF = this.createPlayerByRecievedConnection.bind(this);
	// this.onCallBF = this.onCall.bind(this);
			
 //  this.onOpenInitAndStartGame();

 	//Все патроны, котоыре будут обновляться 	
 	this.Bullets = this.Ship.getBullets();
 	// Все охотники в игре, которые должны обрабатываться!
 	this.Hunters = [];
 	// Души, которые могут быть собраны
 	this.HuntersSouls = [];
 	// Это Ульи, которые будут создавать новых Охотников!
 	this.Beehives = [];

 	this.updateWorkingProcess();
 	this.createLevel();
};		

Game.prototype.createLevel = function ()
{

	this.Level = {
		StartHuntersCount: 10,
		BeehivesCount: 5
	};

	for(let i=0; i< this.Level.StartHuntersCount; i++)
	{
		let hunter = new Hunter({
			Scene: this.Scene, 
			LocalUserMeshPosition: this.LocalPlayer.getPosition(),
			StartPosition: this.Room.getRandomPointInRoom(),
			AttackCallback: this.LocalPlayer.getAttackCallback()
		});
		this.Hunters.push(hunter);
	}
	for(let i=0; i< this.Level.BeehivesCount; i++)
	{
		let beehive = new Beehive({
			Scene: this.Scene,
			StartPosition: this.Room.getRandomPointInRoom(),
			LocalUserMeshPosition: this.LocalPlayer.getPosition(),
			PlayerAttackCallback: this.LocalPlayer.getAttackCallback()
		});		
		this.Beehives.push(beehive);
	}
};

/*Устанавливаем все нужные элементы видимыми*/
Game.prototype.showElements = function ()
{
	//Счётчик патронов
	let el = document.getElementById("BulletsCount");
	el.style.visibility = "visible";
};
Game.prototype.hideElements = function ()
{
	//Счётчик патронов
	let el = document.getElementById("BulletsCount");
	el.style.visibility = "hidden";
};
/*Обрабатывает медиапотоки, присылваемые другими пользователями,
 *и присваивает их нужным пользователям!
 */
Game.prototype.onCall = function (call)
{
	for(let i=0; i<this.AllPlayers[1].length; i++)
	{
		call.answer(Stream);
		if(this.AllPlayers[1][i].getPeerID() === call.peer)
			this.AllPlayers[1][i].onCall(call);
	}
};


/* Инициализирует начало работы Peer.js
 */
Game.prototype.onOpenInitAndStartGame = function (e)
{	
  	// Устанавливаем обработчика событий
	this.Peer.on('connection', this.createPlayerByRecievedConnectionBF);
  	this.Peer.on('call', this.onCallBF);
	// Локальный игрок, который будет
	this.LocalPlayer = new _LocalPlayer({
		Scene: this.Scene, 
		AllPlayers: this.AllPlayers, 
//		net_messages_object: this.NetMessagesObject,
		Camera: this.Camera
	});

	this.AllPlayers.push(this.LocalPlayer);
	this.AllPlayers.push(this.RemotePlayers);
	
	this.getAndSetInitConnections();

	this.startWorkingProcess();

};

/* Важнейшая функция.
 * Создает соединения с пользователями, которые уже
 * находятся в сети.
 * Принимает на вход:
 * json_params: {response: [ids]}
 */
Game.prototype.createPlayersByExistingConnections = function (json_params)
{
	alert(json_params);
	if(json_params === "undefined")
	{
		throw new Error(this.constructor.name + ".createPlayersByExistingConnections(json_response) - have no json_response");
		return;
	}
	
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	for(let i=0; i<json_params.response.length; i++)
	{
		// на сервере уже будет установлено наше соединение;
		// а сами к себе мы подсоединяться не должны!
		if(this.Peer.id === json_params.response[i])
		{
			continue;
		}
		conn = this.Peer.connect(json_params.response[i]);
		
		//this.Peer.call(json_params.response[i], StreamObj);///////////////////////////////////////////???????!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		this.RemotePlayers.push(new _RemotePlayer({
				net_messages_object: this.NetMessagesObject,
				all_players: this.AllPlayers,
				scene: this.Scene,
				connection: conn
			}));
	}

};

/* Важнейшая функция игры, в которой происходит управление и обновление всех систем!!
 */

Game.prototype.updateWorkingProcess = function ()
{
	this.Delta = this.Clock.getDelta();

	this.Renderer.render(this.Scene, this.Camera);
	this.controlHunters(this.Delta);
	this.controlBeehives(this.Delta);
	this.controlHuntersSouls(this.Delta);
	this.controlBullets(this.Delta);
	this.controlCollision(this.Delta);
	this.LocalPlayer.update(this.Delta);
//		this.updateRemotePlayers();
		

	  requestAnimationFrame(this.updateWorkingProcessBF);
}

/* Производит обновление телодвижений удаленных игроков.
 */
Game.prototype.updateRemotePlayers = function ()
{
		for(let j=0; j<this.RemotePlayers.length; j++)
	  {
			this.RemotePlayers[j].update();
		}
}

Game.prototype.setRoomID = function(id)
{
	this.RoomID = id;
}

/*
	Получает список находящихся в комнате пользователей,
	и создает с ними соединения.
*/
Game.prototype.getAndSetInitConnections = function (json_params)
{
	if(this.RoomID === null)
	{
		throw new Error("Problem with room_id in function getAndSetInitConnections");
		return;
	}
	
	req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.COME_INTO_ROOM;
	$.ajax({
		type:"POST",
		url: req_str,
		async: false,
		crossDomain: true,
		data: {room_id : this.RoomID, user_id: this.Peer.id},
		success: this.createPlayersByExistingConnectionsBF
	});
}

/* функция добавляет полученное соединение в массив соединений Connections
 * и сразу отправляет запрос на получение nickname нового игрока
 */
Game.prototype.createPlayerByRecievedConnection = function (conn)
{
	this.RemotePlayers.push(new RemotePlayer({
								connection: conn,
								scene: this.Scene,
								all_players: this.AllPlayers,
								net_messages_object: this.NetMessagesObject													
					   	 }));
};


/* завершаем соединение с игроком
 */
Game.prototype.disconnectRemotePlayers = function()
{
	while(this.RemotePlayers.length > 0)
	{
		this.RemotePlayers[this.RemotePlayers.length-1].Conection.close();
		this.RemotePlayers.pop();
	}
};
/*Устанавливает Nickname во всех необходимых структурах
*/
Game.prototype.setNickname = function (nickname)
{
	this.Nickname = nickname;
	this.NetMessagesObject.setNickname(nickname);
}

Game.prototype.startWorkingProcess = function ()
{
		requestAnimationFrame(this.updateWorkingProcessBF);	
}

/*
	Функция управляет поведением Ульев по состояниям
*/
Game.prototype.controlHunters = function (delta)
{
	for(let i=0; i<this.Hunters.length; i++)
	{
		this.Hunters[i].update(delta);
		if(this.Hunters[i].getState() === GAME_CONSTANTS.HUNTERS.HUNTER.STATES.DEAD)
		{
			this.Room.getScene().remove(this.Hunters[i].getMesh());
			let soul = this.Hunters[i].getSoul();
			this.HuntersSouls.push(soul);
			this.Scene.add(soul.getMesh());
			this.Hunters.splice(i,1);
			i--;
			continue;
		}
	}
};

/*
	Функция управляет поведением Душ охотников по состояниям
*/
Game.prototype.controlHuntersSouls = function (delta)
{
	for(let i=0; i<this.HuntersSouls.length; i++)
	{
		this.HuntersSouls[i].update(delta);
		if(this.HuntersSouls[i].getState() === GAME_CONSTANTS.HUNTER_SOULS.HUNTER_SOUL.STATES.DEAD)
		{
			this.Room.getScene().remove(this.HuntersSouls[i].getMesh());
			this.HuntersSouls.splice(i,1);
			i--;
			continue;
		}
	}
};

/*
	Функция управляет поведением Ульев
*/
Game.prototype.controlBeehives = function (delta)
{
	for(let i=0; i< this.Beehives.length; i++)
	{
		this.Beehives[i].update(delta);
		if(this.Beehives[i].getState() === GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.DEAD)
		{
			this.Room.getScene().remove(this.Beehives[i].getMesh());
			this.Beehives.splice(i, 1);
			i--;
			continue;
		}else if(this.Beehives[i].getState() === GAME_CONSTANTS.BEEHIVES.BEEHIVE.STATES.HUNTER_CREATED)
		{
			this.Hunters.push(this.Beehives[i].getHunter());
			continue;
		}
	};
};

Game.prototype.controlBullets = function (delta)
{

	for(let i=0; i< this.Bullets.length; i++)
	{
		this.Bullets[i].update(delta);
		if(this.Bullets[i].getState() === GAME_CONSTANTS.BULLETS.BULLET.STATES.DEAD)
		{
			this.Scene.remove(this.Bullets[i].getMesh());
			this.Bullets.splice(i,1);
			i--;
		}	
	}
};

/*Функция проверяет пересечение пуль с уничтожаемыми объектами*/
Game.prototype.controlCollision = function (delta)
{
	let p_bbox = this.LocalPlayer.getBBox();
	for(let i=0; i< this.HuntersSouls.length; i++)
	{
		
		if(p_bbox.intersectsBox(this.HuntersSouls[i].getBBox()))
		{
			this.Scene.remove(this.HuntersSouls[i].getMesh());
			this.LocalPlayer.addSoul(this.HuntersSouls[i]);
			this.HuntersSouls.splice(i,1);
			i--;
		}
	}

	for(let i=0; i < this.Bullets.length; i++)
	{
		let bullet_bbox = this.Bullets[i].getBBox();
		
		for(let j=0; j< this.Hunters.length; j++)
		{
			let bbox = this.Hunters[j].getBBox();
			if(bullet_bbox.intersectsBox(bbox))
			{
				this.Hunters[j].onHit({
					Damage: this.Bullets[i].getDamage()
				})
				this.Bullets[i].onHit();
			}			
		}

		for(let j=0; j< this.Beehives.length; j++)
		{
			let bbox = this.Beehives[j].getBBox();
			if(bullet_bbox.intersectsBox(bbox))
			{
				this.Beehives[j].onHit({
					Damage: this.Bullets[i].getDamage()
				})
				this.Bullets[i].onHit();
			}			
		}
	}
};
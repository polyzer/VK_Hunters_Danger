const GAME_CONSTANTS = {

	CAMERA_PARAMETERS: {
		ANGLE: 45,
		SCREEN_WIDTH: 900,
		SCREEN_HEIGHT: 650,
		NEAR: 1,
		FAR: 130000,
		STORE_SCREEN_WIDTH: 500,
		STORE_SCREEN_HEIGHT: 300
	},

	CONTROL_DISTANCE: {
		VOLUME_RADIUS: 1000,
		CASE_RADIUS: 2000,
		CASE_HIDE_RADIUS: 600
	},

	/*
	Виды запросов
	UTOS: user->server;
	UTOU: user->user;
	*/
	REQUESTS: {
		UTOS: {
			COME_INTO_ROOM: "come_into_room",
			LEAVE_ROOM: "leave_room",
			CREATE_ROOM: "create_room",	
			FIND_ROOM_TO_ME: "find_room_to_me",
			ON_COME_TO_BAD_ROOM: "on_come_to_bad_room"
		},
		UTOU: {
			MOVE: "move",
			SHOOT: "shoot",
			SEND_NICKNAME: "send_nickname",
			GET_NICKNAME: "get_nickname",
			GET_COMMUNICATION_STATUS: "get_communication_status",
			SEND_COMMUNICATION_STATUS: "send_communication_status",
			GET_YOUR_VKID: "get_vkid",
			SEND_MY_VKID: "send_vkid",
			HIDE_VIDEO: "hide_video",
			SHOW_VIDEO: "show_video",
			HIDE_VKID: "hide_vkid",
			SHOW_VKID: "show_vkid",
			COMMUNICATION_IS_OVER: "communication_is_over",
			CAN_I_CONNECT_TO_YOU: "can_I_connect_to_you",
			YES_YOU_CAN_CONNECT_TO_ME: "yes_you_can_connect_to_me",
			NO_YOU_CANT_CONNECT_TO_ME: "no_you_cant_connect_to_me",
			WE_CAN_START_CHATTING: "we_can_start_chatting",
			GET_YOUR_VISUAL_KEEPER_CASE_MESH_PARAMETERS: "GET_YOUR_CASE_MESH_PARAMETERS",
			SEND_MY_VISUAL_KEEPER_CASE_MESH_PARAMETERS: "SEND_MY_CASE_MESH_PARAMETERS",
			GET_YOUR_FULL_DATA: "Get_Your_Full_Data",
			SEND_MY_FULL_DATA: "Send_My_Full_Data"
		}
	},

	MESHES_INDEXES: {
		HUNTER: 0,
		TARDIS: 1, /*Внутри такая же как и снаружи!*/
		HUNTER_SOUL: 2,
		BEEHIVE: 3
	},

	CAMERA_VIDEO_SIZES: {
		SMALL: 128,
		MEDIUM: 256,
		LARGE: 512
	},
/*
Описывает состояние игрока.
*/
	USER_STATUS: {
		FINDING_REMOTE_USER: 0,	/*Если находимся в режиме поиска кандидата на пользователя*/
		CANDIDATE_IS_FOUND_AND_CONNECTION_IS_BEEN_SET: 1, /*Если кандидат найден, то его нужно установить*/
		ALL_FINE: 2, /*Все круто, ниче делать не надо!*/
		NEED_FIND_REMOTE_USER: 3,
		HAVE_NO_USER_IN_CURRENT_USERS_IDS_ARRAY: 4,
		NEED_FIND_CANDIDATE_IN_CURRENT_USERS_IDS_ARRAY: 5,
		WE_CAN_START_CHATTING: 6,
		NEED_WILLIGNESS_OF_USERS: 7,
		RECIEVED_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER: 8,
		FOUND_CANDIDATE_CAN_BE_SET_AS_REMOTE_USER: 9,
		NEED_WAIT_COMING_TO_CAMERA_ANIMATION_ENDING: 10,
		NEED_FIND_REMOTE_USER_AFTER_HIDE_ANIMATION_WILL_STOP: 11,
		NEED_WAIT_ANIMATION_ENDING_TO_DISCONNECT: 12
	},

	SET_DATA_PARAMETERS_STATE:{
		REMOTE_USER_STREAM_WAS_SET: {NO: 0, YES: 1},
		REMOTE_USER_VKID_WAS_SET: {NO: 0, YES: 1}
	},
	THE_WILLIGNESS_OF_USERS: {
		LOCAL_USER: {YES: 0, NO: 1},
		REMOTE_USER: {YES: 0, NO: 1}
	},

	FLYING_OBJECTS : {
		FLYING_MAX_HEIGHT: 1000,
		FLYING_MIN_HEIGHT_START_POSITION: -1000,
		FlYING_RADIUS: 600,
		FARTHER_OBJECTS_DISTANCE: -1500,
		NEAREST_OBJECTS_COUNT: 90,
		FARTHER_OBJECTS_COUNT: 30,
		NEAREST_OBJECTS_COUNT_MENU: 40,
		FARTHER_OBJECTS_COUNT_MENU: 10,
		FARTHER_FLYING_MAX_HEIGHT: 1000,
		MAX_SPEED: 30
	},

	POINTS : {
		NEXT_ROOM_COST: 1000
	},

	HUNTERS: {
		HUNTER: {
			STATES:{
				LIVE: 0,
				DEAD: 1
			}
		},
		BLACK: {
			HEALTH: {
				MAX: 100,
				CRITICAL_1: 70,
				CRITICAL_2: 50,
				CRITICAL_3: 30
			},
			SPEED: {
				MAX: 100,
				MIN: 30
			},
			STATES: {
				LIVE: 0,
				DEATH: 1
			},
			INDEX: "BlackHunter"
		},
		RED: {
			HEALTH: {
				MAX: 100,
				CRITICAL_1: 70,
				CRITICAL_2: 50,
				CRITICAL_3: 30
			},
			SPEED: {
				MAX: 100,
				MIN: 30
			},
			STATES: {
				LIVE: 0,
				DEATH: 1
			},
			INDEX: "RedHunter"
		}

	},

	BEEHIVES: {
		BEEHIVE: {
			STATES: {
				LIVE: 0,
				DEAD: 1,
				HUNTER_CREATED: 2
			}
		},
		BLACK: { 
			HEALTH: {
				MAX: 1000,
				CRITICAL_1: 700,
				CRITICAL_2: 500,
				CRITICAL_3: 300
			},
			TIME_TO_CREATE_HUNTER_SEC: 5,
			INDEX: "BlackBeehive"
		}
	},

	GUNS: {
		GUN: {
			STATES:{
				LIVE: 0,
				DEAD: 1
			}
		},
		PLASMA: {
			INDEX: "PLASMA"
		},
		LASER: {
			INDEX: "LASER"
		},
		PISTOL: {
			INDEX: "PISTOL"
		}
	},
	/*Хранит все параметры для каждой пули*/
	BULLETS: {
		BULLET: {
			STATES:
			{
				LIVE: 0,
				DEAD: 1
			}
		},
		GREEN_PLASMA:{
			Distance: 5000,
			Speed: 6000,
			Direction: {x:100,y:100,z:100},
			StartPosition: {x:0,y:0,z:0},
			Mesh: new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshStandardMaterial({emissive: "#00ff00"})),
			BulletType: "cube_green_bullet",
			Damage: 500,
			INDEX: "GreenPlasma"
		},
		RED_PLASMA:{
			Distance: 10000,
			Speed: 8000,
			Direction: {x:100,y:100,z:100},
			StartPosition: {x:0,y:0,z:0},
			Mesh: new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshStandardMaterial({emissive: "#00ff00"})),
			BulletType: "cube_green_bullet",
			Damage: 600,
			INDEX: "RedPlasma"
		}
	},
	HUNTER_SOULS: {
		HUNTER_SOUL: {
			STATES: {
				LIVE: 0,
				DEAD: 1
			}
		},
		BLACK: {
			INDEX: "BlackSoul"
		}
	},
	ROOM_SIZES: {
		MAX: new THREE.Vector3(60000, 60000, 60000),
		MIN: new THREE.Vector3(10000, 10000, 10000)
	},
	GOODS: {
		TYPES:{
			GUN: "0",
			MESH: "1",
			OTHER: "2",
			BULLET: "3"
		}
	},
	LEVELS_CONFIG: {

	},
	LOCAL_PLAYER: {
		HEALTH:{
			MAX: 1000
		},
		STATES: {
			LIVE: 0,
			DEAD: 1
		}
	}
};

function getRandomMinusMult()
{
	var multip = -1;
	if(Math.round(Math.random()) === 1)
	{
		multip = multip*multip;
	}
	return multip;	
}

/* генерирует рандомную строку заданной длины
 */
function generateRandomString(len)
{
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	if((len !== undefined) && (len > 0)){
		for(var i=0; i<len; i++)
			text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
	}
	text = text.join("");
	return text;
}

function setParametersByArray(json_params, json_params_names)
{
	for (var p_name in json_params_names)
	{
		if(json_params[json_params_names[p_name]])
		{
			this[json_params_names[p_name]] = json_params[json_params_names[p_name]];
		} else
		{
			throw new Error("Have no mandatory parameter: " + json_params_names[p_name]);
		}
	}
}

/*
IN json_parms = {
	constraints: {video: true, audio: true},
	onsuccess: this.onSuccessBF,
	onerror: this.onErrorBF
}
*/
function makeRightStreamRequest(json_params)
{
	if(json_params instanceof Object)
		if(navigator.mediaDevices !== undefined)
		{
			navigator.mediaDevices
			.getUserMedia(json_params.constraints)
			.then(json_params.onsuccess)
			.catch(json_params.onerror);
		} else
		{
			navigator.getUserMedia(json_params.constraints, 
				json_params.onsuccess,
				json_params.onerror);
		}
	else
		throw new Error("json_params must be instance of Object");
}

function isFuckin(something)
{
	if(typeof(something) === "undefined" || typeof(somethin) === "null")
		return true;
	else
		return false;
}

if(typeof(exports) !== "undefined")
{
	exports.ROOM_MODE = ROOM_MODE;
	exports.PEER_SERVER_ADDR = PEER_SERVER_ADDR;
	exports.PEER_PORT_ADDR = PEER_PORT_ADDR;
	exports.PEER_PATH_ADDR = PEER_PATH_ADDR;
	exports.REQUESTS = REQUESTS;

	exports.PEER_PORT_ADDR = PEER_PORT_ADDR;
	exports.DEFAULT_ROOM_ID = DEFAULT_ROOM_ID;
	exports.generateRandomString = generateRandomString;
}else
{
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;


	const VIDEO_MESH_MOVEMENT = {
		STATUS: {
			MOVEMENT: 0, 
			STANDING: 1
		},
		POSITIONS:{ 
			LOCAL: {		
				RIGHT_AWAY: new THREE.Vector3(-450, 250, -1200),
				FRONT_OF_CAMERA: new THREE.Vector3(0,-30,-350),
				MOVING_STEP: 20
			},
			REMOTE: {		
				LEFT_AWAY:new THREE.Vector3(1000,-30,-1500),
				FRONT_OF_CAMERA:new THREE.Vector3(0,-30,-350),
				FRONT_BACK_CENTER:new THREE.Vector3(0,-30,-1500)
			}
		}
	};

	const HUNTERS_COUNT = {

	};

	const NULL_POINT = new THREE.Vector3(0,0,0);

/**/	
	
}

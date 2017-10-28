/*
Класс описывает структуру, в которой будут храниться все необходимые данные
характеризующие текущую клиентскую сессию!
Здесь хранятся все данные получаемые с сервера:
параметры внешнего вида VisualKeeper'а клиента, которые сохраняются и меняются в Store.
ID - Внутрипрограммный идентификатор пользователя, пока что не используется;
Nickname - Никнейм пользователя. Пока что не используется;
UserType - описывает тип пользователя. Удаленный/локальный.
*/


var Person = function (json_params)
{

	this.onCheckSuccessBF = this.onCheckSuccess.bind(this);
	this.onSaveOpenMeshesIndexesToDBSuccessBF = this.onSaveOpenMeshesIndexesToDBSuccess.bind(this);

	/*ИДшник для использования в приложении*/
	this.ID = null;
	/*Если нужно использовать Никнеймы*/
	this.Nickname = null;
	/*
	Хранит данные Вконтакта для текущей сессии пользователя.
	Данные типа vk_id и т.д.
	*/
	this.VKVars = {};
	/*Определяет количество собранных душ!*/
	this.SoulsNumber = 0;
	/*Текущий пользовательский Меш!*/ 	
 	this.MeshIndex = GAME_CONSTANTS.HUNTERS.BLACK.INDEX;
	/*Текущая пользовательская Пушка!*/ 	
 	this.GunIndex = GAME_CONSTANTS.GUNS.PLASMA.INDEX;
 	/*Текущие Патроны!*/
 	this.BulletIndex = GAME_CONSTANTS.BULLETS.GREEN_PLASMA.INDEX;
	/*Индексы всех открытых пользователем Мешей*/
	this.OpenMeshesIndexes = [this.MeshIndex];
	/*Открытые пользователем Пушки!*/
 	this.OpenGunsIndexes = [this.GunIndex];
 	/*Открытые пользователем Пули!*/
 	this.OpenBulletsIndexes = [this.BulletIndex];
	/*
	Объект для Кейса локального пользователя, на который ДОЛЖЕН ссылаться
	его VisualKeeper.VideoMesh.Case
	*/
	this.MeshesBase = GLOBAL_OBJECTS.getMeshesBase();
	/*Далее идут действия, которые выполняются только для локального пользователя*/
	this.generateID();
	this.generateNickname();

	if(window.VK_WAS_INIT)
	{
		this.parseVKVars();
		this.checkPersonAtDB();
	}

};

Person.prototype.getMeshIndex = function ()
{
	return this.MeshIndex;
};
Person.prototype.getGunIndex = function ()
{
	return this.GunIndex;
};
Person.prototype.getBulletIndex = function ()
{
	return this.BulletIndex;
};
Person.prototype.getOpenMeshesIndexes = function ()
{
	return this.OpenMeshesIndexes;
};

Person.prototype.getOpenGunsIndexes = function ()
{
	return this.OpenGunsIndexes;
};

Person.prototype.getOpenBulletsIndexes = function ()
{
	return this.OpenBulletsIndexes;
};

Person.prototype.loadOpenObjectsIndexes = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_open_objects_indexes",
		vk_id: this.getUserVKID()
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.setLoadedOpenObjectsIndexes.bind(this),
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	

};

Person.prototype.setLoadedOpenObjectsIndexes = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	/*Если сервер сказал, что данные доступны!*/
	if(json_params["server_answer"] === "YES_DATA")
	{
		this.setOpenMeshesIndexes(json_params["result_datas"][0]["opened_meshes_indexes"]);
		this.setOpenGunsIndexes(json_params["result_datas"][0]["opened_guns_indexes"]);
		this.setOpenBulletsIndexes(json_params["result_datas"][0]["opened_bullets_indexes"]);

	} else if(json_params["server_answer"] === "NO_DATA")
	{
		console.log("User hasn't parameters");
	} else
	{
		console.log("something is wrong :(");
	}	
};

Person.prototype.setOpenMeshesIndexes = function (open_meshes_index)
{
	this.OpenMeshesIndexes = open_meshes_index;
};

Person.prototype.setOpenGunsIndexes = function (open_guns_index)
{
	this.OpenGunsIndexes = open_guns_index;
};

Person.prototype.setOpenBulletsIndexes = function (open_bullets_index)
{
	this.OpenBulletsIndexes = open_bullets_index;
};

Person.prototype.getOpenMeshesIndexesSaveString = function ()
{
	var topen_meshes = "";
	for(var i=0; i< this.OpenMeshesIndexes.length; i++)
	{
		topen_meshes += this.OpenMeshesIndexes[i];
		if(i !== (this.OpenMeshesIndexes.length - 1))
		{
			topen_meshes += ",";
		}
	}
	return topen_meshes;
};

/*
	Проверяет наличие Меша в открытых, т.е. куплен ли Меш, или нет.
*/
Person.prototype.isMeshIndexInOpenMeshesIndexes = function (index)
{
	for(var i=0; i< this.OpenMeshesIndexes.length; i++)
	{
		if(this.OpenMeshesIndexes[i] === index)
		{
			return true;
		}
	}
	return false;
};

/*
	Проверяет наличие Меша в открытых, т.е. куплен ли Меш, или нет.
*/
Person.prototype.isGunIndexInOpenGunsIndexes = function (index)
{
	for(var i=0; i< this.OpenGunsIndexes.length; i++)
	{
		if(this.OpenGunsIndexes[i] === index)
		{
			return true;
		}
	}
	return false;
};

/*
	Проверяет наличие Меша в открытых, т.е. куплен ли Меш, или нет.
*/
Person.prototype.isBulletIndexInOpenBulletsIndexes = function (index)
{
	for(var i=0; i< this.OpenBulletsIndexes.length; i++)
	{
		if(this.OpenBulletsIndexes[i] === index)
		{
			return true;
		}
	}
	return false;
};

/**
	Добавляет индекс Меша в открытые меши.
	После чего должен сохранять его в DB.
*/
Person.prototype.addMeshIndexToOpenMeshesIndexesAndSaveToDB = function (mesh_index)
{
	for(var i=0; i< this.OpenMeshesIndexes.length; i++)
	{
		if(this.OpenMeshesIndexes[i] === mesh_index)
		{
			console.log("That Mesh was buying!");
			return;
		}
	}
	
	this.OpenMeshesIndexes.push(mesh_index);
	this.saveOpenMeshesAndGunsIndexesToDB();
};

/*устанавливает параметры передаваемые сообщением REQUESTS.UTOU.GetYourFullDataMessage | REQUESTS.UTOU.SendMyFullDataMessage*/
Person.prototype.setRemotePersonParameters = function(json_params)
{
	this.setUserVKID(this.json_params.vk_id);
	this.setCubeVideoMeshCaseParametersJSON(json_params);
	this.setCaseMeshIndex(json_params.mesh_case_index);
	this.setVideoMeshCaseByMeshIndex();
};

/*Устанавливает текущий Mesh по индексу.*/
Person.prototype.setVideoMeshCaseByMeshIndex = function (index)
{
	if(typeof(index) !== "undefined" && typeof(index) !== "null")
	{
		this.VideoMesh.Case = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByIndex(index);
	}else
	{
		this.VideoMesh.Case = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);
	}
};
/*Структура возвращает данные от структуры КУБА.*/
Person.prototype.getCubeVideoMeshCaseParametersJSON = function ()
{
	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE){
		return {
			opacity: this.VideoMesh.Case.material.opacity, 
			face_color: this.VideoMesh.Case.material.color.getStyle(), 
			edge_color: this.VideoMesh.Case.children[0].material.color.getStyle()
		};
	}
	else{
		return {
			opacity: this.VideoMesh.Case.material.opacity, 
			face_color: "#000000", 
			edge_color: "#000000"			
		};
	}
};
/*Функция вроде как устанавливает необходимые параметры и материалы структуры КУБА*/
Person.prototype.setCubeVideoMeshCaseParametersByJSON = function (json_params)
{
	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE)
	{
		this.VideoMesh.Case.material.opacity = json_params.opacity;
		this.VideoMesh.Case.material.color.setStyle(json_params.face_color);
		this.VideoMesh.Case.children[0].material.color.setStyle(json_params.edge_color);
	} else {
		this.VideoMesh.Case.material.opacity = json_params.opacity;		
	}
};
/*
IN: 
json_params: {
	open_meshes: []
}
*/
Person.prototype.saveOpenMeshesAndGunsIndexesToDB = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "save_open_meshes",
		vk_id: this.getUserVKID(),
		opened_meshes_indexes: this.OpenMeshesIndexes,
		opened_guns_indexes: this.OpenGunsIndexes
	});

	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onSaveOpenMeshesAndGunsIndexesToDBSuccessBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};

Person.prototype.onSaveOpenMeshesAndGunsIndexesToDBSuccess = function (json_params)
{
	console.log(json_params);
};

Person.prototype.setCaseMeshIndex = function (index)
{
	if(index)
		this.VideoMesh.CaseMeshIndex = index;
	else{
		this.VideoMesh.CaseMeshIndex = CASE_MESHES_INDEXES.CUBE;
		throw new Error("No case mesh index!");
	}

};

/*Ёбаный обработчик успешного сохранения*/
Person.prototype.onSaveOpenMeshesIndexesToDBSuccess = function (json_params)
{
	console.log(json_params);
};

Person.prototype.saveCustomMeshViewParameters = function (json_params)
{
	
};

/*Загружает сохраненные настройки вида с сервера*/ 
Person.prototype.loadSavedCustomViewParameters = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_custom_mesh_view_params",
		vk_id: this.getUserVKID()
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.setLoadedCustomViewParametersBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};



/*Принимает и устанавливает полученные с сервера параметры к пользовательскому Мешу*/
Person.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	/*Если сервер сказал, что данные доступны!*/
	if(json_params["server_answer"] === "YES_DATA")
	{
		this.setCaseMeshIndex(json_params["result_datas"]["case_mesh_index"]);
		this.OpenMeshesIndexes = json_params["result_datas"]["open_meshes"].split(",");

	} else if(json_params["server_answer"] === "NO_DATA")
	{
		console.log("User hasn't custom view VisualKeeper parameters");
	} else
	{
		console.log("something is wrong :(");
	}
};

/*Функция занимается разбором url-строки, из которой получает все необходимые данные пользователя*/
Person.prototype.parseVKVars = function ()
{
	this.VKVars = {};
	this.VKVars.user_id = 0;
	var answr = location.search;
	answr = answr.split("&");
	for (var i = 0; i < answr.length; i++) {
		answr[i] = answr[i].split('=');//Создание двумерного массива
		this.VKVars[answr[i][0]] = answr[i][1];//Создание объекта, со свойствами двумерного массива.
	}
	if (this.VKVars.user_id == 0) {
		this.VKVars.user_id = this.VKVars.viewer_id;
	}

};

Person.prototype.getCaseMeshIndex = function ()
{
	return this.VideoMesh.CaseMeshIndex;
};

Person.prototype.setNickname = function (nick)
{
	this.Nickname = nick;
};

Person.prototype.generateID = function ()
{
	this.ID = generateRandomString(11);
};


Person.prototype.generateNickname = function ()
{
	this.Nickname = generateRandomString(11);
};


Person.prototype.getNickname = function ()
{
	return this.Nickname;
};


Person.prototype.getID = function ()
{
	return this.ID;
};

Person.prototype.getUserVKID = function ()
{
	return this.VKVars.user_id;
};

Person.prototype.setUserVKID = function (json_params)
{
	this.VKVars.user_id = json_params.vk_id;
};

Person.prototype.getAccessToken = function ()
{
	return this.VKVars.access_token;
};

Person.prototype.checkPersonAtDB = function ()
{		
	var send_data = "datas=" + JSON.stringify({
		vk_id: this.getUserVKID(),
		mesh_index: this.MeshIndex,
		gun_index: this.GunIndex,
		opened_guns_indexes: this.OpenGunsIndexes,
		opened_meshes_indexes: this.OpenMeshesIndexes,
		opened_bullets_indexes: this.OpenBulletsIndexes,
		date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
		operation: "check_and_save_user"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onCheckSuccessBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});
};
Person.prototype.onCheckSuccess = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	this.loadOpenObjectsIndexes();
};
/*Формирует необходимый объект для */
Person.prototype.getAllVideoMeshCaseParametersForNetMessageJSON = function ()
{
	var params = this.getCubeVideoMeshCaseParametersJSON();
	params.case_mesh_index = this.getCaseMeshIndex();
	return params;
};

/*
	Структура удалённой персоны.
	Используется удалённым пользователем для хранения определённых данных.
*/
var RemotePerson = function (json_params)
{
	this.MeshesBase = GLOBAL_OBJECTS.getMeshesBase();
	this.VideoMesh = {
		Case: null,
		CaseMeshIndex: CASE_MESHES_INDEXES.CUBE,
		TargetMesh: null
	};
}
/*Функция вроде как устанавливает необходимые параметры и материалы структуры КУБА*/
RemotePerson.prototype.setVideoMeshCaseParametersByJSON = function (json_params)
{
	this.VideoMesh.CaseMeshIndex = json_params.data.case_mesh_index;
	
	this.VideoMesh.Case = this.MeshesBase.getMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);

	this.VideoMesh.TargetMesh = this.MeshesBase.getTargetMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);

	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE)
	{
		this.VideoMesh.Case.material.opacity = json_params.data.opacity;
		this.VideoMesh.Case.material.color.setStyle(json_params.data.face_color);
		this.VideoMesh.Case.children[0].material.color.setStyle(json_params.data.edge_color);

		this.VideoMesh.TargetMesh.material.opacity = json_params.data.opacity;
		this.VideoMesh.TargetMesh.material.color.setStyle(json_params.data.face_color);
		this.VideoMesh.TargetMesh.children[0].material.color.setStyle(json_params.data.edge_color);
	}
};

RemotePerson.prototype.getVideoMeshCase = function ()
{
	return this.VideoMesh.Case;
};
RemotePerson.prototype.getTargetMesh = function ()
{
	return this.VideoMesh.TargetMesh;
};
RemotePerson.prototype.getVideoMeshCaseMeshIndex = function ()
{
	return this.VideoMesh.CaseMeshIndex;
};
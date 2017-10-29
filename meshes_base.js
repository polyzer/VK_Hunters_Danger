/*
Модуль содержит все загружаемые и создаваемые Меши.
Все используемые в игре меши должны копироваться из этого модуля!

Функция onSceneLoaded загружает Меши по их индексам.
т.е. name Меша в Сцене должно совпадать с INDEX в GAME_CONSTANTS.
*/
var MeshesBase = function ()
{
	this.onSceneLoadedBF = this.onSceneLoaded.bind(this);
	this.onLoadMeshesPricesFromDBBF = this.onLoadMeshesPricesFromDB.bind(this);
	/*Загрузчик текстур*/
	this.ColladaLoader = new THREE.ColladaLoader();

	var materials = [
	    new THREE.MeshStandardMaterial( { color: 0x000000 } ), // right
	    new THREE.MeshStandardMaterial( { color: 0x000000 } ), // left
	    new THREE.MeshStandardMaterial( { color: 0x000000 } ), // top
	    new THREE.MeshStandardMaterial( { color: 0x000000 } ), // bottom
	    new THREE.MeshStandardMaterial( { map: THREE.ImageUtils.loadTexture('./images/hunter_black_278.png') } ), // back
	    new THREE.MeshStandardMaterial( { color: 0x000000 } )  // front
	];

	this.BlackHunterMesh = new THREE.Mesh(
		new THREE.BoxGeometry(140, 140, 140), 
		new THREE.MultiMaterial( materials )
	);

	materials = [
	    new THREE.MeshStandardMaterial( { color: 0xFF0000 } ), // right
	    new THREE.MeshStandardMaterial( { color: 0xFF0000 } ), // left
	    new THREE.MeshStandardMaterial( { color: 0xFF0000 } ), // top
	    new THREE.MeshStandardMaterial( { color: 0xFF0000 } ), // bottom
	    new THREE.MeshStandardMaterial( { map: THREE.ImageUtils.loadTexture('./images/hunter_black_278.png') } ), // back
	    new THREE.MeshStandardMaterial( { color: 0xFF0000 } )  // front
	];

	this.RedHunterMesh = new THREE.Mesh(
		new THREE.BoxGeometry(200, 200, 200), 
		new THREE.MultiMaterial( materials )
	);

	this.GreenBullet = new THREE.Mesh(
		new THREE.BoxGeometry(100, 100, 100), 
		new THREE.MeshStandardMaterial( {color: 0x19FF13} )
	);

	this.BlackSoul = new THREE.Mesh(
		new THREE.SphereGeometry()
	);

	var prom = this.load3DSceneByCollada(this.ColladaLoader, "./models/Beehive.dae");
	prom.then(this.onSceneLoadedBF);
};

/*
После загрузки сцены мы создаем все необходимые для работы объекты.
*/
MeshesBase.prototype.onSceneLoaded = function (scene)
{
	this.MeshesData = {
		BlackHunter: {
			Index: GAME_CONSTANTS.HUNTERS.BLACK.INDEX,
			Mesh: this.BlackHunterMesh
		},
		RedHunter: {
			Index: GAME_CONSTANTS.HUNTERS.RED.INDEX,
			Mesh: this.BlackHunterMesh
		},
		BlackBeehive: {
			Index: GAME_CONSTANTS.BEEHIVES.BLACK.INDEX,
			Mesh: scene.getObjectByName(GAME_CONSTANTS.BEEHIVES.BLACK.INDEX)
		},
		PlasmaGun: {
			Index: GAME_CONSTANTS.GUNS.PLASMA.INDEX,
			Mesh: this.BlackHunterMesh
		},
		LaserGun: {
			Index: GAME_CONSTANTS.GUNS.LASER.INDEX,
			Mesh: this.BlackHunterMesh
		},
		GreenPlasmaBullet: {
			Index: GAME_CONSTANTS.BULLETS.GREEN_PLASMA.INDEX,
			Mesh: this.GreenBullet
		},
		BlackSoul: {
			Index: GAME_CONSTANTS.HUNTER_SOULS.BLACK.INDEX,
			Mesh: this.BlackSoul
		}
	}
	this.MeshesData.BlackBeehive.Mesh.scale.set(200,200,200);
	window.GLOBAL_OBJECTS.createPerson();
	window.GLOBAL_OBJECTS.createMenu();
};

MeshesBase.prototype.getMeshDataByMeshIndex = function (index)
{
	var keys = Object.keys(this.MeshesData);
	for(var i=0; i< keys.length; i++)
	{
		if(this.MeshesData[keys[i]]["Index"] === index)
		{
			return this.MeshesData[keys[i]]["Mesh"].clone()
			
		}
	}

	throw new Error("Have no Mesh with this Index");	

};

MeshesBase.prototype.setCubeMeshCase = function (cubeMeshCase)
{
	this.CubeMesh = cubeMeshCase;
	this.MeshesData.Cube.Mesh = cubeMeshCase;
};


MeshesBase.prototype.loadMeshesPricesFromDB = function ()
{
	var send_data = "datas="+JSON.stringify({
		operation: "get_meshes_prices"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onLoadMeshesPricesFromDBBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}
	});	
};
MeshesBase.prototype.onLoadMeshesPricesFromDB = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}	

	this.keys = Object.keys(this.MeshesData);
	
	for(var i=0; i< this.keys.length; i++)
	{
		for(var j=0; j < json_params["result_datas"].length; j++)
		{
			if(this.MeshesData[this.keys[i]]["Index"] === json_params["result_datas"][j]["game_case_mesh_index"])
			{
				this.MeshesData[this.keys[i]]["Price"] = parseInt(json_params["result_datas"][j]["price"]);
			}
		}
	}
};

/*Возвращает индекс следующего Меша используя индекс текущего Меша*/
MeshesBase.prototype.getNextMeshIndexByCurrentMeshIndex = function (index)
{
	this.keys = Object.keys(this.MeshesData);
	for(var i=0; i< this.keys.length; i++)
	{
		if(this.MeshesData[this.keys[i]]["Index"] === index)
		{
			if( i === (this.keys.length - 1))
			{
				return this.MeshesData[this.keys[0]]["Index"];
			} else {
				return this.MeshesData[this.keys[i+1]]["Index"];
			}
		}
	}
	throw new Error("Have no Mesh with this Index");	
};

/*Возвращает индекс предыдущего Меша используя индекс текущего Меша*/
MeshesBase.prototype.getPrevMeshIndexByCurrentMeshIndex = function (index)
{
	this.keys = Object.keys(this.MeshesData);
	for(var i=0; i< this.keys.length; i++)
	{
		if(this.MeshesData[this.keys[i]]["Index"] === index)
		{
			if( i === 0)
			{
				return this.MeshesData[this.keys[this.keys.length - 1]]["Index"];
			} else {
				return this.MeshesData[this.keys[i-1]]["Index"];
			}
		}
	}
	throw new Error("Have no Mesh with this Index");	
};

MeshesBase.prototype.getMeshPriceByIndex = function (index)
{
	var keys = Object.keys(this.MeshesData);
	for(var i=0; i< keys.length; i++)
	{
		if(this.MeshesData[keys[i]]["Index"] === index)
		{
			return this.MeshesData[keys[i]]["Price"];
		}
	}

	throw new Error("Have no Mesh with this Index");	
};

/*Returns copy of the Object by Object Index*/
MeshesBase.prototype.getDescriptionByIndex = function (index)
{
	var keys = Object.keys(this.MeshesData);
	for(var i=0; i< keys.length; i++)
	{
		if(this.MeshesData[keys[i]]["Index"] === index)
		{
			return this.MeshesData[keys[i]]["Description"];
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*Returns copy of the Object by Object Index*/
MeshesBase.prototype.getMeshCopyByMeshIndex = function (index)
{
	for(var mesh_name in this.MeshesData)
	{
		if(this.MeshesData.hasOwnProperty(mesh_name))
		{
			if(this.MeshesData[mesh_name]["Index"] === index)
			{
				return this.MeshesData[mesh_name]["Mesh"].clone();
			}
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*Написать ФУКНЦИЮ ЗАГРУЗКИ КУБА ПОЛЬЗОВАТЕЛЯ!*/

/*Returns copy of the Object by Object Index*/
MeshesBase.prototype.getTargetMeshCopyByIndex = function (index)
{
	for(var mesh_name in this.MeshesData)
	{
		if(this.MeshesData.hasOwnProperty(mesh_name))
		{
			if(this.MeshesData[mesh_name]["Index"] === index)
			{
				return this.MeshesData[mesh_name]["TargetMesh"].clone();
			}
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*загружает Меши из внешнего файла. Меши должны быть определены как */
MeshesBase.prototype.load3DSceneByCollada = function (loader, file_str)
{
  return new Promise(
	    function(resolve) 
	    {
	        loader.load(
	            file_str,
	            function(collada) 
	            {											
					resolve(collada.scene);
	            }
	        );
	    }
	);
};

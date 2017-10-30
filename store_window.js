let StoreWindow = function ()
{
	// this.onOpacityRangeInputChangeBF = this.onOpacityRangeInputChange.bind(this);
	// this.onFaceColorInputChangeBF = this.onFaceColorInputChange.bind(this);
	// this.onEdgeColorInputChangeBF = this.onEdgeColorInputChange.bind(this);
	this.updateBF = this.update.bind(this);
	this.onOpenBF = this.onOpen.bind(this);
	this.onCloseBF = this.onClose.bind(this);
	this.onSaveBF = this.onSave.bind(this);
	this.onShowNextObjectButtonClickBF = this.onShowNextObjectButtonClick.bind(this);
	this.onShowPrevObjectButtonClickBF = this.onShowPrevObjectButtonClick.bind(this);
	this.onBuyObjectButtonClickBF = this.onBuyObjectButtonClick.bind(this);
	// this.setLoadedCustomViewParametersBF = this.setLoadedCustomViewParameters.bind(this);

	this.onSaveSuccessBF = this.onSaveSuccess.bind(this);
	this.onSaveErrorBF = this.onSaveError.bind(this);

	this.updating = false;

	this.StoreWindowDiv = document.createElement("div");
	this.StoreWindowDiv.setAttribute("id", "StoreWindowDiv");

	/*Кнопка закрытия магазина*/
	this.CloseWindowButton = document.createElement("div");
	this.CloseWindowButton.setAttribute("id", "CloseWindowButton");
	this.CloseWindowButton.appendChild(document.createTextNode("Закрыть"));
	this.CloseWindowButton.addEventListener("click", this.onCloseBF);

	/*Сохраняем данные*/
	this.SaveOptionsButton = document.createElement("div");
	this.SaveOptionsButton.setAttribute("id", "SaveCustomizeOptionsButton");
	this.SaveOptionsButton.appendChild(document.createTextNode("Сохранить"));
	this.SaveOptionsButton.addEventListener("click", this.onSaveBF);

	/*Кнопка, по нажатию на которую показывается следующий объект (слева)*/
	this.ShowNextObjectButton = document.createElement("div");
	this.ShowNextObjectButton.setAttribute("id", "ShowNextObjectButton");
	this.ShowNextObjectButton.addEventListener("click", this.onShowNextObjectButtonClickBF);

	/*Кнопка, по нажатию на которую показывается предыдущий объект (справа)*/
	this.ShowPrevObjectButton = document.createElement("div");
	this.ShowPrevObjectButton.setAttribute("id", "ShowPrevObjectButton");
	this.ShowPrevObjectButton.addEventListener("click", this.onShowPrevObjectButtonClickBF);

	/*Кнопка покупки объекта*/
	this.BuyObjectButton = document.createElement("div");
	this.BuyObjectButton.setAttribute("id", "BuyObjectButton");
	this.BuyObjectButton.appendChild(document.createTextNode("Купить"));
	this.BuyObjectButton.addEventListener("click", this.onBuyObjectButtonClickBF);

	/*Price Label*/
	this.PriceLabel = document.createElement("div");
	this.PriceLabel.setAttribute("id", "PriceLabel");
	this.PriceLabel.appendChild(document.createTextNode("0"));

	/*It contains BuyObjectButton and PriceLabel.*/
	this.BuyContainer = document.createElement("div");
	this.BuyContainer.setAttribute("id", "BuyContainer");
	this.BuyContainer.appendChild(this.PriceLabel);
	this.BuyContainer.appendChild(this.BuyObjectButton);

	/*Окно предпросмотра вида пользовательского Объекта*/
	this.UserObjectView = {};
	this.UserObjectView.Scene = new THREE.Scene();
	
	this.UserObjectView.Container = document.createElement("div");
	this.UserObjectView.Container.setAttribute("id", "UserObjectPreviewContainer");
	
	this.UserObjectView.Description = document.createElement("div");
	this.UserObjectView.Description.setAttribute("id", "UserObjectDescription");
	this.UserObjectView.Description.appendChild(document.createTextNode(""));

	this.UserObjectView.ViewDescriptionDiv = document.createElement("div");
	this.UserObjectView.ViewDescriptionDiv.setAttribute("id", "ViewDescriptionDiv");
	
	this.UserObjectView.Renderer = new THREE.WebGLRenderer({antialias: true, shadows: true});
	this.UserObjectView.Renderer.setSize(500, 300);	
	this.UserObjectView.WorldBox = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), new THREE.MeshStandardMaterial({color: 0xf0f9f0, side: THREE.DoubleSide}));
	this.UserObjectView.Camera = new THREE.PerspectiveCamera(
		GAME_CONSTANTS.CAMERA_PARAMETERS.ANGLE, 
		500/300, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.NEAR, 
		GAME_CONSTANTS.CAMERA_PARAMETERS.FAR
	);
	/*
		Кнопки выбора раздела Товаров.
	*/
	this.GoodsSectionSelect = {
		GunsSelectButton: document.createElement("div"),
		MeshesSelectButton: document.createElement("div"),
		BulletsSelectButton: document.createElement("div"),
		Div: document.createElement("div")
	};

	this.GoodsSectionSelect.Div.setAttribute("id", "GoodsSectionSelectDiv")
	this.GoodsSectionSelect.GunsSelectButton.setAttribute("id", "GunsSelectButton");
	this.GoodsSectionSelect.MeshesSelectButton.setAttribute("id", "MeshesSelectButton");
	this.GoodsSectionSelect.BulletsSelectButton.setAttribute("id", "BulletsSelectButton");

	this.GoodsSectionSelect.Div.appendChild(this.GoodsSectionSelect.GunsSelectButton);
	this.GoodsSectionSelect.Div.appendChild(this.GoodsSectionSelect.MeshesSelectButton);
	this.GoodsSectionSelect.Div.appendChild(this.GoodsSectionSelect.BulletsSelectButton);

	this.UserObjectView.Camera.position.z = 400;

	this.ambientlight = new THREE.AmbientLight( 0xffffff, 2 );	

	this.Person = window.GLOBAL_OBJECTS.getPerson();	
	this.MeshesBase = window.GLOBAL_OBJECTS.getMeshesBase();

	/*Данные для текущего отображаемого Меша*/
	this.ShowMeshData = {
		Mesh: null,
		MeshIndex: 1,
		Price: 0,
		Description: "Description"
	};


	this.UserObjectView.Scene.add(this.UserObjectView.WorldBox);
	this.UserObjectView.Scene.add(this.ambientlight);


	// /*Секция покупки возможности кастомизации*/
	// this.CustomizeSection = {};

	// this.CustomizeSection.CustomizeSectionDiv = document.createElement("div");
	// this.CustomizeSection.CustomizeSectionDiv.setAttribute("id", "CustomizeSectionDiv");

	// /*Ползунок выбора прозрачности*/
	// this.CustomizeSection.SetOpacityRangeInput = document.createElement("input");
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("id", "CustomizeOpacityRangeInput");
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("type", "range");
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("min", 0);
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("max", 1);	
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("step", 0.01);	
	// this.CustomizeSection.SetOpacityRangeInput.setAttribute("value", this.Person.VideoMesh.Case.material.opacity);
	// this.CustomizeSection.SetOpacityRangeInput.addEventListener("input", this.onOpacityRangeInputChangeBF);	
	// this.CustomizeSection.SetOpacityRangeLabel = document.createElement("label");
	// this.CustomizeSection.SetOpacityRangeLabel.setAttribute("for", "CustomizeOpacityRangeInput");
	// this.CustomizeSection.SetOpacityRangeLabel.innerText = "Прозрачность";

	// /*Инпут выбора цвета граней.*/
	// this.CustomizeSection.SetFaceColorInput = document.createElement("input");
	// this.CustomizeSection.SetFaceColorInput.setAttribute("id", "CustomizeFaceColorInput");
	// this.CustomizeSection.SetFaceColorInput.setAttribute("type", "color");
	// this.CustomizeSection.SetFaceColorInput.setAttribute("value", "#" + this.Person.VideoMesh.Case.material.color.getHexString());
	// this.CustomizeSection.SetFaceColorInput.addEventListener("input", this.onFaceColorInputChangeBF);
	// this.CustomizeSection.SetFaceColorLabel = document.createElement("label");
	// this.CustomizeSection.SetFaceColorLabel.setAttribute("for", "CustomizeFaceColorInput");
	// this.CustomizeSection.SetFaceColorLabel.innerText = "Цвет объекта:";

	// /*Инпут выбора цвета ребер.*/
	// this.CustomizeSection.SetEdgeColorInput = document.createElement("input");
	// this.CustomizeSection.SetEdgeColorInput.setAttribute("id", "CustomizeEdgeColorInput");
	// this.CustomizeSection.SetEdgeColorInput.setAttribute("type", "color");
	// this.CustomizeSection.SetEdgeColorInput.setAttribute("value", "#" + this.Person.VideoMesh.Case.children[0].material.color.getHexString());	
	// this.CustomizeSection.SetEdgeColorInput.addEventListener("input", this.onEdgeColorInputChangeBF);	
	// this.CustomizeSection.SetEdgeColorLabel = document.createElement("label");
	// this.CustomizeSection.SetEdgeColorLabel.setAttribute("for", "CustomizeEdgeColorInput");
	// this.CustomizeSection.SetEdgeColorLabel.innerText = "Цвет ребер:";


	this.UserObjectView.Container.appendChild(this.UserObjectView.Renderer.domElement);

	this.StoreWindowDiv.appendChild(this.ShowNextObjectButton);
	this.StoreWindowDiv.appendChild(this.ShowPrevObjectButton);

	this.StoreWindowDiv.appendChild(this.GoodsSectionSelect.Div);

	/*Добавляем кнопку закрытия окна магазина*/
	this.StoreWindowDiv.appendChild(this.CloseWindowButton);
	/*добавили контейнер для 3d объекта*/
	this.UserObjectView.ViewDescriptionDiv.appendChild(this.UserObjectView.Container);
	this.UserObjectView.ViewDescriptionDiv.appendChild(this.UserObjectView.Description);	

	// /*добавили настройку прозрачности*/
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetOpacityRangeLabel);	
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetOpacityRangeInput);
	// /*добавили настройку настройку цвета ребер*/
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetEdgeColorLabel);	
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetEdgeColorInput);
	// /*добавили настройку цвета граней */
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetFaceColorLabel);	
	// this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetFaceColorInput);

	/*добавили div содержащий настройки кастомизации и */
	this.StoreWindowDiv.appendChild(this.UserObjectView.ViewDescriptionDiv);
	// this.StoreWindowDiv.appendChild(this.CustomizeSection.CustomizeSectionDiv);
	/*добавили кнопку сохранения настроек*/
	this.StoreWindowDiv.appendChild(this.SaveOptionsButton);

//	this.loadSavedCustomViewParameters();

	this.Goods = {
		Guns: [],
		Meshes: [],
		Others: [],
		Bullets: []
	};
	// Указатель на текущий товар;
	this.CurrentGood = {
		// Секция
		Section: this.Goods.Guns,
		// Индекс в секции
		SectionIndex: 0,

		SectionName: "Guns"
	};
	this.init();
	document.body.appendChild(this.StoreWindowDiv);
};
/*
	Функция делает начальную настройку и установку всех нужных параметров.
*/
StoreWindow.prototype.init = function ()
{
	this.getGoodItemsFromDB();
};

StoreWindow.prototype.getGoodItemsFromDB = function ()
{
	let send_data = "datas=" + JSON.stringify({
		operation: "get_all_good_items",
		vk_id: this.Person.getUserVKID()
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.setLoadedGoodItems.bind(this),
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};
/*Функция создаёт и устанавливает все нужные игровые предметы для продажи*/
StoreWindow.prototype.setLoadedGoodItems = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	for(let i=0; i< json_params["result_datas"].length; i++)
	{
		let gItem = new GoodItem({
			GoodGameIndex: json_params["result_datas"][i]["good_game_index"],
			Price: json_params["result_datas"][i]["price"],
			Description: json_params["result_datas"][i]["description"],
			Type: json_params["result_datas"][i]["type"],
			Count: json_params["result_datas"][i]["count"]
		});
		switch(gItem.Type)
		{
			case GAME_CONSTANTS.GOODS.TYPES.GUN:
				this.Goods.Guns.push(gItem);
			break;
			case GAME_CONSTANTS.GOODS.TYPES.MESH:
				this.Goods.Meshes.push(gItem);
			break;
			case GAME_CONSTANTS.GOODS.TYPES.OTHER:
				this.Goods.Others.push(gItem);			
			break;
			case GAME_CONSTANTS.GOODS.TYPES.BULLET:
				this.Goods.Bullets.push(gItem);			
			break;
		}
	}

	this.setCurrentGoodsSection("Guns");

};
/*Устанавливает указатель на текущий раздел товаров по имени секции.*/
StoreWindow.prototype.setCurrentGoodsSection = function (SectionName)
{
	this.CurrentGood.Section = this.Goods[SectionName];
	this.CurrentGood.SectionIndex = 0;
	this.setGoodToVisualByCurrentGood();
};

StoreWindow.prototype.setGoodToVisualByCurrentGood = function ()
{
	/*удаляем старый Меш со сцены*/
	this.UserObjectView.Scene.remove(this.ShowMeshData.Mesh);
	/*теперь получаем данные от персоны и загружаем меш и данные из МешБейса*/
	this.ShowMeshData.MeshIndex = this.CurrentGood["Section"][this.CurrentGood.SectionIndex].getGoodGameIndex();	
	this.ShowMeshData.Mesh = this.CurrentGood["Section"][this.CurrentGood.SectionIndex].getMesh();
	this.ShowMeshData.Price = this.CurrentGood["Section"][this.CurrentGood.SectionIndex].getPrice();
	this.ShowMeshData.Description = this.CurrentGood["Section"][this.CurrentGood.SectionIndex].getDescription();
	/*обновляем всё, что нужно обновить*/
	this.updatePriceLabel();
	this.updateMeshDescription();
	this.UserObjectView.Scene.add(this.ShowMeshData.Mesh);
};

/*Устанавливает инпуты в зависимости от переданного элемента*/
StoreWindow.prototype.setCustomizeUIElementsByCubeMesh = function (mesh)
{
	this.CustomizeSection.SetOpacityRangeInput.value = mesh.material.opacity;
	this.CustomizeSection.SetEdgeColorInput.value = mesh.children[0].material.color;
	this.CustomizeSection.SetFaceColorInput.value = mesh.material.color;
};
/*Устанавливает инпуты в зависимости от переданного элемента*/
StoreWindow.prototype.setCustomizeUIElementsByJSON = function (json_params)
{
	this.CustomizeSection.SetOpacityRangeInput.value = json_params["result_datas"]["opacity"];
	this.CustomizeSection.SetEdgeColorInput.value = json_params["result_datas"]["edge_color"];
	this.CustomizeSection.SetFaceColorInput.value = json_params["result_datas"]["face_color"];
};

/*Обработчик нажатия на кнопку покупки*/
StoreWindow.prototype.onBuyObjectButtonClick = function ()
{
	let params = { 
	    type: 'item', 
	    item: 'item_25new' 
  	}; 
  	VK.callMethod('showOrderBox', params);
	this.Person.addMeshIndexToOpenMeshesAndSaveToDB(this.ShowMeshData.MeshIndex);
};

/*Получаем данные из Person и загружаем первоначальный Меш*/
StoreWindow.prototype.getMeshFromPersonAndLoadMesh = function ()
{
	/*удаляем старый Меш со сцены*/
	this.UserObjectView.Scene.remove(this.ShowMeshData.Mesh);
	/*теперь получаем данные от персоны и загружаем меш и данные из МешБейса*/
	this.ShowMeshData.MeshIndex = this.Person.getMeshIndex();
	let tdata = this.MeshesBase.getMeshDataByMeshIndex(this.ShowMeshData.MeshIndex);
	if(tdata){
		this.ShowMeshData.Mesh = tdata.mesh;
		this.ShowMeshData.Price = tdata.price;
		this.ShowMeshData.Description = tdata.description;	
		this.ShowMeshData.Customizable = tdata.customizable;	
	}
	/*обновляем всё, что нужно обновить*/
	this.updatePriceLabel();
	this.updateMeshDescription();
	this.UserObjectView.Scene.add(this.ShowMeshData.Mesh);
};

StoreWindow.prototype.updatePriceLabel = function ()
{
	this.PriceLabel.firstChild.data = this.ShowMeshData.Price;
};
StoreWindow.prototype.updateMeshDescription = function ()
{
	this.UserObjectView.Description.firstChild.data = this.ShowMeshData.Description;
};
/*
	Функция добавляет или удаляет кнопку покупки Меша в зависимости от того,
	куплен он уже или нет.
*/
StoreWindow.prototype.toggleBuyButtonIfMeshWasBought = function (index)
{
	let pindex = index;
	if(!pindex){
		pindex = this.ShowMeshData.MeshIndex;
	}

	if(!this.Person.isMeshIndexInOpenMeshesIndexes(pindex))
	{
		if(!this.UserObjectView.ViewDescriptionDiv.contains(this.BuyContainer))
			this.UserObjectView.ViewDescriptionDiv.insertBefore(this.BuyContainer, this.UserObjectView.Description);
	} else
	{
		if(this.UserObjectView.ViewDescriptionDiv.contains(this.BuyContainer))
			this.UserObjectView.ViewDescriptionDiv.removeChild(this.BuyContainer);		
	}

}
/*
	Функция добавляет или удаляет кнопку покупки Меша в зависимости от того,
	куплен он уже или нет.
*/
StoreWindow.prototype.controlCustomizeSection = function ()
{
	if(this.ShowMeshData.Customizable)
	{
		if(!this.StoreWindowDiv.contains(this.CustomizeSection.CustomizeSectionDiv))
			this.StoreWindowDiv.appendChild(this.CustomizeSection.CustomizeSectionDiv);
	} else
	{
		if(this.StoreWindowDiv.contains(this.CustomizeSection.CustomizeSectionDiv))
			this.StoreWindowDiv.removeChild(this.CustomizeSection.CustomizeSectionDiv);
	}

}
/*Обработчик нажатия на кнопку обзора предыдущего объекта*/
StoreWindow.prototype.onShowPrevObjectButtonClick = function ()
{
	if(this.CurrentGood.SectionIndex === 0)
		this.CurrentGood.SectionIndex = this.Goods[this.CurrentGood.SectionName].length - 1;
	else
		this.CurrentGood.SectionIndex--;

	this.setGoodToVisualByCurrentGood();
};
/*Обработчик нажатия на кнопку обзора следующего объекта*/
StoreWindow.prototype.onShowNextObjectButtonClick = function ()
{
	if(this.CurrentGood.SectionIndex === this.Goods[this.CurrentGood.SectionName].length - 1)
			this.CurrentGood.SectionIndex = 0;
	else
		this.CurrentGood.SectionIndex++;

	this.setGoodToVisualByCurrentGood();
};

StoreWindow.prototype.getOpenStoreWindowListener = function ()
{
	return this.onOpenBF;
};

StoreWindow.prototype.onOpen = function ()
{
	this.updating = true;
	requestAnimationFrame(this.updateBF);
	$("#StoreWindowDiv").show();
};

StoreWindow.prototype.onClose = function ()
{
	this.updating = false;
	$("#StoreWindowDiv").hide();
};

/**/
StoreWindow.prototype.update = function ()
{
	this.ShowMeshData.Mesh.rotation.y += 0.02;
	this.UserObjectView.Renderer.render(this.UserObjectView.Scene, this.UserObjectView.Camera);
	if(this.updating === true)
		requestAnimationFrame(this.updateBF);
};


/*Загружает сохраненные настройки вида с сервера*/ 
StoreWindow.prototype.loadSavedCustomViewParameters = function ()
{
	let send_data = "datas=" + JSON.stringify({
		operation: "get_custom_mesh_view_params",
		vk_id: this.Person.getUserVKID()
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
StoreWindow.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}

	/*Если сервер сказал, что данные доступны!*/
	if(json_params["server_answer"] === "YES_DATA")
	{
		this.MeshesBase.setCubeMeshParametersJSON(json_params);
		this.setCustomizeUIElementsByJSON(json_params);

	} else if(json_params["server_answer"] === "NO_DATA")
	{
		console.log("User hasn't custom view VisualKeeper parameters");
	} else
	{
		console.log("something is wrong :(");
	}
};


/*Обработчик нажатия на кнопку сохранить*/
StoreWindow.prototype.onSave = function ()
{
	this.Person.setMeshIndex(this.ShowMeshData.MeshIndex);

	let send_data = "datas=" + JSON.stringify({
		vk_id: this.Person.getUserVKID(),
		date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
		open_meshes: this.Person.getOpenMeshesSaveString(),
		case_mesh_index: this.ShowMeshData.MeshIndex,
		operation: "save_custom_mesh_view_params"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onSaveSuccessBF,
		error: this.onSaveErrorBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});
};

StoreWindow.prototype.onSaveSuccess = function (json_params)
{
	console.log(json_params);
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	this.onCloseBF();
};

StoreWindow.prototype.onSaveError = function (jqXHR, textStatus,errorThrown)
{ 
	console.log(errorThrown + " " + textStatus);
}

/*Когда пользователь настраивает прозрачность*/
StoreWindow.prototype.onOpacityRangeInputChange = function ()
{
	this.Person.VideoMesh.Case.material.opacity = this.CustomizeSection.SetOpacityRangeInput.value;
};

/*Когда пользователь настраивает прозрачность*/
StoreWindow.prototype.onFaceColorInputChange = function ()
{
	this.Person.VideoMesh.Case.material.color.setStyle(this.CustomizeSection.SetFaceColorInput.value);
};

/*Когда пользователь настраивает прозрачность*/
StoreWindow.prototype.onEdgeColorInputChange = function ()
{
	this.Person.VideoMesh.Case.children[0].material.color.setStyle(this.CustomizeSection.SetEdgeColorInput.value);
};


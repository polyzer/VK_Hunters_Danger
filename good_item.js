var GoodItem = function (json_params)
{
	var json_params_names = [
		"Description", //Описание
		"GoodGameIndex", // визуальный Меш
		"Price", // Цена в голосах
		"Type", // Тип
		"Count"
	];

	setParametersByArray.call(this, json_params, json_params_names);

 	this.Mesh = GLOBAL_OBJECTS.getMeshesBase().getMeshDataByMeshIndex(this.GoodGameIndex);
};

GoodItem.prototype.getMesh = function ()
{
	return this.Mesh;
};

GoodItem.prototype.getDescription = function ()
{
	return this.Description;
};

GoodItem.prototype.getGoodGameIndex = function ()
{
	return this.GoodGameIndex;
};

GoodItem.prototype.getPrice = function ()
{
	return this.Price;
};

GoodItem.prototype.getType = function ()
{
	return this.Type;
};

GoodItem.prototype.getCount = function ()
{
	return this.Count;
};
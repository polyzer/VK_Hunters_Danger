var FlyingObjects = function (scene)
{
	this.Scene = scene;

	this.MovingMeshes = [];
	for (var i=0; i<FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.BoxGeometry(150, 150, 150), 
				new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: Math.random()*0.2+0.7, transparent: true})
			);
		el.position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		this.MovingMeshes.push(el);
		this.Scene.add(el);
	}

	for(var i=0; i < FLYING_OBJECTS.FARTHER_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.SphereGeometry(30+Math.round(Math.random()*-3), 32, 32), 
				new THREE.MeshStandardMaterial({color: 0xd2fff0, opacity: 0.9, transparent: true})
			);
		el.position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		this.MovingMeshes.push(el);
		this.Scene.add(el);
	}


};

FlyingObjects.prototype.update = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
		if(this.MovingMeshes[i].position.y >= WORLD_CUBE.SCALED_SIZE.y)
		{
			this.MovingMeshes[i].position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
			this.MovingMeshes[i].position.y = (-0.5) * WORLD_CUBE.SCALED_SIZE.y;
			this.MovingMeshes[i].position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
			this.MovingMeshes[i].material.color.set(0xffffff*Math.random());			
			this.MovingMeshes[i].MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		} else
		{
			this.MovingMeshes[i].position.y += this.MovingMeshes[i].MoveSpeed;
		}
	}

	for(var i= FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i<(FLYING_OBJECTS.NEAREST_OBJECTS_COUNT+FLYING_OBJECTS.FARTHER_OBJECTS_COUNT); i++)
	{		
		if(this.MovingMeshes[i].position.y >= WORLD_CUBE.SCALED_SIZE.y)
		{
			this.MovingMeshes[i].position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
			this.MovingMeshes[i].position.y = (-0.5) * WORLD_CUBE.SCALED_SIZE.y;
			this.MovingMeshes[i].position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
			this.MovingMeshes[i].MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		} else
		{
			this.MovingMeshes[i].position.y += this.MovingMeshes[i].MoveSpeed;
		}
	}	

};

FlyingObjects.prototype.resetPositionsAndColors = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
			this.MovingMeshes[i].material.color = 0xffffff*Math.random();
			this.MovingMeshes[i].position.x = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.x;
			this.MovingMeshes[i].position.y = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.y;
			this.MovingMeshes[i].position.z = (Math.random() - 0.5) * WORLD_CUBE.SCALED_SIZE.z;
	}
};
<?php 
	session_start();
	$_SESSION["vk_hunters_danger"]["true_connection"] = "true";
?>
<!DOCTYPE html>
<html> 
<head>
<meta charset="UTF-8" /> 
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
<link rel="stylesheet" href="./css/style.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.25.0/babel.min.js"></script>
<script src='../games_resources/libs/three.js-87/build/three.min.js'></script>
<script src='../games_resources/libs/three.js-87/examples/js/controls/FlyControls.js'></script>
<script src='../games_resources/libs/three.js-87/examples/js/renderers/CSS3DRenderer.js'></script>
<script src='../games_resources/libs/three.js-87/examples/js/loaders/ColladaLoader2.js'></script>
<script src="../games_resources/libs/jquery.js"></script>
<script src="../games_resources/libs/peer.min.js"></script>

<script type="text/javascript" src="./constants_and_general_functions.js"></script>
<script type="text/javascript" src="./hunter_soul.js"></script>
<script type="text/javascript" src="./hunter.js"></script>
<script type="text/javascript" src="./beehive.js"></script>
<script type="text/javascript" src="./person.js"></script>
<script type="text/javascript" src="./good_item.js"></script>
<script type="text/javascript" src="./store_window.js"></script>
<script type="text/javascript" src="./room.js"></script>
<script type="text/javascript" src="./player_ship_guns_bullet.js"></script>
<script type="text/javascript" src="./player_ship_guns.js"></script>
<script type="text/javascript" src="./player_ship.js"></script>
<script type="text/javascript" src="./players.js"></script>

<script type="text/javascript" src="./game.js"></script>
<script type="text/javascript" src="./menu.js"></script>
<script type="text/javascript" src="./meshes_base.js"></script>
<script type="text/javascript" src="./global_objects.js"></script>

<script src="https://vk.com/js/api/xd_connection.js?2"  type="text/javascript"></script>
</head>
<script type="text/javascript">

if(VK)
{
	VK.init(function() { 
	    window.VK_WAS_INIT = true; 
	//    createCallFriendsList();
		var GLOBAL_OBJECTS = new GlobalObjects();
	
	}, function() { 
	    window.VK_WAS_INIT = false;
	}, '5.63'); 
}



// AdapterJS.webRTCReady(function(isUsingPlugin) {

// if(isUsingPlugin === true)
// 	window.isUsingPlugin = true;



// 	window.Peer = new Peer({
// 		host: PEER_SERVER_ADDR, 
// 		port: PEER_PORT_ADDR, 
// 		path: PEER_PATH_ADDR,
// 		debug: true
// 	});


// 	window.Peer.on("open", function () {

// 		let GLOBAL_OBJECTS = new _GlobalObjects();
// 	});
// 	window.Peer.on("error", function (err) {
// 		switch(err.type)
// 		{
// 			case "browser-incompatible":
// 				let error_div = document.createElement("div");
// 				let text = "Ваш веб-браузер не поддерживает необходимых технологий :( Для работы работы с приложением рекомендуется использовать последнюю версию Google Chrome или Mozilla Firefox ;)";
// 				error_div.appendChild(document.createTextNode(text));
// 				error_div.setAttribute("id", "on_tech_error");
// 				document.body.appendChild(error_div);
// 			break;
// 		}
// 	});

// });

</script>
</body>
</html>

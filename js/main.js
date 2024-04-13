import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GameMap } from "./Game/World/GameMap.js";
import { Character } from "./Game/Behaviour/Character.js";
import { Guardian } from "./Game/Behaviour/Guardian.js";
import { Player } from "./Game/Behaviour/Player.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { Resources } from "./Util/Resources.js";
import { GameObject } from "./Game/Static-Objects/Object.js";

// Models
let files = [
	{ name: "Arlo", url: "./public/models/Arlo.glb" },
	{ name: "Guardian", url: "./public/models/Guardian.glb" },
	{ name: "SkyWatcher", url: "./public/models/Drone.glb" },
	{ name: "StartShrine", url: "./public/models/TempleEnter.glb" },
	{ name: "Sword", url: "./public/models/Chest.glb" },
	{ name: "AppleTree", url: "./public/models/AppleTree.glb" },
	{ name: "Bush", url: "./public/models/Bush.glb" },
	{ name: "Cabin", url: "./public/models/CabinintheWoods.glb" },
	{ name: "Tree", url: "./public/models/Tree.glb" },
];
const resources = new Resources(files);
await resources.loadAll();

const background_texture = new THREE.TextureLoader().load(
	"./public/assets/1.jpg"
);

// Create Scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Create clock
const clock = new THREE.Clock();

// Controller for player
const controller = new Controller(document, camera);

// GameMap
let gameMap;

// Player
let player;

// Guardians
let guardian;
let guardian2;
let guardian3;

// Skywatchers
let guardian4;
let guardian5;
let guardian6;
let guardian7;

// Shrines
let startShrine;
let endShrine;

// Swords
let sword;

function showNotification(message) {
	let notification = document.getElementById("notification");
	notification.innerHTML = message;
	notification.style.display = "block";

	document.addEventListener("keydown", function (event) {
		if (event.key.startsWith("x")) {
			let notification = document.getElementById("notification");
			notification.style.display = "none";
		}
	});
}

// Setup our scene
function setup() {
	scene.background = background_texture;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//Create Light
	let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 5, 5);
	scene.add(directionalLight);

	// initialize our gameMap
	gameMap = new GameMap();
	gameMap.init(scene);

	// Create Player
	player = new Player(new THREE.Color(0xff0000));
	player.setModel(resources.get("Arlo"));

	// Create Guardians
	guardian = new Guardian(new THREE.Color(0x000000), player, gameMap);
	guardian.setModel(resources.get("Guardian"));
	guardian2 = new Guardian(new THREE.Color(0x000000), player, gameMap);
	guardian2.setModel(resources.get("Guardian"));
	guardian3 = new Guardian(new THREE.Color(0x000000), player, gameMap);
	guardian3.setModel(resources.get("Guardian"));
	guardian4 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	guardian4.setModel(resources.get("Guardian"));
	guardian5 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	guardian5.setModel(resources.get("Guardian"));
	guardian6 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	guardian6.setModel(resources.get("Guardian"));
	guardian7 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	guardian7.setModel(resources.get("Guardian"));

	// Create Shrines
	startShrine = new GameObject(new THREE.Color(0xffffff));
	startShrine.setModel(resources.get("StartShrine"));
	endShrine = new GameObject(new THREE.Color(0xffffff));
	endShrine.setModel(resources.get("StartShrine"));

	// Swords
	sword = new GameObject(new THREE.Color(0xffffff));
	sword.setModel(resources.get("Sword"));

	gameMap.sword = sword;

	// Add the character to the scene
	scene.add(player.gameObject);
	scene.add(guardian.gameObject);
	scene.add(guardian2.gameObject);
	scene.add(guardian3.gameObject);
	scene.add(guardian4.gameObject);
	scene.add(guardian5.gameObject);
	scene.add(guardian6.gameObject);
	scene.add(guardian7.gameObject);
	scene.add(startShrine.gameObject);
	scene.add(endShrine.gameObject);
	scene.add(sword.gameObject);

	// Get a random starting place for the enemy
	let startPlayer = gameMap.graph.startShrineNode;
	let startGuardian = gameMap.graph.getRandomEmptyTile();
	let startGuardian2 = gameMap.graph.getRandomEmptyTile();
	let startGuardian3 = gameMap.graph.getRandomEmptyTile();
	let startGuardian4 = gameMap.graph.getRandomEmptyTile();
	let startGuardian5 = gameMap.graph.getRandomEmptyTile();
	let startGuardian6 = gameMap.graph.getRandomEmptyTile();
	let startGuardian7 = gameMap.graph.getRandomEmptyTile();
	let startStartShrine = gameMap.graph.startShrineNode;
	let startEndShrine = gameMap.graph.endShrineNode;
	let startSword = gameMap.graph.swordNode;
	// this is where we start the player
	player.location = gameMap.localize(startPlayer);
	guardian.location = gameMap.localize(startGuardian);
	guardian2.location = gameMap.localize(startGuardian2);
	guardian3.location = gameMap.localize(startGuardian3);
	guardian4.location = gameMap.localize(startGuardian4);
	guardian5.location = gameMap.localize(startGuardian5);
	guardian6.location = gameMap.localize(startGuardian6);
	guardian7.location = gameMap.localize(startGuardian7);
	startShrine.location = gameMap.localize(startStartShrine);
	startShrine.gameObject.position.set(
		startShrine.location.x,
		startShrine.location.y,
		startShrine.location.z
	);
	endShrine.location = gameMap.localize(startEndShrine);
	endShrine.gameObject.position.set(
		endShrine.location.x,
		endShrine.location.y,
		endShrine.location.z
	);
	sword.location = gameMap.localize(startSword);
	sword.gameObject.position.set(
		sword.location.x,
		sword.location.y,
		sword.location.z
	);

	camera.position.set(0, 245, 0);
	camera.rotation.x = Math.PI;
	scene.add(gameMap.gameObject);

	//First call to animate

	showNotification(
		`Greetings, brave adventurer,<br><br>In this grand RPG, you assume the role of Arlo, tasked with a noble quest: to retrieve the Master Sword from the treacherous Guardian's Gauntlet in order to vanquish the malevolent Calamity Ganon. Your journey began when you uncovered the Hidden Shrine in the vast land of Hyrule, a shrine that revealed the path to the Gauntlet.<br><br>Beware, for the Gauntlet is heavily guarded by vigilant guardians who will pursue you relentlessly upon sight. Your goal is to locate and claim the Master Sword, but be warned: once you do, the guardians will be alerted and will hasten to the shrine's location to impede your escape.<br><br>You must race against time and the guardians to reach the shrine before they do. Failure to do so could mean dire consequences for Hyrule, as the darkness of Calamity Ganon may engulf the land forevermore.<br><br>Remember, your father, the legendary hero Link, entrusted you with this vital task. Make each step count, for the fate of Hyrule hangs in the balance.<br><br>Use the arrow keys to navigate Arlo through this perilous journey. Press q to quit the game at any point. Press the down key to begin your adventure and exit the entrance shrine. May the courage of the hero's bloodline guide you to victory!<br><br>Press x to dismiss`
	);
	animate();
}

// animate
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	let deltaTime = clock.getDelta();

	player.update(deltaTime, gameMap, controller);
	guardian.update(deltaTime, gameMap, player);
	guardian2.update(deltaTime, gameMap, player);
	guardian3.update(deltaTime, gameMap, player);
	guardian4.update(deltaTime, gameMap, player);
	guardian5.update(deltaTime, gameMap, player);
	guardian6.update(deltaTime, gameMap, player);
	guardian7.update(deltaTime, gameMap, player);
	orbitControls.update();
	controller.setWorldDirection();
}

setup();

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// Update the renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add a resize event listener
window.addEventListener("resize", onWindowResize);

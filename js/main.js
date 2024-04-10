import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GameMap } from "./Game/World/GameMap.js";
import { Character } from "./Game/Behaviour/Character.js";
import { Guardian } from "./Game/Behaviour/Guardian.js";
import { Player } from "./Game/Behaviour/Player.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { Resources } from "./Util/Resources.js";

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
let skywatcher;
let skywatcher2;
let skywatcher3;

// Setup our scene
function setup() {
	scene.background = new THREE.Color(0x87ceeb);
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
	guardian = new Guardian(new THREE.Color(0x000000), player, gameMap);
	guardian2 = new Guardian(new THREE.Color(0x000000), player, gameMap);
	guardian3 = new Guardian(new THREE.Color(0x000000), player, gameMap);

	skywatcher = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	skywatcher2 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);
	skywatcher3 = new Guardian(new THREE.Color(0xffc0cb), player, gameMap);

	// Add the character to the scene
	scene.add(player.gameObject);
	scene.add(guardian.gameObject);
	scene.add(guardian2.gameObject);
	scene.add(guardian3.gameObject);
	scene.add(skywatcher.gameObject);
	scene.add(skywatcher2.gameObject);
	scene.add(skywatcher3.gameObject);

	// Get a random starting place for the enemy
	let startPlayer = gameMap.graph.startShrineNode;
	let startGuardian = gameMap.graph.getRandomEmptyTile();
	let startGuardian2 = gameMap.graph.getRandomEmptyTile();
	let startGuardian3 = gameMap.graph.getRandomEmptyTile();
	let startSkyWatcher = gameMap.graph.getRandomEmptyTile();
	let startSkyWatcher2 = gameMap.graph.getRandomEmptyTile();
	let startSkyWatcher3 = gameMap.graph.getRandomEmptyTile();

	// this is where we start the player
	player.location = gameMap.localize(startPlayer);
	guardian.location = gameMap.localize(startGuardian);
	guardian2.location = gameMap.localize(startGuardian2);
	guardian3.location = gameMap.localize(startGuardian3);
	skywatcher.location = gameMap.localize(startSkyWatcher);
	skywatcher.location.y = 30;
	skywatcher2.location = gameMap.localize(startSkyWatcher2);
	skywatcher2.location.y = 30;
	skywatcher3.location = gameMap.localize(startSkyWatcher3);
	skywatcher3.location.y = 30;

	camera.position.set(player.location.x, player.location.y, player.location.z);
	camera.lookAt(
		player.gameObject.position.x,
		player.gameObject.position.y,
		player.gameObject.position.z
	);

	scene.add(gameMap.gameObject);

	//First call to animate
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
	skywatcher.update(deltaTime, gameMap, player);
	skywatcher2.update(deltaTime, gameMap, player);
	skywatcher3.update(deltaTime, gameMap, player);

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

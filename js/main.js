import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GameMap } from "./Game/World/GameMap.js";
import { Character } from "./Game/Behaviour/Character.js";
import { NPC } from "./Game/Behaviour/NPC.js";
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

	// Add the character to the scene
	scene.add(player.gameObject);

	// Get a random starting place for the enemy
	let startPlayer = gameMap.graph.getEmptyTileClosestTo(0, 0);
	console.log(startPlayer);

	// this is where we start the player
	player.location = gameMap.localize(startPlayer);

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

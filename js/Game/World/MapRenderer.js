import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { TileNode } from "./TileNode.js";
import { Resources } from "../../Util/Resources.js";

// Models
let files = [
	{ name: "StartShrine", url: "../../../public/models/TempleEnter.glb" },
];
const resources = new Resources(files);
await resources.loadAll();

const obstacleTexture = new THREE.TextureLoader().load(
	"../../../public/assets/crate.png"
);
const grassTexture = new THREE.TextureLoader().load(
	"../../../public/assets/Grass.png"
);

export class MapRenderer {
	constructor() {}

	createRendering(gameMap) {
		this.gameMap = gameMap;

		this.groundGeometries = new THREE.BoxGeometry(0, 0, 0);
		this.obstacleGeometries = new THREE.BoxGeometry(0, 0, 0);
		this.swordGeometry = new THREE.BoxGeometry(0, 0, 0);
		this.startShrineGeometry = new THREE.BoxGeometry(0, 0, 0);
		this.endShrineGeometry = new THREE.BoxGeometry(0, 0, 0);

		this.swordRetrieved = true;

		// Iterate over all of the indices in our graph
		for (let node of this.gameMap.graph.nodes) {
			if (node.type != TileNode.Type.Ground) {
				if (node.type == TileNode.Type.Sword) {
					this.swordRetrieved = false;
				}
				this.createTile(node);
			} else {
				this.createTileGround(node);
			}
		}

		let groundGeometry = this.makeGroundGeometry();
		let groundMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
		let ground = new THREE.Mesh(this.groundGeometries, groundMaterial);

		let obstacleMaterial = new THREE.MeshStandardMaterial({
			map: obstacleTexture,
		});
		let obstacles = new THREE.Mesh(this.obstacleGeometries, obstacleMaterial);

		let startShrineMaterial = new THREE.MeshStandardMaterial({
			color: 0xff0000,
		});
		let startShrine = new THREE.Mesh(
			this.startShrineGeometry,
			startShrineMaterial
		);

		let endShrineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
		let endShrine = new THREE.Mesh(this.endShrineGeometry, endShrineMaterial);

		let gameObject = new THREE.Group();

		let swordMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
		let sword = new THREE.Mesh(this.swordGeometry, swordMaterial);

		gameObject.add(ground);
		gameObject.add(obstacles);

		return gameObject;
	}

	makeGroundGeometry() {
		let width = this.gameMap.tileSize * this.gameMap.cols;
		let height = this.gameMap.tileSize;
		let depth = this.gameMap.tileSize * this.gameMap.rows;

		let geometry = new THREE.BoxGeometry(width, height, depth);
		return geometry;
	}

	createTileGround(node) {
		let x = node.x * this.gameMap.tileSize + this.gameMap.start.x;
		let y = 0;
		let z = node.z * this.gameMap.tileSize + this.gameMap.start.z;

		let height = this.gameMap.tileSize * 2;

		let geometry = new THREE.BoxGeometry(
			this.gameMap.tileSize,
			height,
			this.gameMap.tileSize
		);
		geometry.translate(
			x + 0.5 * this.gameMap.tileSize,
			y,
			z + 0.5 * this.gameMap.tileSize
		);
		this.groundGeometries = BufferGeometryUtils.mergeGeometries([
			this.groundGeometries,
			geometry,
		]);
	}

	createTile(node) {
		let x = node.x * this.gameMap.tileSize + this.gameMap.start.x;
		let y = this.gameMap.tileSize * 2;
		let z = node.z * this.gameMap.tileSize + this.gameMap.start.z;

		let height = this.gameMap.tileSize * 2;

		let geometry = new THREE.BoxGeometry(
			this.gameMap.tileSize,
			height,
			this.gameMap.tileSize
		);
		geometry.translate(
			x + 0.5 * this.gameMap.tileSize,
			y,
			z + 0.5 * this.gameMap.tileSize
		);

		if (node.type === TileNode.Type.Obstacle) {
			this.obstacleGeometries = BufferGeometryUtils.mergeGeometries([
				this.obstacleGeometries,
				geometry,
			]);
		} else if (node.type === TileNode.Type.Sword) {
			this.swordGeometry = BufferGeometryUtils.mergeGeometries([
				this.swordGeometry,
				geometry,
			]);
		} else if (node.type === TileNode.Type.Exit) {
			this.endShrineGeometry = BufferGeometryUtils.mergeGeometries([
				this.endShrineGeometry,
				geometry,
			]);
		}
	}
}

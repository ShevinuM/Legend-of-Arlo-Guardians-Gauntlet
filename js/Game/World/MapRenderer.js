import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { TileNode } from "./TileNode.js";

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

		// Iterate over all of the
		// indices in our graph
		for (let node of this.gameMap.graph.nodes) {
			if (node.type != TileNode.Type.Ground) {
				if (node.type == TileNode.Type.Sword) {
					this.swordRetrieved = false;
				}
				this.createTile(node);
			}
		}

		let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		let groundGeometry = this.makeGroundGeometry();
		let ground = new THREE.Mesh(groundGeometry, groundMaterial);

		let obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
		let obstacles = new THREE.Mesh(this.obstacleGeometries, obstacleMaterial);

		let startShrineMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffff,
		});
		let startShrine = new THREE.Mesh(
			this.startShrineGeometry,
			startShrineMaterial
		);

		let endShrineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
		let endShrine = new THREE.Mesh(this.endShrineGeometry, endShrineMaterial);

		let gameObject = new THREE.Group();

		console.log(this.swordRetrieved);
		let swordMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
		let sword = new THREE.Mesh(this.swordGeometry, swordMaterial);
		gameObject.add(sword);

		gameObject.add(ground);
		gameObject.add(obstacles);
		gameObject.add(startShrine);
		gameObject.add(endShrine);

		return gameObject;
	}

	makeGroundGeometry() {
		let width = this.gameMap.tileSize * this.gameMap.cols;
		let height = this.gameMap.tileSize;
		let depth = this.gameMap.tileSize * this.gameMap.rows;

		let geometry = new THREE.BoxGeometry(width, height, depth);
		return geometry;
	}

	createTile(node) {
		let x = node.x * this.gameMap.tileSize + this.gameMap.start.x;
		let y = this.gameMap.tileSize;
		let z = node.z * this.gameMap.tileSize + this.gameMap.start.z;

		let height = this.gameMap.tileSize * 2;

		let geometry = new THREE.BoxGeometry(
			this.gameMap.tileSize,
			height,
			this.gameMap.tileSize
		);
		geometry.translate(
			x + 0.5 * this.gameMap.tileSize,
			y + 0.5 * this.gameMap.tileSize,
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
		} else if (node.type === TileNode.Type.Enter) {
			this.startShrineGeometry = BufferGeometryUtils.mergeGeometries([
				this.startShrineGeometry,
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

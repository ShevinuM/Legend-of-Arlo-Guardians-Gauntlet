import { get } from "mongoose";
import { TileNode } from "./TileNode.js";
import * as THREE from "three";

export class Graph {
	// Constructor for our Graph class
	constructor(tileSize, cols, rows) {
		// node array to hold our graph
		this.nodes = [];

		this.tileSize = tileSize;
		this.cols = cols;
		this.rows = rows;
		this.startShrineNode = null;
		this.swordNode = null;
		this.endShrineNode = null;
	}

	length() {
		return this.nodes.length;
	}

	// Initialize our game graph
	initGraph(grid) {
		this.nodes = [];
		// Create a new tile node
		// for each index in the grid
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				let type = TileNode.Type.Ground;
				let node = new TileNode(this.nodes.length, i, j, type);

				if (grid[i][j] == 1) {
					node.type = TileNode.Type.Obstacle;
				}
				this.nodes.push(node);
			}
		}

		// Initialize node for start Shrine
		let startShrineNode = this.getEmptyTileClosestTo(0, 0);
		startShrineNode.type = TileNode.Type.Enter;
		this.startShrineNode = startShrineNode;

		// Initialize node for end Shrine
		let endShrineNode = this.getEmptyTileClosestTo(
			this.cols - 1,
			this.rows - 1
		);
		endShrineNode.type = TileNode.Type.Exit;
		this.endShrineNode = endShrineNode;

		// Initialize node for sword
		let swordNode = this.getEmptyTileClosestTo(
			Math.floor(this.cols / 2),
			Math.floor(this.rows / 2)
		);
		swordNode.type = TileNode.Type.Sword;

		// Create west, east, north, south
		// edges for each node in our graph
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				// The index of our current node
				let index = j * this.cols + i;
				let current = this.nodes[index];

				if (current.type !== TileNode.Type.Obstacle) {
					if (i > 0) {
						// CREATE A WEST EDGE
						let west = this.nodes[index - 1];
						current.tryAddEdge(west, this.tileSize);
					}

					if (i < this.cols - 1) {
						// CREATE AN EAST EDGE
						let east = this.nodes[index + 1];
						current.tryAddEdge(east, this.tileSize);
					}

					if (j > 0) {
						// CREATE A NORTH EDGE
						let north = this.nodes[index - this.cols];
						current.tryAddEdge(north, this.tileSize);
					}

					if (j < this.rows - 1) {
						// CREATE A SOUTH EDGE
						let south = this.nodes[index + this.cols];
						current.tryAddEdge(south, this.tileSize);
					}
				}
			}
		}
	}

	getNode(x, z) {
		return this.nodes[z * this.cols + x];
	}

	getRandomEmptyTile() {
		let index = Math.floor(Math.random() * this.nodes.length);
		while (this.nodes[index].type == TileNode.Type.Obstacle) {
			index = Math.floor(Math.random() * this.nodes.length);
		}
		return this.nodes[index];
	}

	getRandomEmptyTileLeft() {
		let index = Math.floor(Math.random() * this.nodes.length);
		while (
			this.nodes[index].type == TileNode.Type.Obstacle &&
			index > (1 / 3) * this.nodes.length
		) {
			index = Math.floor(Math.random() * this.nodes.length);
		}
		return this.nodes[index];
	}

	getRandomEmptyTileCenter() {
		let index = Math.floor(Math.random() * this.nodes.length);
		while (
			this.nodes[index].type == TileNode.Type.Obstacle &&
			index < (1 / 3) * this.nodes.length &&
			index > (2 / 3) * this.nodes.length
		) {
			index = Math.floor(Math.random() * this.nodes.length);
		}
		return this.nodes[index];
	}

	getRandomEmptyTileRight() {
		let index = Math.floor(Math.random() * this.nodes.length);
		while (
			this.nodes[index].type == TileNode.Type.Obstacle &&
			index < (2 / 3) * this.nodes.length
		) {
			index = Math.floor(Math.random() * this.nodes.length);
		}
		return this.nodes[index];
	}
	// Uses BFS to find a tile closest to a location
	getEmptyTileClosestTo(x0, y0) {
		let open = [];
		let closed = new Set();
		let current = this.getNode(x0, y0);
		open.push(current);
		while (current && current.type == TileNode.Type.Obstacle) {
			if (closed.has(current)) {
				current = open.shift();
				continue;
			}
			closed.add(current);
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i == 0 && j == 0) {
						continue;
					}
					let x = current.x + i;
					let z = current.z + j;
					if (x < 0 || x >= this.cols || z < 0 || z >= this.rows) {
						continue;
					}
					let node = this.getNode(x, z);
					open.push(node);
				}
			}
			current = open.shift();
		}
		return current;
	}
}

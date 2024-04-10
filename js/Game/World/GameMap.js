import { TileNode } from "./TileNode";
import * as THREE from "three";
import { MapRenderer } from "./MapRenderer";
import { Graph } from "./Graph";
import { PriorityQueue } from "../../Util/PriorityQueue";
import { VectorUtil } from "../../Util/VectorUtil";
import { CellularAutomata } from "./CellularAutomata";

export class GameMap {
	// Constructor for our GameMap class
	constructor() {
		this.width = 600;
		this.depth = 280;

		this.start = new THREE.Vector3(-this.width / 2, 0, -this.depth / 2);

		// We also need to define a tile size
		// for our tile based map
		this.tileSize = 5;

		this.gameOver = false;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width / this.tileSize;
		this.rows = this.depth / this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer();
	}

	// initialize the GameMap
	init(scene) {
		this.scene = scene;

		this.initGraphByCA();

		// Set the game object to our rendering
		this.gameObject = this.mapRenderer.createRendering(this);
	}

	// Method to get location from a node
	localize(node) {
		let x = this.start.x + node.x * this.tileSize + this.tileSize * 0.5;
		let y = this.tileSize;
		let z = this.start.z + node.z * this.tileSize + this.tileSize * 0.5;

		return new THREE.Vector3(x, y, z);
	}

	// Method to get node from a location
	quantize(location) {
		let x = Math.floor((location.x - this.start.x) / this.tileSize);
		let z = Math.floor((location.z - this.start.z) / this.tileSize);

		return this.graph.getNode(x, z);
	}

	backtrack(start, end, parents) {
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			path.push(parents[node.id]);
			node = parents[node.id];
		}
		return path.reverse();
	}

	initGraphByCA() {
		let ca = new CellularAutomata(this.cols, this.rows);
		ca.initCA(8);
		this.graph.initGraph(ca.grid);

		if (this.validate(this.graph)) {
			return;
		}
		console.log("invalid");
		this.initGraphByCA();
	}

	validate(graph) {
		let total = [];
		let reachable = [];

		for (let n of graph.nodes) {
			if (n.type == TileNode.Type.Ground) {
				total.push(n);
			}
		}

		let unvisited = [];
		unvisited.push(graph.getRandomEmptyTile());

		while (unvisited.length > 0) {
			let node = unvisited.shift();
			reachable.push(node);

			for (let edge of node.edges) {
				if (!unvisited.includes(edge.node) && !reachable.includes(edge.node)) {
					unvisited.push(edge.node);
				}
			}
		}

		if (reachable.length == total.length) {
			return true;
		}
		return false;
	}

	setTileType(node, type) {
		node.type = type;
	}

	manhattanDistance(node, end) {
		const n = this.localize(node);
		const e = this.localize(end);
		const dx = Math.abs(n.x - e.x);
		const dz = Math.abs(n.z - e.z);
		return dx + dz;
	}

	astar(startIndex, endIndex) {
		const closed = new Set();
		const open = new PriorityQueue();

		const start = this.graph[startIndex];
		const end = this.graph[endIndex];

		const parent = [];
		const costs = [];

		open.enqueue(start, 0);

		for (let node of this.graph) {
			costs[node.id] = node == start ? 0 : Infinity;
			parent[node.id] = null;
		}

		while (!open.isEmpty()) {
			const current = open.dequeue();

			closed.add(current);

			if (current == end) {
				return this.backtrack(start, end, parent);
			}

			for (let edge of current.edges) {
				if (!closed.has(edge.node)) {
					const newCost = costs[current.id] + edge.cost;
					const heuristic = this.manhattanDistance(edge.node, end);
					if (!open.includes(edge.node)) {
						open.enqueue(edge.node, newCost + heuristic);
						parent[edge.node.id] = current;
						costs[edge.node.id] = newCost + heuristic;
					} else {
						if (costs[edge.node.id] > newCost) {
							open.remove(edge.node);
							parent[edge.node.id] = current;
							costs[edge.node.id] = newCost + heuristic;
							open.enqueue(edge.node, newCost + heuristic);
						}
					}
				}
			}
		}
	}

	backtrack(start, end, parents) {
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			if (node == null) return;
			path.push(parents[node.id]);
			node = parents[node.id];
		}
		return path.reverse();
	}
}

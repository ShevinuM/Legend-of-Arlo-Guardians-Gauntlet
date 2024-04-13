import { TileNode } from "./TileNode";
import * as THREE from "three";
import { MapRenderer } from "./MapRenderer";
import { Graph } from "./Graph";
import { PriorityQueue } from "../../Util/PriorityQueue";
import { VectorUtil } from "../../Util/VectorUtil";
import { CellularAutomata } from "./CellularAutomata";

export class GameMap {
	constructor() {
		this.width = 680;
		this.depth = 350;

		this.start = new THREE.Vector3(-this.width / 2, 0, -this.depth / 2);

		this.tileSize = 5;

		this.gameOver = false;

		this.cols = this.width / this.tileSize;
		this.rows = this.depth / this.tileSize;

		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		this.mapRenderer = new MapRenderer();

		this.sword = null;
	}

	init(scene) {
		this.scene = scene;

		this.initGraphByCA();

		this.gameObject = this.mapRenderer.createRendering(this);
	}

	localize(node) {
		let x = this.start.x + node.x * this.tileSize + this.tileSize * 0.5;
		let y = this.tileSize;
		let z = this.start.z + node.z * this.tileSize + this.tileSize * 0.5;

		return new THREE.Vector3(x, y, z);
	}

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
		let nodePos = this.localize(node);
		let endPos = this.localize(end);

		let dx = Math.abs(nodePos.x - endPos.x);
		let dz = Math.abs(nodePos.z - endPos.z);
		return dx + dz;
	}

	jps(start, end) {
		let open = new PriorityQueue();
		let closed = [];

		let parents = new Map();
		let g = new Map();

		g.set(start, 0);
		open.enqueue(start, 0);

		console.log(`open -> ${open}`);
		while (!open.isEmpty()) {
			let node = open.dequeue();
			console.log(node);
			closed.push(node);

			if (node == end) {
				return this.backtrack(start, end, parents);
			}

			this.identifySuccessors(node, end, open, closed, parents, g);
		}

		console.log(`No Path found`);
		return null;
	}

	getNeighbours(node, parents) {
		let neighbours = [];
		let parent = parents.get(node);

		if (parent == null) {
			for (let e of node.edges) {
				neighbours.push(e.node);
			}
		} else {
			// These always need to be -1, 0, 1
			let dx = node.x - parent.x;
			let dz = node.z - parent.z;

			if (dx != 0) {
				dx = dx / Math.abs(dx);

				if (node.hasEdgeTo(node.x + dx, node.z)) {
					neighbours.push(this.graph.getNode(node.x + dx, node.z));
				}

				if (node.hasEdgeTo(node.x, node.z + 1)) {
					neighbours.push(this.graph.getNode(node.x, node.z + 1));
				}

				if (node.hasEdgeTo(node.x, node.z - 1)) {
					neighbours.push(this.graph.getNode(node.x, node.z - 1));
				}
			} else if (dz != 0) {
				dz = dz / Math.abs(dz);

				if (node.hasEdgeTo(node.x, node.z + dz)) {
					neighbours.push(this.graph.getNode(node.x, node.z + dz));
				}

				if (node.hasEdgeTo(node.x + 1, node.z)) {
					neighbours.push(this.graph.getNode(node.x + 1, node.z));
				}

				if (node.hasEdgeTo(node.x - 1, node.z)) {
					neighbours.push(this.graph.getNode(node.x - 1, node.z));
				}
			}
		}
		return neighbours;
	}

	jump(neighbour, current, end) {
		if (neighbour == null || !current.hasEdge(neighbour)) {
			return null;
		}
		if (end == neighbour) {
			return neighbour;
		}

		let dx = neighbour.x - current.x;
		let dz = neighbour.z - current.z;

		if (dx != 0) {
			if (
				(neighbour.hasEdgeTo(neighbour.x, neighbour.z + 1) &&
					!current.hasEdgeTo(current.x, current.z + 1)) ||
				(neighbour.hasEdgeTo(neighbour.x, neighbour.z - 1) &&
					!current.hasEdgeTo(current.x, current.z - 1))
			) {
				return neighbour;
			}
		} else if (dz != 0) {
			if (
				(neighbour.hasEdgeTo(neighbour.x + 1, neighbour.z) &&
					!current.hasEdgeTo(current.x + 1, current.z)) ||
				(neighbour.hasEdgeTo(neighbour.x - 1, neighbour.z) &&
					!current.hasEdgeTo(current.x - 1, current.z))
			) {
				return neighbour;
			}

			if (
				this.jump(
					this.graph.getNode(neighbour.x + 1, neighbour.z),
					neighbour,
					end
				) != null ||
				this.jump(
					this.graph.getNode(neighbour.x - 1, neighbour.z),
					neighbour,
					end
				) != null
			) {
				return neighbour;
			}
		} else {
			return null;
		}

		return this.jump(
			this.graph.getNode(neighbour.x + dx, neighbour.z + dz),
			neighbour,
			end
		);
	}

	identifySuccessors(node, end, open, closed, parents, g) {
		let neighbours = this.getNeighbours(node, parents);
		console.log(neighbours);

		for (let neighbour of neighbours) {
			let jumpNode = this.jump(neighbour, node, end);

			if (jumpNode == null || closed.includes(jumpNode)) {
				continue;
			}

			let d = this.manhattanDistance(node, jumpNode);

			let fromNodeG = Number.MAX_VALUE;
			if (g.has(node)) {
				fromNodeG = g.get(node);
			}
			fromNodeG = fromNodeG + d;

			let jumpG = Number.MAX_VALUE;
			if (g.has(jumpNode)) {
				jumpG = g.get(jumpNode);
			}

			if (!open.includes(jumpNode) || fromNodeG < jumpG) {
				g.set(jumpNode, fromNodeG);
				parents.set(jumpNode, node);

				let f = g.get(jumpNode) + this.manhattanDistance(jumpNode, end);

				if (!open.includes(jumpNode)) {
					open.enqueue(jumpNode, f);
				}
			}
		}
	}

	backtrack(start, end, parents) {
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			path.push(parents.get(node));
			node = parents.get(node);
		}
		return path.reverse();
	}
}

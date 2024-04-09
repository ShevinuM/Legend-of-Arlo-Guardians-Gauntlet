import { Character } from "./Character.js";
import { State } from "./State";
import { TileNode } from "../World/TileNode.js";

export class Player extends Character {
	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;
		this.foundSword = false;

		// State
		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, controller) {
		this.state.updateState(this, controller, gameMap);
		super.update(deltaTime, gameMap);
	}
}

export class IdleState extends State {
	enterState(player) {
		console.log("Entered Idle State");
		player.velocity.x = 0;
		player.velocity.z = 0;
	}

	updateState(player, controller, gameMap) {
		if (controller.moving()) {
			if (player.foundSword) {
				player.switchState(new SearchingForEndShrineState());
			} else {
				player.switchState(new SearchingForSwordState());
			}
		}
	}
}

export class SearchingForSwordState extends State {
	enterState(player) {
		console.log("Entered Searching for Sword");
	}

	updateState(player, controller, gameMap) {
		let tileNode = gameMap.quantize(player.location);
		if (tileNode && tileNode.type === TileNode.Type.Sword) {
			console.log(tileNode.type);
			gameMap.setTileType(tileNode, TileNode.Type.Ground);
			player.switchState(new SearchingForEndShrineState());
		} else if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let force = controller.direction(player);
			force.setLength(50);
			player.applyForce(force);
		}
	}
}

export class SearchingForEndShrineState extends State {
	enterState(player) {
		player.foundSword = true;
		console.log("Entered Searching For End Shrine");
	}

	updateState(player, controller, gameMap) {
		let tileNode = gameMap.quantize(player.location);
		if (tileNode && tileNode.type === TileNode.Type.Exit) {
			player.switchState(new EndGameState());
		} else if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let force = controller.direction(player);
			force.setLength(50);
			player.applyForce(force);
		}
	}
}

export class EndGameState extends State {
	enterState(player) {
		alert("Game Over");

		setTimeout(function () {
			location.reload();
		}, 1000);
	}

	updateState(player, controller, gameMap) {}
}

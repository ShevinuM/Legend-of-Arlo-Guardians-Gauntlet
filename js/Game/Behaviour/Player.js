import { Character } from "./Character.js";
import { State } from "./State";
import { TileNode } from "../World/TileNode.js";

import { Resources } from "../../Util/Resources.js";

let files = [{ name: "Rock", url: "../../../public/models/Stone.glb" }];
const resources = new Resources(files);
await resources.loadAll();

function showNotification(message) {
	let notification = document.getElementById("notification");
	notification.innerHTML = message;
	notification.style.display = "block";

	document.addEventListener("keydown", function (event) {
		if (event.key === "x") {
			let notification = document.getElementById("notification");
			notification.style.display = "none";
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "q") {
			window.location.reload();
		}
	});
}

export class Player extends Character {
	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;
		this.foundSword = false;

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
			gameMap.sword.setModel(resources.get("Rock"));
			gameMap.setTileType(tileNode, TileNode.Type.Ground);
			player.switchState(new SearchingForEndShrineState());
			gameMap.sword.setModel(resources.get("Rock"));
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
		showNotification(
			"You've discovered the legendary sword! With it, the guardians of the Shrine are ready to defend it with all their might. Time is of the essence, so make haste! The fate of the Sword rests in your hands!<br><br>Press 'x' to dismiss"
		);
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
		showNotification(
			"Hyrulean champion,<br><br>Your triumph in evading the vigilant guardians within the Shrine is commendable. Through your skill and cunning, you have navigated the perils unscathed. Now, the shrine's magic shall whisk you back to the land of Hyrule.<br><br>May the courage and wisdom you've displayed serve you well in your ultimate quest to defeat the malevolent Ganon. Your destiny awaits, and the fate of Hyrule hangs in the balance. Best of luck on your journey.<br><br>Press q to quit"
		);
		player.topSpeed = 0;
	}

	updateState(player, controller, gameMap) {
		gameMap.gameOver = true;
	}
}

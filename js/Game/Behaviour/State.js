import * as THREE from "three";

export class State {
	// Creating an abstract class in JS
	// Ensuring enterState and updateState are implemented
	constructor() {
		if (this.constructor == State) {
			throw new Error("Class is of abstract type and cannot be instantiated");
		}

		if (this.enterState == undefined) {
			throw new Error("enterState method must be implemented");
		}

		if (this.updateState == undefined) {
			throw new Error("updateState method must be implemented");
		}
	}
}

export class PatrolState extends State {
	enterState(guardian, player) {
		console.log("Guarding!");
		guardian.topSpeed = 10;
	}

	updateState(guardian, gameMap, player) {
		if (
			!gameMap.gameOver &&
			guardian.location.distanceTo(player.location) <= 2
		) {
			gameMap.gameOver = true;
			location.reload();
			alert("You have been caught by a guardian! Game Over!");
		} else if (player.foundSword) {
			guardian.switchState(new goToEndShrineState(), player);
		} else if (guardian.location.distanceTo(player.location) <= 50) {
			guardian.switchState(new ChaseState(), player);
		} else {
			guardian.applyForce(guardian.wander());
		}
	}
}

export class ChaseState extends State {
	enterState(guardian, player) {
		console.log("Chasing");
	}

	updateState(guardian, gameMap, player) {
		if (
			!gameMap.gameOver &&
			guardian.location.distanceTo(player.location) <= 2
		) {
			gameMap.gameOver = true;
			location.reload();
			alert("You have been caught by a guardian! Game Over!");
		} else if (player.foundSword) {
			guardian.switchState(new goToEndShrineState(), player);
		} else if (player.location.distanceTo(guardian.location) > 50) {
			guardian.switchState(new PatrolState(), player);
		} else {
			guardian.applyForce(guardian.seek(player.location));
		}
	}
}

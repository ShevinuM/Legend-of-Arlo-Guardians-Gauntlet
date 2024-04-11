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
	enterState(guardian, player, gameMap) {
		console.log("Guarding!");
		guardian.topSpeed = 10;
	}

	updateState(guardian, gameMap, player, deltaTime) {
		if (
			!gameMap.gameOver &&
			guardian.location.distanceTo(player.location) <= 2
		) {
			gameMap.gameOver = true;
			location.reload();
			alert("You have been caught by a guardian! Game Over!");
		} else if (guardian.location.distanceTo(player.location) <= 50) {
			guardian.switchState(new ChaseState(), player, gameMap);
		} else if (player.foundSword) {
			guardian.switchState(new goToEndShrineState(), player, gameMap);
		} else {
			guardian.applyForce(guardian.wander());
		}
	}
}

export class ChaseState extends State {
	enterState(guardian, player) {
		console.log("Chasing");
	}

	updateState(guardian, gameMap, player, deltaTime) {
		if (
			!gameMap.gameOver &&
			guardian.location.distanceTo(player.location) <= 2
		) {
			gameMap.gameOver = true;
			location.reload();
			alert("You have been caught by a guardian! Game Over!");
		} else if (player.location.distanceTo(guardian.location) <= 50) {
			guardian.applyForce(guardian.seek(player.location));
		} else if (player.foundSword) {
			guardian.switchState(new goToEndShrineState(), player, gameMap);
		} else if (player.location.distanceTo(guardian.location) > 50) {
			guardian.switchState(new PatrolState(), player, gameMap);
		} else {
			guardian.applyForce(guardian.pursue(player.location, 6));
		}
	}
}

export class goToEndShrineState extends State {
	enterState(guardian, player, gameMap) {
		console.log("Going To End Shrine");
		let guardianLoc = guardian.location;
		let guardianCurrNode = gameMap.quantize(guardianLoc);
		this.path = gameMap.jps(guardianCurrNode, gameMap.graph.endShrineNode);
	}

	updateState(guardian, gameMap, player, deltaTime) {
		if (
			!gameMap.gameOver &&
			guardian.location.distanceTo(player.location) <= 2
		) {
			gameMap.gameOver = true;
			location.reload();
			alert("You have been caught by a guardian! Game Over!");
		} else if (guardian.location.distanceTo(player.location) <= 50) {
			guardian.switchState(new ChaseState(), player, gameMap);
		} else if (this.path && this.path.length > 0) {
			let nextNode = this.path[0];
			if (guardian.location.distanceTo(gameMap.localize(nextNode)) < 1) {
				this.path.shift();
			}

			if (this.path.length > 1) {
				nextNode = this.path[0];

				let steer = guardian.seek(gameMap.localize(nextNode));
				guardian.applyForce(steer);
			} else if (this.path.length > 0) {
				nextNode = this.path[0];
				let steer = guardian.arrive(gameMap.localize(nextNode), 20);
				guardian.applyForce(steer);
			}
		}
	}
}

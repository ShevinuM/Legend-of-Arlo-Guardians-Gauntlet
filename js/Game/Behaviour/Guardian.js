import * as THREE from "three";
import { VectorUtil } from "../../Util/VectorUtil.js";
import { Character } from "./Character.js";
import { State } from "./State.js";

export class Guardian extends Character {
	// Character Constructor
	constructor(mColor, player) {
		super(mColor);
		this.state = new PatrolState();
		this.state.enterState(this, player);
	}

	switchState(state, player) {
		this.state = state;
		this.state.enterState(this, player);
	}

	update(deltaTime, gameMap, player) {
		this.state.updateState(this, gameMap, player);
		super.update(deltaTime, gameMap);
	}

	// Seek steering behaviour
	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		return steer;
	}

	// Arrive steering behaviour
	arrive(target, radius) {
		let desired = VectorUtil.sub(target, this.location);

		let distance = desired.length();

		if (distance < radius) {
			let speed = (distance / radius) * this.topSpeed;
			desired.setLength(speed);
		} else {
			desired.setLength(this.topSpeed);
		}

		let steer = VectorUtil.sub(desired, this.velocity);

		return steer;
	}

	// Wander steering behaviour
	wander() {
		const d = 10;
		const r = 10;
		const a = 0.3;

		const v = this.velocity.clone().setLength(d);
		const futureLocation = this.location.clone().add(v);

		// Math.random() generates a random number between 0 and 1
		// 2 * Math.PI is 360 degrees in radians
		// so I am generating a random angle between 0 and 360 degrees
		if (this.wanderAngle == null) {
			this.wanderAngle = Math.random() * 2 * Math.PI;
		} else {
			// Math.random() * 2 * a generates a random number between 0 and 2a
			// I then subtract a to get a random number between -a and a
			this.wanderAngle += Math.random() * 2 * a - a;
		}

		let target = new THREE.Vector3(
			futureLocation.x + r * Math.sin(this.wanderAngle),
			futureLocation.y,
			futureLocation.z + r * Math.cos(this.wanderAngle)
		);

		return this.seek(target);
	}
}

export class PatrolState extends State {
	enterState(guardian, player) {
		console.log("Guarding!");
		guardian.topSpeed = 10;
	}

	updateState(guardian, gameMap, player) {
		if (guardian.location.distanceTo(player.location) <= 5) {
			alert("You have been caught by a guardian! Game Over!");
			location.reload();
		} else if (guardian.location.distanceTo(player.location) <= 25) {
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
		if (guardian.location.distanceTo(player.location) <= 5) {
			alert("You have been caught by a guardian! Game Over!");
			location.reload();
		} else if (player.location.distanceTo(guardian.location) > 50) {
			guardian.switchState(new PatrolState(), player);
		} else {
			guardian.applyForce(guardian.seek(player.location));
		}
	}
}

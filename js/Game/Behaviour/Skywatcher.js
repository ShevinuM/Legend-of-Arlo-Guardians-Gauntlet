import * as THREE from "three";
import { VectorUtil } from "../../Util/VectorUtil.js";
import { Character } from "./Character.js";
import { State, PatrolState, ChaseState } from "./State.js";

export class Skywatcher extends Character {
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

	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		return steer;
	}

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

	wander() {
		const d = 10;
		const r = 10;
		const a = 0.3;

		const v = this.velocity.clone().setLength(d);
		const futureLocation = this.location.clone().add(v);

		if (this.wanderAngle == null) {
			this.wanderAngle = Math.random() * 2 * Math.PI;
		} else {
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

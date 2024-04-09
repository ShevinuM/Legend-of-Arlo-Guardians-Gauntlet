import { Character } from './Character.js';
import { State } from './State';

export class Player extends Character {

	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;

		// State
		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, controller) {
		this.state.updateState(this, controller);
		super.update(deltaTime, gameMap);
	}


}

export class IdleState extends State {

	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
	}

	updateState(player, controller) {
		if (controller.moving()) {
			player.switchState(new MovingState());
		}
	}

}



export class MovingState extends State {

	enterState(player) {
	}

	updateState(player, controller) {

		if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let force = controller.direction(player);
			force.setLength(50);
			player.applyForce(force);
		
		}	
	}
  
}

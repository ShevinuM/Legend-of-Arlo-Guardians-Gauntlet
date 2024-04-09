import * as THREE from 'three';
import { VectorUtil } from '../../Util/VectorUtil.js';

export class Controller {
	// Controller Constructor
	constructor(doc, camera) {
		this.doc = doc;
		this.left = false;
		this.right = false;
		this.forward = false;
		this.backward = false;


		this.doc.addEventListener('keydown', this);
		this.doc.addEventListener('keyup', this);
	
		this.camera = camera;

		this.setWorldDirection();
	}

	handleEvent(event) {
		if (event.type == 'keydown') {
			switch (event.code) {
				case("ArrowUp"): 
					this.forward = true;
					break;
				case("ArrowDown"):
					this.backward = true;
					break;
				case("ArrowLeft"):
					this.left = true;
					break;
				case("ArrowRight"):
					this.right = true;
					break;
			}
	
		}
		else if (event.type == 'keyup') {
			switch (event.code) {
				case("ArrowUp"): 
					this.forward = false;
					break;
				case("ArrowDown"):
					this.backward = false;
					break;
				case("ArrowLeft"):
					this.left = false;
					break;
				case("ArrowRight"):
					this.right = false;
					break;
			}
		}

	}
	
	destroy() {
		this.doc.removeEventListener('keydown', this);
		this.doc.removeEventListener('keyup', this);
	}

	moving() {
		if (this.left || this.right || this.forward || this.backward)
			return true;
		return false;
	}

	setWorldDirection() {
		this.worldDirection = new THREE.Vector3();
		this.camera.getWorldDirection(this.worldDirection);
 		this.worldDirection.y = 0;
	}

	direction() {
		
		let angleOffset = this.angleOffset();
		let direction = this.worldDirection.clone();
		
		direction.normalize();
		direction.applyAxisAngle(new THREE.Vector3(0,1,0), angleOffset);
        
       	return direction;
	}

  	angleOffset() {
        let angleOffset = 0; // forward

        if (this.forward) {
            if (this.left) {
                angleOffset = Math.PI / 4 // forward+left
            } else if (this.right) {
                angleOffset = - Math.PI / 4 // forward+right
            } else {
            	angleOffset = 0;
            }
        } else if (this.backward) {
            if (this.left) {
                angleOffset = 3 * Math.PI / 4 // backward+left
            } else if (this.right) {
                angleOffset = - 3 * Math.PI / 4 // backward+right
            } else {
                angleOffset = Math.PI // backward
            }
        } else if (this.left) {
            angleOffset = Math.PI / 2 // left
        } else if (this.right) {
            angleOffset = - Math.PI / 2 // right
        }

        return angleOffset
    }


}

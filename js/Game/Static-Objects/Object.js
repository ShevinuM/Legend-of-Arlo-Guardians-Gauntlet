import * as THREE from "three";

export class GameObject {
	constructor(mColor) {
		this.size = 20;

		let boxGeometry = new THREE.BoxGeometry(10, 10, 10);
		let boxMaterial = new THREE.MeshStandardMaterial({ color: mColor });
		let mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.position.y = mesh.position.y + 1;
		mesh.rotateX(Math.PI / 2);
		this.gameObject = new THREE.Group();
		this.gameObject.add(mesh);
		this.location = new THREE.Vector3(0, 0, 0);
		this.orientation = new THREE.Vector3(0, 0, 0);
		this.mass = 1;
	}

	setModel(model) {
		model.position.y = model.position.y + 5;
		var bbox = new THREE.Box3().setFromObject(model);
		let dz = bbox.max.z - bbox.min.z;
		let scale = this.size / dz;
		model.scale.set(scale, scale, scale);
		this.gameObject = new THREE.Group();
		this.gameObject.add(model);
	}
}

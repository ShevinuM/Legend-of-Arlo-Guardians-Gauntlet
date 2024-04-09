import * as THREE from 'three';

export class VectorUtil {

	// Add two vectors
	// Returns a new vector = a + b
	static add(a, b) {
		let v = a.clone();
		v.add(b);
		return v;
	}

	// Subtracts vector a from b 
	// Returns a new vector = a - b
	static sub(a, b) {
		let v = a.clone();
		v.sub(b);
		return v;
	}

	// Multiplies vector a by scalar s
	// Returns a new vector = a * s
	static multiplyScalar(a, s) {
		let v = a.clone();
		v.multiplyScalar(s);
		return v;
	}

	// Divides vector a by scalar s
	// Returns a new vector = a / s
	static divideScalar(a, s) {
		let v = a.clone();
		v.divideScalar(s);
		return v;
	}


	// Sets length of clone of vector a to s
	// Returns a new vector = a * s
	static setLength(a, s) {
		let v = a.clone();
		v.setLength(s);
		return v;
	}

	// Adds a scaled vector b by s to a
	// Returns a new vector = a + (b * s)
	static addScaledVector(a, b, s) {
		let v = a.clone();
		v.addScaledVector(b, s);
		return v;
	}

	// Projects vector a onto b
	// Returns a new vector = a proj b
	static projectOnVector(a, b) {
		let v = a.clone();
		v.projectOnVector(b);
		return v;
	}




}
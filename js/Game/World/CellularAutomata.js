export class CellularAutomata {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;
	}

	initCA(numIterations) {
		this.grid = [];

		for (let i = 0; i < this.cols; i++) {
			this.grid[i] = [];

			for (let j = 0; j < this.rows; j++) {
				// cell at index i, j
				let r = Math.random();
				if (r < 0.35) {
					this.grid[i][j] = 1;
				} else {
					this.grid[i][j] = 0;
				}
			}
		}

		for (let i = 0; i < numIterations; i++) {
			this.runCA();
		}
	}

	runCA() {
		let tempGrid = [];

		for (let i = 0; i < this.cols; i++) {
			tempGrid[i] = [];

			for (let j = 0; j < this.rows; j++) {
				let count = 0;

				for (let x = -1; x <= 1; x++) {
					for (let z = -1; z <= 1; z++) {
						let neighbourX = i + x;
						let neighbourZ = j + z;

						if (this.inGrid(neighbourX, neighbourZ)) {
							if (!(x == 0 && z == 0)) {
								if (this.grid[neighbourX][neighbourZ] == 1) {
									count++;
								}
							}
						} else {
							count++;
						}
					}
				}

				if (count >= 4) {
					tempGrid[i][j] = 1;
				} else {
					tempGrid[i][j] = 0;
				}
			}
		}

		this.grid = tempGrid;
	}

	inGrid(x, z) {
		if (x < 0 || x >= this.cols) {
			return false;
		}
		if (z < 0 || z >= this.rows) {
			return false;
		}
		return true;
	}
}

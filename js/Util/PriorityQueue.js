
export class PriorityQueue {
	
	// Constructor
	constructor() {
		this.storage = [];
	}

	// Tests if the Queue is empty
	isEmpty() {
		return this.storage.length == 0;
	}

	// Get parent index of a node 
	// at the provided index
	getParentIndex(index) {
		return Math.floor((index-1)/2);
	}
	// Get the left child index of a node 
	// at the provided index
	getLeftChildIndex(index) {
		return (2*index)+1;
	}
	// Get the right child index of a node 
	// at the provided index
	getRightChildIndex(index) {
		return (2*index)+2;
	}

	// Tests if the node at the provided
	// index has a parent
	hasParent(index) {
		return this.getParentIndex(index) >= 0;
	}

	// Tests if the node at the provided
	// index has a left child
	hasLeftChild(index) {
		return this.getLeftChildIndex(index) < this.storage.length;
	}

	// Tests if the node at the provided
	// index has a right child
	hasRightChild(index) {
		return this.getRightChildIndex(index) < this.storage.length;
	}

	// Returns the parent of a node
	// at the provided index
	parent(index) {
		return this.storage[this.getParentIndex(index)];
	}

	// Returns the left child of a node
	// at the provided index
	leftChild(index) {
		return this.storage[this.getLeftChildIndex(index)];
	}
	// Returns the right child of a node
	// at the provided index
	rightChild(index) {
		return this.storage[this.getRightChildIndex(index)];
	}

	// Tests to see if the queue
	// includes a particular node
	includes(node) {
		for (let i in this.storage) {
			if (this.storage[i][0] == node) {
				return true;
			}
		}
		return false;
	}
	// Swaps positions of node
	// at index1 and node at index2
	swap(index1, index2) {
		let temp = this.storage[index1];
		this.storage[index1] = this.storage[index2];
		this.storage[index2] = temp;
	}

	// Returns the top node of
	// the priority queue without removal
	peek() {
		return this.storage[0];
	}

	// Enqueues a node with a numerical priority
	// HINT: this will be the f value!!!
	enqueue(node, priority) {
		let data = [node, priority];
		this.storage[this.storage.length] = data;

		this.heapifyUp(this.storage.length-1);
	}

	// Resort the priority queue
	// to retain the min heap property
	heapifyUp(index) {
		if (this.hasParent(index) && 
			(this.parent(index)[1] > this.storage[index][1])) {
			this.swap(this.getParentIndex(index), index);
			this.heapifyUp(this.getParentIndex(index));
		}
	}

	// Removes the top node of
	// the priority queue and removes it
	dequeue() {
		if (this.storage.length == 0)
			return null;
		let data = this.storage[0];
		this.storage[0] = this.storage[this.storage.length-1];
		this.storage.splice(this.storage.length-1, 1);
		this.heapifyDown(0);
		return data[0];
	}
	
	// Resort the priority queue
	// to retain the min heap property
	heapifyDown(index) {
		let smallest = index;
		if (this.hasLeftChild(index) && 
			(this.storage[smallest][1] > this.leftChild(index)[1])) {
			smallest = this.getLeftChildIndex(index);
		}
		if (this.hasRightChild(index) && 
			(this.storage[smallest][1] > this.rightChild(index)[1])) {
			smallest = this.getRightChildIndex(index);
		}
		if (smallest != index) {
			this.swap(index, smallest);
			this.heapifyDown(smallest);	
		}
	}

	// Removes the provided node from 
	// the priority queue if it exists
	// If it does not exist, will return an error 
	remove(node) {
		let index = -1;
		for (let i in this.storage) {
			if (this.storage[i][0] == node){
				index = i;
			}
		}
		if (index = -1) {
			return Error("Node with ID: " + node.id + " cannot be removed as it does not exist");
		}
		
		this.storage[index] = this.storage[this.storage.length-1];
		this.storage.splice(this.storage.length-1, 1);
		this.heapifyDown(index);
	}

}
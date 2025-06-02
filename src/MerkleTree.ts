import * as crypto from "crypto";

/**
 * A Merkle Tree implementation for cryptographic verification of data integrity.
 * Provides methods to generate and verify inclusion proofs.
 */
export class MerkleTree {
	private leaves: string[];
	private tree: string[][];
	private hashAlgorithm: string;
  
	/**
	 * Creates a new Merkle Tree from the provided data items
	 * @param data Array of data items to include in the tree
	 * @param options Configuration options (e.g., hashAlgorithm)
	 * @throws Error if data array is empty
	 */
	constructor(data: string[], options: { hashAlgorithm?: string } = {}) {
	  if (data.length === 0) {
		throw new Error("Data array cannot be empty.");
	  }
	  this.hashAlgorithm = options.hashAlgorithm || 'sha256';
	  this.leaves = data.map((item) => this.hash(item));
	  this.tree = this.buildTree(this.leaves);
	}

	/**
	 * Constant-time comparison of hash values to prevent timing attacks
	 * @param a First hash to compare
	 * @param b Second hash to compare
	 * @returns true if hashes are equal
	 */
	private constantTimeEquals(a: string, b: string): boolean {
		if (a.length !== b.length) return false;
		
		let result = 0;
		for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
		}
		
		return result === 0;
	}
  
	private hash(data: string): string {
	  return crypto.createHash(this.hashAlgorithm).update(data).digest("hex");
	}

	private buildTree(leaves: string[]): string[][] {
		const tree: string[][] = [leaves];
		while (tree[tree.length - 1].length > 1) {
		const currentLevel = tree[tree.length - 1];
		const nextLevel: string[] = [];
		for (let i = 0; i < currentLevel.length; i += 2) {
			const left = currentLevel[i]; //duplicating a node, in case of odd number
			let right: string;
			if (i + 1 < currentLevel.length) {
				right = currentLevel[i + 1];
			} else {
				right = left;
			}
			nextLevel.push(this.hash(left + right));
		}
		tree.push(nextLevel); // adding new level to the tree
		}
		return tree;
	}

	/**
	 * Generates a cryptographic proof for a specific leaf in the tree
	 * @param index The index of the leaf to generate a proof for
	 * @returns Array of sibling hashes and their positions needed to reconstruct the root
	 * @throws Error if index is out of range
	 */
	generateProof(index: number): { siblingHash: string; position: 'left' | 'right' }[] {
		if (index < 0 || index >= this.leaves.length) {
		  throw new Error(`Leaf index ${index} out of range (0-${this.leaves.length - 1})`);
		}
	  
		const proof: { siblingHash: string; position: 'left' | 'right' }[] = [];
		let currentIndex = index;
	  
		// traversing up the tree
		for (let level = 0; level < this.tree.length - 1; level++) {
		  const currentLevel = this.tree[level];
		  const isRightNode = currentIndex % 2 === 1;
		  const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
	  
		  // check if sibling exists
		  if (siblingIndex < currentLevel.length) {
			proof.push({
			  siblingHash: currentLevel[siblingIndex],
			  position: isRightNode ? 'left' : 'right'
			});
		  }
	  
		  //move up
		  currentIndex = Math.floor(currentIndex / 2);
		}
	  
		return proof;
	}

	/**
	 * Verifies a Merkle proof against the expected root hash
	 * @param data The original data item to verify
	 * @param proof The Merkle proof containing sibling hashes and positions
	 * @param expectedRoot The expected root hash to verify against
	 * @returns true if the proof is valid, false otherwise
	 */
	verifyProof(data: string, proof: { siblingHash: string; position: 'left' | 'right' }[], expectedRoot: string): boolean {
		let currentHash = this.hash(data); //getting the leaf hash
		
		// reconstruct the root hash using the proof
		for (const { siblingHash, position } of proof) {
		if (position === 'left') {
			currentHash = this.hash(siblingHash + currentHash);
		} else {
			currentHash = this.hash(currentHash + siblingHash);
		}
		}
		// reconstracted hash should match the root
		return this.constantTimeEquals(currentHash, expectedRoot);
	}

	generateAllProofs(): { index: number; data: string; proof: { siblingHash: string; position: 'left' | 'right' }[] }[] {
		const allProofs: { index: number; data: string; proof: { siblingHash: string; position: 'left' | 'right' }[] }[] = [];
		
		for (let i = 0; i < this.leaves.length; i++) {
		allProofs.push({
			index: i,
			data: this.leaves[i],
			proof: this.generateProof(i)
		});
		}
		return allProofs;
	}


	/**
	 * Gets the root hash of the Merkle tree
	 * @returns The root hash as a hexadecimal string
	 */
	getRoot(): string {
		return this.tree[this.tree.length - 1][0]; //root hash
	}

	/**
	 * Gets the depth of the tree (number of levels minus one)
	 * @returns The depth of the tree, where 0 means only a root node exists
	 */
	getTreeDepth(): number {
		return this.tree.length - 1;
	}
	
	/**
	 * Gets the number of leaf nodes in the tree
	 * @returns The total count of leaf nodes
	 */
	getLeafCount(): number {
		return this.leaves.length;
	}
	
	/**
	 * Gets all levels of the tree as a 2D array
	 * @returns A copy of the internal tree structure, where each sub-array represents one level
	 *          (level 0 contains leaves, the last level contains the root)
	 */
	getTreeLevels(): string[][] {
		return [...this.tree]; //copy to prevent direct modification
	}
	
	/**
	 * Generates a string visualization of the Merkle tree structure
	 * @returns A formatted string representation of the tree with levels, nodes,
	 *          and abbreviated hash values for easier reading
	 */
	visualizeTree(): string {
		let result = "Merkle Tree Visualization\n";
		result += "═".repeat(90) + "\n";
		
		const reversedTree = [...this.tree].reverse(); //to show root at the top
		
		reversedTree.forEach((level, i) => {
		const actualLevel = this.tree.length - 1 - i;
		const levelName = actualLevel === 0 ? "Leaves" : 
							actualLevel === this.tree.length - 1 ? "Root" : 
							`Level ${actualLevel}`;
		
		const nodesDisplay = level.map(hash => {
			const prefix = hash.substring(0, 6);
			const suffix = hash.substring(hash.length - 4);
			return `${prefix}...${suffix}`;
		}).join(" ┃ ");
		
		const levelIndicator = `${levelName.padEnd(8)}│`;
		
		const nodeCount = `[${level.length} node${level.length !== 1 ? 's' : ''}]`;
		
		result += `${levelIndicator} ${nodesDisplay} ${nodeCount}\n`;
		
		if (i < reversedTree.length - 1) {
			const connectingLine = "│".padStart(9);
			result += `${connectingLine}\n`;
		}
		});
		
		result += "═".repeat(90) + "\n";
		return result;
	}
}
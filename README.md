# Merkle Tree Implementation

This project implements a Merkle tree data structure in TypeScript, providing cryptographic verification capabilities commonly used in blockchain systems and distributed databases.

## Features

- Efficient Merkle tree construction from any list of data items
- Cryptographic proof generation for any leaf node
- Proof verification to validate data integrity
- Tree visualization for debugging and educational purposes
- Support for different hash algorithms (SHA-256 by default)

## Requirements

- Node.js 20.x or later
- npm 10.x or later

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/merkle-tree-implementation.git
cd Merkle_Tree_Implementation
npm install
```

## Running the Project

### Run Tests

```bash
npm test
```

This will run all test cases that verify the functionality of the Merkle tree implementation.

### Build the Project

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist` directory.

## Usage Example

```typescript
import { MerkleTree } from './src/MerkleTree';

// Create a new Merkle tree
const data = ["apple", "banana", "cherry", "date"];
const tree = new MerkleTree(data);

// Get the root hash
console.log("Root Hash:", tree.getRoot());

// Generate a proof for "banana" (index 1)
const proof = tree.generateProof(1);

// Verify the proof
const isValid = tree.verifyProof("banana", proof, tree.getRoot());
console.log("Proof verification:", isValid ? "Valid" : "Invalid");

// Visualize the tree structure
console.log(tree.visualizeTree());
```

## Project Structure

- src - Source code for the Merkle tree implementation
- tests - Test files that verify the implementation works correctly
- `dist/` - Compiled JavaScript files (after running build)

## How Merkle Trees Work

A Merkle tree is a binary tree of hashes where:
- Leaf nodes contain hashes of individual data blocks
- Non-leaf nodes contain hashes of their children
- The root hash represents the entire dataset

This structure allows efficient verification of data integrity and enables compact proofs that a specific piece of data belongs to the dataset without revealing the entire dataset.

## License

MIT
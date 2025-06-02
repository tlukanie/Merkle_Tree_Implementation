import { MerkleTree } from '../src/MerkleTree';
import { 
  basicData, 
  singleItemData,
  oddNumberData,
  reversedData, 
  emptyData,
  invalidData,
  fruitData,
  getTamperedData
} from './testData';

// Test 1 for basic functionality
function testBasicFunctionality() {
  console.log("\nTest 1: Basic functionality with 4 items");
  const tree = new MerkleTree(basicData);
  console.log("Root Hash:", tree.getRoot());
  console.log("Tree Depth:", tree.getTreeDepth());
  console.log("Leaf Count:", tree.getLeafCount());
  console.log(tree.visualizeTree());
}

// Test 2 for one item
function testSingleItem() {
  console.log("\nTest 2: One item");
  const tree = new MerkleTree(singleItemData);
  console.log("Root Hash:", tree.getRoot());
  console.log("Tree Depth:", tree.getTreeDepth());
  console.log("Leaf Count:", tree.getLeafCount());
}

// Test 3 for odd nbr of items
function testOddNumberOfItems() {
  console.log("\nTest 3: Odd number of items");
  const tree = new MerkleTree(oddNumberData);
  console.log("Root Hash:", tree.getRoot());
  console.log("Tree Depth:", tree.getTreeDepth());
  console.log("Leaf Count:", tree.getLeafCount());
  console.log(tree.visualizeTree());
}

// Test 4 for empty data
function testEmptyData() {
	console.log("\nTest 4: Empty data");
	try {
	  const tree = new MerkleTree(emptyData);
	  console.log("Root Hash:", tree.getRoot());
	} catch (error) {
	  // Type-safe way to handle errors
	  if (error instanceof Error) {
		console.log("Error:", error.message);
	  } else {
		console.log("Error:", String(error));
	  }
	}
}

// Test 5 for bigger dataset
function testLargeDataset() {
  console.log("\nTest 5: Large dataset (20 items)");
  const tree = new MerkleTree(fruitData);
  console.log("Root Hash:", tree.getRoot());
  console.log("Tree Depth:", tree.getTreeDepth());
  console.log("Leaf Count:", tree.getLeafCount());
  console.log(tree.visualizeTree());
  
  // Display tree structure metrics
  const levels = tree.getTreeLevels();
  console.log("Tree Structure:");
  levels.forEach((level, i) => {
    console.log(`- Level ${i}: ${level.length} nodes`);
  });
}

// Test 6 with a different hash algorithm
function testDifferentHashAlgorithm() {
  console.log("\nTest 6: Different hash algorithm (sha512)");
  const tree = new MerkleTree(basicData, { hashAlgorithm: 'sha512' });
  console.log("Root Hash (SHA-512):", tree.getRoot());
  console.log(tree.visualizeTree());
}

// Test 7 for getTreeLevels method
function testTreeLevels() {
  console.log("\nTest 7: Test getTreeLevels method");
  const tree = new MerkleTree(basicData);
  const levels = tree.getTreeLevels();
  console.log("Number of levels:", levels.length);
  console.log("Nodes at level 0 (leaves):", levels[0].length);
  console.log("Nodes at level 1:", levels[1].length);
  console.log("Nodes at level 2 (root):", levels[2].length);
}

// Test 8 for consistency check
function testConsistency() {
  console.log("\nTest 8: Consistency check (same data should produce same root)");
  const treeA = new MerkleTree(basicData);
  const treeB = new MerkleTree(basicData);
  console.log("Trees have same root:", treeA.getRoot() === treeB.getRoot());
}

// Test 9 for order dependency check
function testOrderDependency() {
  console.log("\nTest 9: Order dependency check");
  const treeC = new MerkleTree(basicData);
  const treeD = new MerkleTree(reversedData);
  console.log("Different order produces different root:", treeC.getRoot() !== treeD.getRoot());
}

// Test 10 to generate and verify proofs
function testProofGeneration() {
  console.log("\nTest 10: Generate and verify Merkle proofs");
  const tree = new MerkleTree(basicData);
  console.log("Root hash:", tree.getRoot());
  
  // generating proof for each leaf
  for (let i = 0; i < basicData.length; i++) {
    const proof = tree.generateProof(i);
    console.log(`\nProof for leaf ${i} ("${basicData[i]}"):`);
    console.log(proof);
    
    // verifying the proof
    const isValid = tree.verifyProof(basicData[i], proof, tree.getRoot());
    console.log(`Proof verification: ${isValid ? 'Valid ✓' : 'Invalid ✗'}`);
    
    // testing with tampered data
    const tamperedData = basicData[i] + "tampered";
    const isInvalidData = tree.verifyProof(tamperedData, proof, tree.getRoot());
    console.log(`Tampered data verification (should fail): ${!isInvalidData ? 'Failed as expected ✓' : 'Unexpectedly passed ✗'}`);
  }
}

// Test 11 to generate all proofs
function testAllProofs() {
  console.log("\nTest 11: Generate all proofs at once");
  const data = basicData;
  const invalidData = ["123", "true", "hello world", "haha"];
  const tree = new MerkleTree(data);
  const allProofs = tree.generateAllProofs();
  console.log(`Generated ${allProofs.length} proofs`);
  
  // verifying each proof with valid data
  let allValidCorrect = true;
  for (let i = 0; i < allProofs.length; i++) {
    const { index, data: leafHash, proof } = allProofs[i];
    const isValid = tree.verifyProof(data[i], proof, tree.getRoot());
    if (!isValid) {
      allValidCorrect = false;
      console.log(`Proof ${i} with correct data is invalid!`);
    }
  }
  console.log(`All proofs with correct data valid: ${allValidCorrect ? 'Yes ✓' : 'No ✗'}`);
  
  // verifying each proof with invalid data
  let allInvalidFail = true;
  for (let i = 0; i < allProofs.length; i++) {
    if (i < invalidData.length && data[i] !== invalidData[i]) {
      const { proof } = allProofs[i];
      const isValid = tree.verifyProof(invalidData[i], proof, tree.getRoot());
      if (isValid) {
        allInvalidFail = false;
        console.log(`Proof ${i} with incorrect data unexpectedly passed!`);
      }
    }
  }
  console.log(`All proofs with incorrect data failed: ${allInvalidFail ? 'Yes ✓' : 'No ✗'}`);
}

// Main test runner function
function runAllTests() {
  console.log("\nRunning Merkle Tree Tests...");
  console.log("=".repeat(50));
  
  testBasicFunctionality();
  testSingleItem();
  testOddNumberOfItems();
  testEmptyData();
  testLargeDataset();
  testDifferentHashAlgorithm();
  testTreeLevels();
  testConsistency();
  testOrderDependency();
  testProofGeneration();
  testAllProofs();
  
  console.log("\n" + "=".repeat(90));
  console.log("All tests completed.");
}

// Run the tests
runAllTests();
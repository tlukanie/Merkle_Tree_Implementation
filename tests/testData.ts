export const basicData = ["123", "true", "hello world", "!@#$%"];
export const singleItemData = ["123"];
export const oddNumberData = ["123", "true", "hello world"];
export const reversedData = ["!@#$%", "hello world", "true", "123"];
export const emptyData: string[] = [];
export const invalidData = ["123", "true", "hello world", "haha"];

export const fruitData = [
  "apple", "banana", "cherry", "date", "elderberry",
  "fig", "grape", "honeydew", "kiwi", "lemon",
  "mango", "nectarine", "orange", "pear", "quince",
  "raspberry", "strawberry", "tangerine", "watermelon", "zucchini"
];

//for tampered
export function getTamperedData(original: string): string {
  return original + "tampered";
}
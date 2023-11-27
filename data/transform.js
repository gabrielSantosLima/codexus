import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

function trimFields(obj = []) {
  for (let index = 0; index < obj.length; index++) {
    obj[index] = obj[index].trim();
  }
  return obj;
}

function main() {
  const currentFolder = join("data");
  const currentPath = join(currentFolder, "data.csv");
  const content = readFileSync(currentPath, "utf-8");
  const splitedContent = content.split("\n");

  const data = [];

  for (let index = 1; index < splitedContent.length; index++) {
    let obj = splitedContent[index].split(",");
    obj = trimFields(obj);
    const [ID, book, author, description, genres, avgRating, numRatings, URL] =
      obj;
    data.push({
      ID,
      book,
      author,
      description,
      genres,
      avgRating,
      numRatings,
      URL,
    });
  }

  const json = JSON.stringify(data);
  const outFilePath = join(currentFolder, "data.json");
  writeFileSync(outFilePath, json);
}

main();

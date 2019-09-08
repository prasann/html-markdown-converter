const matter = require("gray-matter");
const path = require("path");

const TurndownService = require("turndown");
const fs = require("fs");

function readOldContent() {
  const data = {};
  const dir = "./data/inputs";
  fs.readdirSync(dir).forEach(filename => {
    const filepath = path.resolve(dir, filename);
    data[filename] = matter.read(filepath);
  });
  return data;
}

function createTopMatter(parsedFileName, ymlMatter){
  const result = [];
  result.push("---");
  result.push(`title: ${ymlMatter.title}`);
  result.push(`menuTitle: ${ymlMatter.title}`);
  result.push(`subTitle: ${ymlMatter['meta-description']}`);
  result.push(`postDescription: ${ymlMatter['meta-description']}`);
  result.push(`category: ${ymlMatter['categories']}`);
  result.push("---");
  return result.join("\r\n");
}

function processContent(parsedFileName, parsedHtml) {
  const turndownService = new TurndownService();
  return {
    markdown: turndownService.turndown(parsedHtml.content),
    topMatter: createTopMatter(parsedFileName, parsedHtml.data)
  };
}

function writeNewContent(parsedFileName, newContent) {
  const dirName = "./data/outputs/"
  const postsDir = `${parsedFileName.date}--${parsedFileName.slug}`
  const finalContent = [newContent.topMatter, newContent.markdown].join("\r\n");
  fs.mkdir(`${dirName}/${postsDir}`, function(err) {
    if (err) {
      return console.log(err);
    }
  })
  const filepath = path.resolve(`${dirName}/${postsDir}`, `index.md`);
  fs.writeFile(filepath, finalContent, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`File: ${filepath} is saved !!`);
  });
}

function parseOldFileName(fileName) {
  const parsedInfo = fileName.match(/^([0-9]*-[0-9]*-[0-9]*)-(.*).html$/);
  console.log(parsedInfo, fileName)
  return { date: parsedInfo[1], slug: parsedInfo[2] };
}

function convert() {
  const oldContent = readOldContent();
  Object.keys(oldContent).map(fileName => {
    const parsedFileName = parseOldFileName(fileName);
    const processedContent = processContent(
      parsedFileName,
      oldContent[fileName]
    );
    writeNewContent(parsedFileName, processedContent);
  });
}

convert();

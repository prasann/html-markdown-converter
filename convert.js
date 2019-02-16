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

function topMatter(parsedFileName, ymlMatter) {
  const result = [];
  result.push("---");
  result.push(`date: ${parsedFileName.date}`);
  Object.keys(ymlMatter).map(key => {
    result.push(`${key}: ${ymlMatter[key]}`);
  });
  result.push("---");
  return result.join("\r\n");
}

function processContent(parsedFileName, parsedHtml) {
  const turndownService = new TurndownService();
  return {
    markdown: turndownService.turndown(parsedHtml.content),
    topMatter: topMatter(parsedFileName, parsedHtml.data)
  };
}

function writeNewContent(parsedFileName, newContent) {
  const dirName = "./data/outputs/"
  const finalContent = [newContent.topMatter, newContent.markdown].join("\r\n");
  const filepath = path.resolve(dirName, `${parsedFileName.slug}.md`);
  fs.writeFile(filepath, finalContent, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`File: ${filepath} is saved !!`);
  });
}

function parseOldFileName(fileName) {
  const parsedInfo = fileName.match(/^([0-9]*-[0-9]*-[0-9]*)-(.*).html$/);
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

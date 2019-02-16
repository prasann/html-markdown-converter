const matter = require("gray-matter");
const path = require("path");

const TurndownService = require("turndown");
const fs = require("fs");

function readOldContent() {
  const data = {};
  const dir = "./../_posts_1";
  fs.readdirSync(dir).forEach(filename => {
    const filepath = path.resolve(dir, filename);
    data[filename] = matter.read(filepath);
  });
  return data;
}

function processContent(parsedFileName, parsedHtml) {
  const turndownService = new TurndownService();
  const ymlMatter = parsedHtml.data;
  const result = [];
  result.push("---");
  result.push(`date: ${parsedFileName.date}`);
  Object.keys(ymlMatter).map(key => {
    result.push(`${key}: ${ymlMatter[key]}`);
  });
  result.push("---");
  const topMatter = result.join("\r\n");
  return {
    markdown: turndownService.turndown(parsedHtml.content),
    topMatter
  };
}

function writeNewContent(parsedFileName, newContent) {
  const finalContent = [newContent.topMatter, newContent.markdown].join("\r\n");
  fs.writeFile(`${parsedFileName.slug}.md`, finalContent, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
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

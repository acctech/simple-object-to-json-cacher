const Cacher = require("../dist/index.js");
const fs = require("fs");

jest.setTimeout("100000");

const folderName = "testfolder";
const testContentObject = [
  { id: 1, name: "Billy" },
  { id: 2, name: "Mason" },
  { id: 3, name: "Todd" },
];
const eraseFile = true;

afterAll(() => {
  if (eraseFile) fs.rmSync(folderName, { recursive: true });
});

describe("Save Cache function", () => {
  it("should save a file into folder", async () => {
    let testObjectName = "testObject" + "_1";
    let cacher = Cacher("./" + folderName);
    await cacher.save(testObjectName, testContentObject);

    expect(
      fs.existsSync("./" + folderName + "/" + testObjectName + ".json")
    ).toEqual(true);
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });

  it("should save the given object into the file", async () => {
    let testObjectName = "testObject" + "_2";
    let cacher = Cacher("./" + folderName);
    await cacher.save(testObjectName, testContentObject);
    let pathOfFile = "./" + folderName + "/" + testObjectName + ".json";
    let actualFileContents = fs.readFileSync(pathOfFile);
    let expectedFileContents = JSON.stringify(testContentObject);
    expect(JSON.stringify(JSON.parse(actualFileContents))).toEqual(
      expectedFileContents
    );
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("Load Cache function", () => {
  it("should load the same saved given object", async () => {
    const testObjectName = "testObject" + "_3";
    let cacher = Cacher("./" + folderName);
    await cacher.save(testObjectName, testContentObject);
    let loadedTestObject = await cacher.load(testObjectName);

    expect(JSON.stringify(loadedTestObject)).toEqual(
      JSON.stringify(testContentObject)
    );
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("Exists Cache Function", () => {
  it("Check if Exists cached objects", async () => {
    const testObjectName = "testObject" + "_4";
    let cacher = Cacher("./" + folderName);
    await cacher.save(testObjectName, testContentObject);
    expect(cacher.exists(testObjectName)).toEqual(true);
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("ListDirectory Cache Function", () => {
  it("List Directory cached objects", async () => {
    const testObjectName = "testObject" + "_5";
    let cacher = Cacher("./" + folderName);
    await cacher.save(testObjectName, testContentObject);
    console.log(cacher.listDirectory(testObjectName));
    expect(
      cacher.listDirectory(testObjectName).includes(testObjectName + ".json")
    ).toEqual(true);
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("Massive Files", () => {
  it("should save massive file", async () => {
    let testObjectName = "massiveTestObject" + "_6";
    let cacher = Cacher("./" + folderName);

    let testContentObjectHuge = [];
    for (let i = 0; i < 6600000; i++) {
      let object = {
        id: i,
        name: Math.random().toString(36).substring(7),
        randomNum: Math.random(),
      };
      testContentObjectHuge.push(object);
    }
    await cacher.save(testObjectName, testContentObjectHuge);

    let loadedTestObjectName = await cacher.load(testObjectName);

    expect(loadedTestObjectName.length).toEqual(testContentObjectHuge.length);
    if (eraseFile)
      fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

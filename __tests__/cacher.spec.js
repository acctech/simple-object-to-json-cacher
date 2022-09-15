const Cacher = require("../dist/index.js");
const fs = require("fs");

const folderName = "testfolder";
const testContentObject = [
  { id: 1, name: "Billy" },
  { id: 2, name: "Mason" },
  { id: 3, name: "Todd" },
];

function deleteAssetsFolder() {
  if (fs.existsSync(folderName)) {
    fs.rmSync(folderName, { recursive: true });
  }
}

// beforeEach(() => {
//   deleteAssetsFolder();
// fs.rmSync("./" + folderName + "/testObject.json");
// });

describe("Save Cache function", () => {
  let testObjectName = "testObject";

  test("It should save a file into folder", () => {
    let cacher = Cacher("./" + folderName);
    cacher.save(testObjectName, testContentObject);

    expect(
      fs.existsSync("./" + folderName + "/" + testObjectName + ".json")
    ).toEqual(true);
    fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
  test("It should save the given object into the file", () => {
    let cacher = Cacher("./" + folderName);
    cacher.save(testObjectName, testContentObject);

    expect(
      JSON.stringify(
        JSON.parse(
          fs.readFileSync(
            "./" + folderName + "/" + testObjectName + ".json",
            "utf8"
          )
        )
      )
    ).toEqual(JSON.stringify(testContentObject));
    fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("Load Cache function", () => {
  const testObjectName = "testObject1";

  test("It should load the same saved given object", () => {
    let cacher = Cacher("./" + folderName);
    cacher.save(testObjectName, testContentObject);
    let loadedTestObject = cacher.load(testObjectName);

    expect(JSON.stringify(loadedTestObject)).toEqual(
      JSON.stringify(testContentObject)
    );
    fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("Exists Cache Function", () => {
  const testObjectName = "testObject2";

  let cacher = Cacher("./" + folderName);
  cacher.save(testObjectName, testContentObject);
  test("Check if Exists cached objects", () => {
    expect(cacher.exists(testObjectName)).toEqual(true);
    fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

describe("ListDirectory Cache Function", () => {
  const testObjectName = "testObject3";

  let cacher = Cacher("./" + folderName);
  cacher.save(testObjectName, testContentObject);

  console.log(cacher.listDirectory(testObjectName));

  test("List Directory cached objects", () => {
    expect(
      cacher.listDirectory(testObjectName).includes("testObject3.json")
    ).toEqual(true);
    fs.rmSync("./" + folderName + "/" + testObjectName + ".json");
  });
});

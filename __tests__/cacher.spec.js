import Cacher from '../src/index.js';
import fs from 'fs';

describe("Save Cache function", () => {
    test("It should save a file into folder", () => {
        const testContentObject = [
            { id: 1, name: "Billy" },
            { id: 2, name: "Mason" },
            { id: 3, name: "Todd" }
          ];
      
          let cacher = Cacher("./testfolder");
          cacher.save("testObject", testContentObject);

          expect(fs.existsSync("./testfolder/testObject.json")).toEqual(true);
          fs.rmSync("./testfolder/testObject.json");
    });
      test("It should save the given object into the file", () => {
        const testContentObject = [
            { id: 1, name: "Billy" },
            { id: 2, name: "Mason" },
            { id: 3, name: "Todd" }
          ];
      
          let cacher = Cacher("./testfolder");
          cacher.save("testObject", testContentObject);

          expect(JSON.stringify(JSON.parse(fs.readFileSync("./testfolder/testObject.json", "utf8")))).toEqual(JSON.stringify(testContentObject));
          fs.rmSync("./testfolder/testObject.json");
      });
});

describe("Load Cache function", () => {
    test("It should load the same saved given object", () => {
        const testContentObject = [
            { id: 1, name: "Billy" },
            { id: 2, name: "Mason" },
            { id: 3, name: "Todd" }
          ];
      
          let cacher = Cacher("./testfolder");
          cacher.save("testObject", testContentObject);
          let loadedTestObject = cacher.load("testObject");

          expect(JSON.stringify(loadedTestObject)).toEqual(JSON.stringify(testContentObject));
          fs.rmSync("./testfolder/testObject.json");
      });
});
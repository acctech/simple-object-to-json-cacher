import Cacher from "../src/index.js";

let exampleObjectToSave = {
    id: 0,
    name: "Jeshua",
    dob: "0/0/0"
}

let CACHEFOLDERPATH = "./example/folderForCachedObjects";
let cacher = Cacher(CACHEFOLDERPATH);

//Saving
cacher.save("cachedObject", exampleObjectToSave);

//Loading
let loadedCachedObject = cacher.load("cachedObject");
console.log(loadedCachedObject);
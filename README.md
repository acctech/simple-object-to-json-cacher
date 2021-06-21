##### About
Saves JS Object synchronously to plain text JSON file, and loads. (Basic Simple Unencrypted Serialisation)

# Usage

Declare a path to the folder where the cache will be stored. If the folder exists it will be used, if the last folder in the path does not exist it will be created.

```let CACHEFOLDERPATH = "./example/folderForCachedObjects";```

Create a Cacher object:

```let cacher = Cacher(CACHEFOLDERPATH);```

To save an object, call the save function of the Cacher object and provide the name of the file to save to without the JSON extension and the object as the second argument. The file will be saved in the Cache directory given as in the example above as CACHEFOLDERPATH. If the file already exists it will be replaced with the contents of the object.

```cacher.save("cachedObject", exampleObjectToSave);```

To restore and load an object, call the load function on the Cacher object and provide the name of the file to restore the object from without the JSON extension.

```
let loadedCachedObject = cacher.load("cachedObject");
console.log(loadedCachedObject);
```

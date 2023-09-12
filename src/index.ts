/**
 * @author Danny Falero
 * @copyright Copyright 2021 Christian Education Ministries, all rights reserved.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * https://raw.githubusercontent.com/acctech/kingjames.bible/master/kjv-src/kjv-1769.txt
 */

import fs from "fs";
import Path from "path";
import json from "big-json";
import { JsonStreamStringify } from "json-stream-stringify";
// import JSONStream from "JSONStream";

// Using TS syntax to export function https://stackoverflow.com/a/55945250
export = function Cacher(defaultFolder: string, isVerbose: boolean = false) {
  let VERBOSE = isVerbose;
  if (!fs.existsSync(defaultFolder)) {
    fs.mkdirSync(defaultFolder);
  }
  const folder = defaultFolder;
  return {
    save: async function (
      filename: string,
      object: any,
      forceStream: boolean = false
    ): Promise<void> {
      if (VERBOSE) {
        console.log("Saving", filename);
      }
      let filePath = Path.join(folder, filename + ".json");

      if (forceStream !== true) {
        try {
          // Try the old way for speed.
          fs.writeFileSync(filePath, JSON.stringify(object, null, 2), {
            encoding: "utf8",
            flag: "w",
          });
          return;
        } catch (e: any) {
          if (
            e.message === "Invalid string length" &&
            e.name === "RangeError"
          ) {
            forceStream = true;
          } else {
            throw e;
          }
        }
      }

      if (forceStream === true) {
        console.log("Trying to save", filename, "as stream");

        return await new Promise((resolve, reject) => {
          // Create a JsonStreamStringify instance to serialize the object
          const stringifyStream = new JsonStreamStringify(object);

          // Create a write stream to save the JSON data
          const writeStream = fs.createWriteStream(filePath, {
            encoding: "utf8",
          });

          stringifyStream.pipe(writeStream);

          writeStream.on("finish", () => {
            writeStream.end();
            if (VERBOSE) {
              console.log("Saved", filename);
            }
            resolve();
          });

          writeStream.on("error", (error) => {
            reject(error);
          });
        });
      }
    },
    /**
     * Load JSON file. Filename does not need path. Filename should be only the file name without extension.
     * @param filename
     * @returns {any}
     */
    load: async function (
      filename: string,
      forceStream: boolean = false
    ): Promise<any> {
      let filePath = Path.join(folder, filename + ".json");
      if (fs.existsSync(filePath)) {
        if (forceStream !== true) {
          try {
            // Try the normal way first for speed.
            return JSON.parse(
              fs.readFileSync(filePath, { encoding: "utf8" }).toString()
            );
          } catch (e: any) {
            if (
              e.message === "Invalid string length" &&
              e.name === "RangeError"
            ) {
              forceStream = true;
            } else {
              throw e;
            }
          }
        }

        if (forceStream === true) {
          console.log("Trying to load", filename, "as stream");
          let dataToReturn: any[] = await new Promise((resolve, reject) => {
            let data: any[] = [];
            const readStream = fs.createReadStream(filePath);
            const parseStream: any = json.createParseStream();
            parseStream.on("data", function (pojo: any) {
              data.push(pojo);
            });
            readStream.pipe(parseStream);
            parseStream.on("end", function () {
              resolve(data);
            });
            parseStream.on("error", function (error: Error) {
              reject(error);
            });
          });
          // If data contains two arrays, then return the children array
          if (dataToReturn.length === 1 && Array.isArray(dataToReturn[0])) {
            dataToReturn = dataToReturn[0];
          }
          return dataToReturn;
        }
      } else {
        return null;
      }
    },
    exists: function (filename: string) {
      let filePath = Path.join(folder, filename + ".json");
      return fs.existsSync(filePath);
    },
    listDirectory: function () {
      return fs.readdirSync(folder);
    },
  };
};

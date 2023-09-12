"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const big_json_1 = __importDefault(require("big-json"));
const json_stream_stringify_1 = require("json-stream-stringify");
module.exports = function Cacher(defaultFolder, isVerbose = false) {
    let VERBOSE = isVerbose;
    if (!fs_1.default.existsSync(defaultFolder)) {
        fs_1.default.mkdirSync(defaultFolder);
    }
    const folder = defaultFolder;
    return {
        save: function (filename, object, forceStream = false) {
            return __awaiter(this, void 0, void 0, function* () {
                if (VERBOSE) {
                    console.log("Saving", filename);
                }
                let filePath = path_1.default.join(folder, filename + ".json");
                if (forceStream !== true) {
                    try {
                        // Try the old way for speed.
                        fs_1.default.writeFileSync(filePath, JSON.stringify(object, null, 2), {
                            encoding: "utf8",
                            flag: "w",
                        });
                        return;
                    }
                    catch (e) {
                        if (e.message === "Invalid string length" &&
                            e.name === "RangeError") {
                            forceStream = true;
                        }
                        else {
                            throw e;
                        }
                    }
                }
                if (forceStream === true) {
                    console.log("Trying to save", filename, "as stream");
                    return yield new Promise((resolve, reject) => {
                        // Create a JsonStreamStringify instance to serialize the object
                        const stringifyStream = new json_stream_stringify_1.JsonStreamStringify(object);
                        // Create a write stream to save the JSON data
                        const writeStream = fs_1.default.createWriteStream(filePath, {
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
            });
        },
        /**
         * Load JSON file. Filename does not need path. Filename should be only the file name without extension.
         * @param filename
         * @returns {any}
         */
        load: function (filename, forceStream = false) {
            return __awaiter(this, void 0, void 0, function* () {
                let filePath = path_1.default.join(folder, filename + ".json");
                if (fs_1.default.existsSync(filePath)) {
                    if (forceStream !== true) {
                        try {
                            // Try the normal way first for speed.
                            return JSON.parse(fs_1.default.readFileSync(filePath, { encoding: "utf8" }).toString());
                        }
                        catch (e) {
                            if (e.message === "Invalid string length" &&
                                e.name === "RangeError") {
                                forceStream = true;
                            }
                            else {
                                throw e;
                            }
                        }
                    }
                    if (forceStream === true) {
                        console.log("Trying to load", filename, "as stream");
                        let dataToReturn = yield new Promise((resolve, reject) => {
                            let data = [];
                            const readStream = fs_1.default.createReadStream(filePath);
                            const parseStream = big_json_1.default.createParseStream();
                            parseStream.on("data", function (pojo) {
                                data.push(pojo);
                            });
                            readStream.pipe(parseStream);
                            parseStream.on("end", function () {
                                resolve(data);
                            });
                            parseStream.on("error", function (error) {
                                reject(error);
                            });
                        });
                        // If data contains two arrays, then return the children array
                        if (dataToReturn.length === 1 && Array.isArray(dataToReturn[0])) {
                            dataToReturn = dataToReturn[0];
                        }
                        return dataToReturn;
                    }
                }
                else {
                    return null;
                }
            });
        },
        exists: function (filename) {
            let filePath = path_1.default.join(folder, filename + ".json");
            return fs_1.default.existsSync(filePath);
        },
        listDirectory: function () {
            return fs_1.default.readdirSync(folder);
        },
    };
};

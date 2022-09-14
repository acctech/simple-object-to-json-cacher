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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
module.exports = function Cacher(defaultFolder, isVerbose = false) {
    let VERBOSE = isVerbose;
    if (!fs_1.default.existsSync(defaultFolder)) {
        fs_1.default.mkdirSync(defaultFolder);
    }
    const folder = defaultFolder;
    return {
        save: function (filename, object) {
            if (VERBOSE) {
                console.log("Saving", filename);
            }
            fs_1.default.writeFileSync(path_1.default.join(folder, filename + ".json"), JSON.stringify(object, null, 2), { encoding: "utf8", flag: "w" });
            if (VERBOSE) {
                console.log("Saved", filename);
            }
        },
        /**
         * Load JSON file. Filename does not need path. Filename should be only the file name without extension.
         * @param filename
         * @returns {any}
         */
        load: function (filename) {
            let filePath = path_1.default.join(folder, filename + ".json");
            if (fs_1.default.existsSync(filePath)) {
                return JSON.parse(fs_1.default.readFileSync(filePath, { encoding: "utf8" }).toString());
            }
            else {
                return null;
            }
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

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

import fs from 'fs';
import Path from 'path';

export default function Cacher(defaultFolder){
    const VERBOSE = true;
    if(!fs.existsSync(defaultFolder)){
        fs.mkdirSync(defaultFolder);
    }
    const folder = defaultFolder;
    return {
        save: function(filename, object){
            if(VERBOSE){
                console.log("Saving", filename);
            }
            fs.writeFileSync(Path.join(folder, filename + ".json"), JSON.stringify(object, null, 2), {encoding:'utf8',flag:'w'});
        },
        /**
         * Load JSON file. Filename does not need path. Filename should be only the file name without extension.
         * @param filename
         * @returns {any}
         */
        load: function(filename){
            let filePath = Path.join(folder, filename + ".json");
            if(fs.existsSync(filePath)){
                return JSON.parse((fs.readFileSync(filePath, {encoding:'utf8'})).toString());
            } else {
                return null;
            }
        },
        exists: function(filename){
            let filePath = Path.join(folder, filename + ".json");
            return fs.existsSync(filePath);
        }

    }
}

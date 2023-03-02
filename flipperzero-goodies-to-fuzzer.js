const {resolve} = require('path');
const {readdir, readFile, writeFile} = require('fs').promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, {withFileTypes: true});
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const dir = `.`;
const filePrefix = `fuzzer`;

const state = {
  ibutton: {
    Cyfral: [],
    Dallas: [],
    Metakom: []
  },
  rfid: {
    EM4100: [],
    H10301: [],
    I40134: [],
  },
};

const requiredLength = {
  ibutton: {
    Cyfral: 2,
    Dallas: 8,
    Metakom: 4
  },
  rfid: {
    EM4100: 5,
    H10301: 3,
    I40134: 3,
  },
}

const getKeyType = (text) => {
  return text.match(/Key type: ([a-zA-Z0-9]+)/)[1];
}

const getKey = (text) => {
  return text.match(/Data: ([a-zA-Z0-9 ]+)/)[1].replaceAll(/ /g, ``);
}

const ibuttonParser = (text) => {
  const keyType = getKeyType(text);
  const key = getKey(text);

  if (requiredLength.ibutton[keyType] * 2 === key.length)
    state.ibutton[keyType].push(key);
};

const rfidParser = (text) => {
  const keyType = getKeyType(text);
  const key = getKey(text);

  if (requiredLength.rfid[keyType] * 2 === key.length)
    state.rfid[keyType].push(key);

};

const sortAndFilter = () => {
  for (const [type, obj] of Object.entries(state)) {
    for (const [keyType, arr] of Object.entries(obj)) {
      state[type][keyType] = [...new Set(arr)].sort((a, b) => a.length - b.length || a.localeCompare(b));
    }
  }
};

(async () => {
  for await (const f of getFiles(dir)) {
    const fileContent = (await readFile(f)).toString();
    if (f.endsWith(`.ibtn`)) {
      ibuttonParser(fileContent);
    } else if (f.endsWith(`.rfid`)) {
      rfidParser(fileContent)
    }
  }

  sortAndFilter();

  for (const [type, obj] of Object.entries(state)) {
    for (const [keyType, arr] of Object.entries(obj)) {
	  if (arr.length) {
        const filename = `${filePrefix}__${type}_${keyType}.txt`;
        await writeFile(filename, `# ${filename.toUpperCase()}\n` + arr.join(`\n`) + `\n`);
      }
    }
  }

})()
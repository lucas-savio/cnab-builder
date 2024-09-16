import path from "path";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

import chalk from "chalk";

import optionsYargs from "./config/options.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultFilePath = `${__dirname}/example/cnabExample.rem`

const { 
  from,
  to, 
  segmento,
  // permite a entrada de um caminho para o arquivo, e um fallback para um arquivo exemplo
  file = path.resolve(defaultFilePath), 
} = optionsYargs;

const sliceArrayPosition = (arr, ...positions) => [...arr].slice(...positions);

const messageLog = (segmento, segmentoType, from, to) => `
${
  file === defaultFilePath 
    ? `
usando arquivo de exemplo em ${defaultFilePath}
    `
    : `
usando arquivo: ${file}
    `
}

----- Cnab linha ${segmentoType} -----


posição from: ${chalk.inverse.bgBlack(from)}

posição to: ${chalk.inverse.bgBlack(to)}

item isolado: ${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}

item dentro da linha P: 
  ${segmento.substring(0, from)}${chalk.inverse.bgBlack(
  segmento.substring(from - 1, to)
)}${segmento.substring(to)}

----- FIM ------
`;

const log = console.log;

console.time("leitura Async");

readFile(file, "utf8")
  .then((file) => {
    const cnabArray = file.split("\n");

    const cnabHeader = sliceArrayPosition(cnabArray, 0, 2);

    const [cnabBodySegmentoP, cnabBodySegmentoQ, cnabBodySegmentoR] =
      sliceArrayPosition(cnabArray, 2, -2);

    const cnabTail = sliceArrayPosition(cnabArray, -2);

    if (segmento === "p") {
      log(messageLog(cnabBodySegmentoP, "P", from, to));
      return;
    }

    if (segmento === "q") {
      log(messageLog(cnabBodySegmentoQ, "Q", from, to));
      return;
    }

    if (segmento === "r") {
      log(messageLog(cnabBodySegmentoR, "R", from, to));
      return;
    }
  })
  .catch((error) => {
    console.log("🚀 ~ file: cnabRows.js ~ line 76 ~ error", error);
  });
console.timeEnd("leitura Async");

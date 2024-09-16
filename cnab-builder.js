import path from "path";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import chalk from "chalk";

import {
  COMPANY_CITY_END_POS,
  COMPANY_CITY_START_POS,
  COMPANY_LOG_END_POS,
  COMPANY_LOG_START_POS,
  COMPANY_NAME_START_POS,
  COMPANY_NAME_END_POS,
  COMPANY_POSTAL_END_POS,
  COMPANY_POSTAL_START_POS,
  COMPANY_STATE_END_POS,
  COMPANY_STATE_START_POS,
  SEGMENT_POS,
} from "./constants.js";
import optionsYargs from "./config/options.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultFilePath = `${__dirname}/example/cnabExample.rem`;

const {
  from,
  to,
  segmento,
  empresa,
  output,
  // permite a entrada de um caminho para o arquivo, e um fallback para um arquivo exemplo
  file = path.resolve(defaultFilePath),
} = optionsYargs;

const searchByName = (arr, name) =>
  arr
    .filter((row) => row.toLowerCase().includes(name.toLowerCase()))
    .map((row) => ({
      name: row.substring(COMPANY_NAME_START_POS, COMPANY_NAME_END_POS).trim(),
      address: row.substring(COMPANY_LOG_START_POS, COMPANY_LOG_END_POS).trim(),
      postal: row
        .substring(COMPANY_POSTAL_START_POS, COMPANY_POSTAL_END_POS)
        .trim(),
      city: row.substring(COMPANY_CITY_START_POS, COMPANY_CITY_END_POS).trim(),
      state: row
        .substring(COMPANY_STATE_START_POS, COMPANY_STATE_END_POS)
        .trim(),
      row: row,
    }));

const searchBySegment = (arr, seg, from, to) =>
  arr
    .filter((row) => row[SEGMENT_POS].toLowerCase() === seg.toLowerCase())
    .map((row) => ({
      segmento: row[SEGMENT_POS],
      data: row.substring(from - 1, to),
      row,
    }));

const generateOutputFile = async (data) => {
  const body = JSON.stringify(data, null, 2);
  await writeFile(path.resolve(__dirname, "output.json", body));
  log(chalk.blue(`Output file generated: ${output.json}`));
};

const log = console.log;

const main = async () => {
  console.time("cnab run");
  try {
    const filePath = await readFile(file, "utf8");
    const cnabArray = filePath.split("\n");

    if (!segmento && !empresa) {
      throw new Error("Empresa ou Segmento devem ser fornecidos");
    }

    if (file === defaultFilePath) {
      log(`usando arquivo de exemplo em ${defaultFilePath}`);
    } else {
      log(`usando arquivo: ${file}`);
    }

    if (segmento) {
      const segResult = searchBySegment(cnabArray, segmento, from, to);
      segResult.forEach((r) => {
        log(`segmento: ${r.segmento}`);
        log(`linha: ${r.row}`);
        log(`info: ${r.data}`);
        log("\n");
      });
    }

    if (empresa) {
      const searchResult = searchByName(cnabArray, empresa);
      searchResult.forEach((r) => {
        log(`Empresa: ${r.name}`);
        log(`Endereço \n
          LOGRADOURO: ${r.address} \n
          CEP: ${r.postal} \n
          Cidade: ${r.city} \n
          Estado: ${r.state} \n
        `);
        log(`Linha: ${r.row}`);
        log("\n");
      });

      if (output) {
        await generateOutputFile(searchResult);
      }
    }
  } catch (error) {
    log(chalk.red(error.message));
  }
  console.timeEnd("cnab run");
};

main();

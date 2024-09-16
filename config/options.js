import yargs from "yargs";

const optionsYargs = yargs(process.argv.slice(2))
  .usage("Uso: $0 [options]")
  .option("f", {
    alias: "from",
    describe: "posição inicial de pesquisa da linha do Cnab",
    type: "number",
    demandOption: true,
  })
  .option("t", {
    alias: "to",
    describe: "posição final de pesquisa da linha do Cnab",
    type: "number",
    demandOption: true,
  })
  .option("s", {
    alias: "segmento",
    describe: "tipo de segmento",
    type: "string",
    demandOption: true,
  })
  .option("p", {
    alias: "file",
    describe: "caminho para arquivo",
    type: "string",
    demandOption: false,
  })
  .example(
    "$0 -f 21 -t 34 -s p",
    "lista a linha e campo que from e to do cnab"
  ).argv;

export default optionsYargs;

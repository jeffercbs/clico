import { Command } from "commander";
import prompts from "./promts.js";

const cli = new Command()

cli.name("clico")
   .description("generate")
   .version("1.0.1")
   .option("--init", "execute")
   .action((options) => {
      if (options.init) prompts()
   })

cli.parse()
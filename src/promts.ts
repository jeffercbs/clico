import inquirer, { Answers, QuestionCollection } from "inquirer";
import pc from "picocolors";
import { COMMIT_TYPES } from "./consts.js";
import { getChangedFiles } from "./git.js";
import { checkRepoLocal, exitProgram, generateCommit } from "./utils.js";

const check = await checkRepoLocal().then(value => value)
const changedFiles = ["All", ...(await getChangedFiles().then(files => files))]

const QUESTIONS: QuestionCollection<Answers> = [
   {
      type: "checkbox",
      name: "files",
      message: "",
      choices: changedFiles.map(file => ({
         name: file,
         value: file
      })),
      validate: function (input: string[]) {
         if (input.length < 1) {
            return pc.red("Selec a value")
         }
         return true
      },
      when: check
   },
   {
      type: "list",
      name: "commitTypes",
      message: "commit types",
      choices: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
         name: `${value.emoji} ${key.padEnd(15, ".")} ${value.description}`,
         value: key,
      }))
   },
   {
      type: "input",
      name: "commit",
      message: "Enter a short description of the commit:",
      validate: function (input: string) {
         if (!input) {
            return pc.red("ingrese un mensaje")
         } else if (input.length > 100) {
            return pc.yellow("El message debe ser de 100")
         }
         return true
      }
   },
   {
      type: "confirm",
      name: "confirm",
      default: true,
   }
]


export default function prompts() {
   inquirer.prompt(QUESTIONS).then(answers => {
      if (answers.confirm) {
         const files = answers.files[0] == "All" ? changedFiles : answers.files;
         const commitType = answers.commitTypes;
         const commit = generateCommit(commitType, answers.commit);

         console.log(commit)
         console.log(files)

         exitProgram(0, "thanks")
      }

      exitProgram(0, "bye")
   }).catch((error) => console.error(error))
}
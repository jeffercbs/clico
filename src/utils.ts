import { existsSync } from "node:fs"
import pc from "picocolors"
import { COMMIT_TYPES } from "./consts.js"
import { getChangedFiles, getStagedFiles } from "./git.js"

export async function checkRepoLocal(): Promise<(boolean)> {
   if (await existsSync(".git")) {
      const changedFiles = await getChangedFiles()
      const stagedFiles = await getStagedFiles()

      if (stagedFiles.length === 0 && changedFiles.length > 0) return true
      return false
   }

   exitProgram(1, "Please initialize git before")
   return false
}

export function exitProgram(code: number, msg: string) {
   let info: string = code ? pc.red(msg) : pc.green(msg);

   if (code) {
      console.error(`Error: [${info}] \n`)
      console.log("Oops an error, if the error persists create an issue in the github.")
      console.log(pc.blue("https://github.com/jeffercbs/clico/issues \n"))
   } else {
      console.log(pc.green("bye"))
   }

   process.exit(code)
}

export function generateCommit(type: string, message: string): string {
   const { emoji } = COMMIT_TYPES[type];
   let commit = `[${emoji}${type}]: ${message}`;

   return commit;
}
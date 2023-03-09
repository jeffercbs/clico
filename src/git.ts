import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

function cleanOutput(stdout: string): string[] {
   return stdout.trim().split("\n").filter(Boolean)
}

async function getChangedFiles(): Promise<String[]> {
   const { stdout } = await execAsync("git status --porcelain")
   return cleanOutput(stdout).map(file => file.replace(/^\?\?\s/, ""))
}

async function getStagedFiles(): Promise<String[]> {
   const { stdout } = await execAsync("git diff --cached --name-only");
   return cleanOutput(stdout)
}

export { getChangedFiles, getStagedFiles }
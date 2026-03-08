import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const refName = process.env.GITHUB_REF_NAME ?? process.argv[2] ?? ''

if (!refName) {
  throw new Error('A release tag is required. Provide GITHUB_REF_NAME or pass the tag name as the first argument.')
}

const match = /^sdk-js\/v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/.exec(refName)
if (!match?.groups?.version) {
  throw new Error(`Invalid sdk-js release tag format: ${refName}. Expected sdk-js/vMAJOR.MINOR.PATCH.`)
}

if (packageJson.version !== match.groups.version) {
  throw new Error(`Tag version ${match.groups.version} does not match package.json version ${packageJson.version}.`)
}

process.stdout.write(`Validated sdk-js release tag ${refName}\n`)

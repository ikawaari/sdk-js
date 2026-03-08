import {readFile, writeFile, mkdir} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJsonPath = path.resolve(__dirname, '../package.json')
const outputDir = path.resolve(__dirname, '../dist')
const outputPath = path.join(outputDir, 'release-manifest.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))

const manifest = {
  packageName: packageJson.name,
  version: packageJson.version,
  gitTag: process.env.GITHUB_REF_NAME ?? '',
  commitSha: process.env.GITHUB_SHA ?? '',
  generatedAt: new Date().toISOString()
}

await mkdir(outputDir, { recursive: true })
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
process.stdout.write(`Wrote release manifest to ${outputPath}\n`)

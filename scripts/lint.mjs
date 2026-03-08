import {access, readdir, stat} from 'node:fs/promises'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function collectFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath, extension))
      continue
    }

    if (entry.isFile() && absolutePath.endsWith(extension)) {
      files.push(absolutePath)
    }
  }

  return files
}

async function assertExists(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath)
  await access(absolutePath)
  const info = await stat(absolutePath)
  if (!info.isFile()) {
    throw new Error(`${relativePath} must be a file.`)
  }
}

function checkSyntax(filePath) {
  const result = spawnSync(process.execPath, ['--check', filePath], {
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    throw new Error(`Syntax check failed for ${filePath}`)
  }
}

await assertExists('package.json')
await assertExists('tsconfig.json')
await assertExists('scripts/validate-release-tag.mjs')
await assertExists('scripts/write-release-manifest.mjs')

const scriptFiles = await collectFiles(path.join(projectRoot, 'scripts'), '.mjs')
const testFiles = await collectFiles(path.join(projectRoot, 'test'), '.mjs')

for (const filePath of [...scriptFiles, ...testFiles]) {
  checkSyntax(filePath)
}

process.stdout.write(`Validated ${scriptFiles.length} script files and ${testFiles.length} test files.\n`)

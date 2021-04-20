import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

// 256 MB LIMIT
const MAX_ARCHIVE_SIZE = 268435456

export function convertToBase64(str: string): string {
  // create a buffer
  const buff = Buffer.from(str, 'utf-8')

  // decode buffer as Base64
  return buff.toString('base64')
}

export function getAllFiles(dirPath: string, arrayOfFiles: [] = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles)
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      arrayOfFiles.push(path.join(dirPath, file))
    }
  })

  return arrayOfFiles
}

export function getTotalSize(directoryPath: string) {
  const arrayOfFiles = getAllFiles(directoryPath)

  let totalSize = 0

  arrayOfFiles.forEach((filePath) => {
    totalSize += fs.statSync(filePath).size
  })

  return totalSize
}

export function createArchivesFor(assets: string[], assetsArchiveName: string) {
  const groupedAssets: Array<Array<string>> = []
  let currentGroupSize = 0

  assets.reduce((group: Array<Array<string>>, asset) => {
    let latestGroupIndex = group.length > 0 ? group.length - 1 : 0

    const [source] = asset.split(':')

    const fileSize = getTotalSize(source)

    if (currentGroupSize > 0 && (currentGroupSize + fileSize) >= MAX_ARCHIVE_SIZE) {
      currentGroupSize = 0
      latestGroupIndex += 1
    }

    // eslint-disable-next-line no-param-reassign
    if (!group[latestGroupIndex]) group[latestGroupIndex] = []

    currentGroupSize += fileSize
    group[latestGroupIndex].push(asset)

    return group
  }, groupedAssets)

  const archives = groupedAssets.map((assetsInGroup: string[], index: number) => {
    const archive = new AdmZip()

    assetsInGroup.forEach((attachment) => {
      const [source, target] = attachment.split(':')
      if (fs.existsSync(source)) {
        archive.addLocalFolder(source, target || '')
      }
    })

    let name = `${assetsArchiveName}.zip`
    if (groupedAssets.length > 1) {
      name = `${assetsArchiveName}-${index + 1}.zip`
    }
    // Another way to write the zip file: `writeZip()`
    archive.writeZip(name)

    return name
  })

  return archives
}

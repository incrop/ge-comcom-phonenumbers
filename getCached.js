import fs from 'fs';

const CACHE_DIR = 'cache'

const getCached = async (key, calculate) => {
  if (!fs.existsSync(CACHE_DIR)){
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
  const cacheFile = `${CACHE_DIR}/${key}.json`
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile).toString())
  }
  const calculated = await calculate()
  fs.writeFileSync(cacheFile, JSON.stringify(calculated, null, 2))
  return calculated
}

export default getCached;
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const packages = [ 'common', 'http' ]


console.log('Creating symlinks ...')

if (!fs.existsSync('./node_modules')) {
  console.error('Please run `npm i` first.')
} else {

  rimraf.sync('./node_modules/@glasswing/*')

  for (package of packages) {

    linkFrom = fs.realpathSync(`../${package}`)
    linkTo = path.join(fs.realpathSync(`./node_modules/@glasswing`), package)

    console.log(`Linking '${linkFrom}' to '${linkTo}' ...`)
    fs.symlinkSync(linkFrom, linkTo, 'junction')
    console.log('linked.')

  }
  console.log('done')

}

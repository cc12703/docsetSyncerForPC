const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('root', resolve('./'))
    },
    configureWebpack: {
      devtool: 'source-map'
    },
    pluginOptions: {
      electronBuilder: {
        preload: 'src/preload.ts',
        chainWebpackMainProcess: config => {
          config.resolve.alias
            .set('@', resolve('src'))
            .set('root', resolve('./'))
        },
        builderOptions: {
          productName: 'docsetsyncer',
          appId: 'com.cc12703.app.docsetsyncer',
          dmg: {
            contents: [
              {
                x: 410,
                y: 150,
                type: 'link',
                path: '/Applications'
              },
              {
                x: 130,
                y: 150,
                type: 'file'
              }
            ]
          },
          mac: {
            icon: 'build/icons/icon.icns',
            extendInfo: {
              LSUIElement: 1
            }
          }
        }
      }
    }
}
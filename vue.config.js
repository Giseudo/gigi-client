module.exports = {
  chainWebpack: config => {
    config.module
      .rule('shader')
      .test(/\.glsl$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()

    config.module
      .rule('models')
      .test(/\.(fbx|glb|font)$/)
      .use('file-loader')
        .loader('file-loader')
        .end()
  }
}

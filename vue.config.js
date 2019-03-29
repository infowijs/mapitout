module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .oneOf("external")
      .resourceQuery(/external/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/[name].[hash:8].[ext]"
      })
      .end()
      .end()
      .oneOf("internal")
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  }
};

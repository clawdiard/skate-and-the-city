module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/sw.js");
  eleventyConfig.addPassthroughCopy("data");

  // Add loading="lazy" to all images without it
  eleventyConfig.addTransform("lazyimages", function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return content.replace(/<img(?!.*loading=)(.*?)>/gi, '<img loading="lazy"$1>');
    }
    return content;
  });

  // Nunjucks filter for truncate
  eleventyConfig.addFilter("truncate", function(str, len) {
    if (!str) return "";
    if (str.length <= len) return str;
    return str.substring(0, len).replace(/\s+\S*$/, "") + "…";
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    pathPrefix: "/skate-and-the-city/"
  };
};

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    {
      builder: 'mkdist',
      input: './src/frameworks/',
      outDir: './dist/frameworks',
      ext: 'js',
    },
  ],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
  },
  alias: {
    prompts: 'prompts/lib/index.js',
  },
})

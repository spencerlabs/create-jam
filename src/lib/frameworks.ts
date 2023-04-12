export const FRAMEWORKS: {
  name: string
  display: string
  cmd: string
  package?: string
  projDir?: boolean
}[] = [
  {
    name: 'angular',
    display: 'Angular',
    package: '@angular/cli',
    cmd: 'ng new',
  },
  { name: 'astro', display: 'Astro', cmd: 'npx create-astro' },
  {
    name: 'blitz',
    display: 'Blitz',
    package: 'blitz',
    cmd: 'blitz new',
  },
  {
    name: 'docsify',
    display: 'Docsify',
    package: 'docsify-cli',
    cmd: 'docsify init ./docs',
  },
  {
    name: 'docusaurus',
    display: 'Docusaurus',
    cmd: 'npx create-docusaurus',
  },
  { name: 'gatsby', display: 'Gatsby', cmd: 'npx create-gatsby' },
  {
    name: 'gridsome',
    display: 'Gridsome',
    package: '@gridsome/cli',
    cmd: 'gridsome create',
    projDir: true,
  },
  {
    name: 'hexo',
    display: 'Hexo',
    package: 'hexo-cli',
    cmd: 'hexo init',
    projDir: true,
  },
  {
    name: 'nest',
    display: 'Nest',
    package: '@nestjs/cli',
    cmd: 'nest new',
  },
  { name: 'next', display: 'Next', cmd: 'npx create-next-app' },
  {
    name: 'nuxt',
    display: 'Nuxt',
    cmd: 'npx create-nuxt-app',
    projDir: true,
  },
  {
    name: 'preact',
    display: 'Preact',
    cmd: 'npx preact-cli create',
  },
  {
    name: 'quasar',
    display: 'Quasar',
    cmd: 'npx create-quasar',
  },
  {
    name: 'react',
    display: 'React',
    cmd: 'npx create-react-app',
    projDir: true,
  },
  {
    name: 'redwood',
    display: 'Redwood',
    cmd: 'npx create-redwood-app',
    projDir: true,
  },
  { name: 'remix', display: 'Remix', cmd: 'npx create-remix' },
  {
    name: 'stencil',
    display: 'Stencil',
    cmd: 'npx create-stencil',
  },
  {
    name: 'sveltekit',
    display: 'SvelteKit',
    cmd: 'npx create-svelte',
  },
  { name: 'vite', display: 'Vite', cmd: 'npx create-vite' },
  {
    name: 'vuepress',
    display: 'VuePress',
    cmd: 'npx create-vuepress-site',
  },
]

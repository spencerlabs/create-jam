type Framework = {
  name: string
  display: string
  type: 'create' | 'cli'
  package?: string
  cmd: string
  projDir?: boolean
}

export const FRAMEWORKS: Framework[] = [
  {
    name: 'angular',
    display: 'Angular',
    type: 'cli',
    package: '@angular/cli',
    cmd: 'ng new',
  },
  { name: 'astro', display: 'Astro', type: 'create', cmd: 'create-astro' },
  {
    name: 'blitz',
    display: 'Blitz',
    type: 'cli',
    package: 'blitz',
    cmd: 'blitz new',
  },
  {
    name: 'docsify',
    display: 'Docsify',
    type: 'cli',
    package: 'docsify-cli',
    cmd: 'docsify init ./docs',
  },
  {
    name: 'docusaurus',
    display: 'Docusaurus',
    type: 'create',
    cmd: 'create-docusaurus',
  },
  { name: 'gatsby', display: 'Gatsby', type: 'create', cmd: 'create-gatsby' },
  {
    name: 'gridsome',
    display: 'Gridsome',
    type: 'cli',
    package: '@gridsome/cli',
    cmd: 'gridsome create',
    projDir: true,
  },
  {
    name: 'hexo',
    display: 'Hexo',
    type: 'cli',
    package: 'hexo-cli',
    cmd: 'hexo init',
    projDir: true,
  },
  {
    name: 'nest',
    display: 'Nest',
    type: 'cli',
    package: '@nestjs/cli',
    cmd: 'nest new',
  },
  { name: 'next', display: 'Next', type: 'create', cmd: 'create-next-app' },
  {
    name: 'nuxt',
    display: 'Nuxt',
    type: 'create',
    cmd: 'create-nuxt-app',
    projDir: true,
  },
  {
    name: 'preact',
    display: 'Preact',
    type: 'create',
    cmd: 'preact-cli create',
  },
  {
    name: 'quasar',
    display: 'Quasar',
    type: 'create',
    cmd: 'create-quasar',
  },
  {
    name: 'react',
    display: 'React',
    type: 'create',
    cmd: 'create-react-app',
    projDir: true,
  },
  {
    name: 'redwood',
    display: 'Redwood',
    type: 'create',
    cmd: 'create-redwood-app',
    projDir: true,
  },
  { name: 'remix', display: 'Remix', type: 'create', cmd: 'create-remix' },
  {
    name: 'stencil',
    display: 'Stencil',
    type: 'create',
    cmd: 'create-stencil',
  },
  {
    name: 'sveltekit',
    display: 'SvelteKit',
    type: 'create',
    cmd: 'create-svelte',
  },
  { name: 'vite', display: 'Vite', type: 'create', cmd: 'create-vite' },
  {
    name: 'vuepress',
    display: 'VuePress',
    type: 'create',
    cmd: 'create-vuepress-site',
  },
]

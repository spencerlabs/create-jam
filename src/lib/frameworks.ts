export const FRAMEWORKS: {
  [x: string]: {
    name: string
    cmd: string
    pkg?: string
    dir?: boolean
  }
} = {
  angular: {
    name: 'Angular',
    pkg: '@angular/cli',
    cmd: 'ng new',
  },
  astro: {
    name: 'Astro',
    cmd: 'npx create-astro',
  },
  blitz: {
    name: 'Blitz',
    pkg: 'blitz',
    cmd: 'blitz new',
  },
  docsify: {
    name: 'Docsify',
    pkg: 'docsify-cli',
    cmd: 'docsify init ./docs',
  },
  docusaurus: {
    name: 'Docusaurus',
    cmd: 'npx create-docusaurus',
  },
  gatsby: {
    name: 'Gatsby',
    cmd: 'npx create-gatsby',
  },
  gridsome: {
    name: 'Gridsome',
    pkg: '@gridsome/cli',
    cmd: 'gridsome create',
    dir: true,
  },
  hexo: {
    name: 'Hexo',
    pkg: 'hexo-cli',
    cmd: 'hexo init',
    dir: true,
  },
  nest: {
    name: 'Nest',
    pkg: '@nestjs/cli',
    cmd: 'nest new',
  },
  next: {
    name: 'Next',
    cmd: 'npx create-next-app',
  },
  nuxt: {
    name: 'Nuxt',
    cmd: 'npx create-nuxt-app',
    dir: true,
  },
  preact: {
    name: 'Preact',
    cmd: 'npx preact-cli create',
  },
  quasar: {
    name: 'Quasar',
    cmd: 'npx create-quasar',
  },
  react: {
    name: 'React',
    cmd: 'npx create-react-app',
    dir: true,
  },
  redwood: {
    name: 'Redwood',
    cmd: 'npx create-redwood-app',
    dir: true,
  },
  remix: {
    name: 'Remix',
    cmd: 'npx create-remix',
  },
  stencil: {
    name: 'Stencil',
    cmd: 'npx create-stencil',
  },
  sveltekit: {
    name: 'SvelteKit',
    cmd: 'npx create-svelte',
  },
  vite: {
    name: 'Vite',
    cmd: 'npx create-vite',
  },
  vuepress: {
    name: 'VuePress',
    cmd: 'npx create-vuepress-site',
  },
}

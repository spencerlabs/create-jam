const templates: { [key: string]: string[] } = {
  docusaurus: ['javascript', 'typescript'],
  eleventy: [],
  gatsby: ['javascript', 'typescript'],
  hexo: [],
  next: ['javascript', 'typescript'],
  nuxt: [],
  preact: ['default', 'netlify', 'simple', 'typescript'],
  react: ['javascript', 'typescript'],
  redux: ['javascript', 'typescript'],
  redwoods: ['javascript', 'typescript'],
  remix: [
    'arc',
    'arc-ts',
    'cloudflare-pages',
    'cloudflare-pages-ts',
    'cloudflare-workers',
    'cloudflare-workers-ts',
    'deno',
    'deno-ts',
    'express',
    'express-ts',
    'fly',
    'fly-ts',
    'netlify',
    'netlify-ts',
    'remix',
    'remix-ts',
    'vercel',
    'vercel-ts',
  ],
  vite: [
    'vanilla',
    'vanilla-ts',
    'vue',
    'vue-ts',
    'react',
    'react-ts',
    'preact',
    'preact-ts',
    'lit',
    'lit-ts',
    'svelte',
    'svelte-ts',
  ],
}

export default templates

import { blue, cyan, gray, green, red, yellow } from 'kolorist'

import { name } from '../../package.json'

export default {
  blue,
  cyan,
  error: (str: string | number) =>
    console.error(red(`[ERROR] (${name}) ${str}`)),
  gray,
  green,
  info: (str: string | number) => console.info(cyan(`[INFO] (${name}) ${str}`)),
  red,
  success: (str: string | number) =>
    console.log(green(`[SUCCESS] (${name}) ${str}`)),
  text: (str?: string | number) => console.log(gray(str || '')),
  warn: (str: string | number) =>
    console.warn(yellow(`[WARN] (${name}) ${str}`)),
  yellow,
}

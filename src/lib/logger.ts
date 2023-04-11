import { blue, cyan, gray, green, red, yellow } from 'kolorist'

import { name } from '../../package.json'

export default {
  blue,
  cyan,
  error: (str: string | number) =>
    console.error(red(`${gray(name)} [ERROR] ${str}`)),
  gray,
  green,
  info: (str: string | number) =>
    console.info(cyan(`${gray(name)} [INFO] ${str}`)),
  red,
  success: (str: string | number) =>
    console.log(green(`${gray(name)} [SUCCESS] ${str}`)),
  text: (str?: string | number) => console.log(gray(str || '')),
  warn: (str: string | number) =>
    console.warn(yellow(`${gray(name)} [WARN] ${str}`)),
  yellow,
}

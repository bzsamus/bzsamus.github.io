import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const jsFiles = ['js/data.js','js/hooks.js','js/effects.js','js/layout.js','js/sections.js','js/works.js','js/app.js'];
const babelSrc = await readFile('dist/vendor/babel.min.js', 'utf8');
const ctx = { window: {}, self: {}, globalThis: {} };
vm.createContext(ctx);
vm.runInContext(babelSrc, ctx);
const Babel = ctx.Babel || ctx.window.Babel;
let out='';
for (const file of jsFiles) {
  const source = await readFile(file, 'utf8');
  const transformed = Babel.transform(source, { presets: ['react'], comments:false, compact:true }).code;
  out += transformed + '\n';
}
await writeFile('dist/app.bundle.js', out);
const css = await readFile('css/styles.css','utf8');
await writeFile('dist/styles.bundle.css', css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim());

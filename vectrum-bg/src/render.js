#!/usr/bin/env node
// Frame-by-frame renderer: engine.html (Canvas 2D) -> Playwright -> PNG / ffmpeg (H.264, yuv420p, CRF 18).
// Usage:
//   node src/render.js still <variant|all> <frame> [--overlay] [--out dir]
//   node src/render.js video <variant|all>
const http = require('http'), fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const VARIANTS = ['01-fallen-stars', '02-network', '03-europe-routes', '04-aurora', '05-grid-horizon', '06-hybrid'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rsp);
    }).listen(0, () => res(srv));
  });
}

async function openEngine(browser, port, id, overlay) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('pageerror', e));
  await page.goto(`http://127.0.0.1:${port}/src/engine.html`);
  const info = await page.evaluate(([id, overlay]) => window.setup(id, { overlay }), [id, overlay]);
  return { page, info, canvas: await page.$('#c') };
}

async function frame(eng, i) {
  await eng.page.evaluate(i => window.draw(i), i);
  return eng.canvas.screenshot({ type: 'png' });
}

async function main() {
  const [mode, which, arg] = process.argv.slice(2);
  const overlay = process.argv.includes('--overlay');
  const outIdx = process.argv.indexOf('--out');
  const ids = which === 'all' ? VARIANTS : [which];
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch();
  try {
    for (const id of ids) {
      const eng = await openEngine(browser, port, id, overlay);
      if (mode === 'still') {
        const dir = outIdx > 0 ? path.resolve(process.argv[outIdx + 1]) : path.join(ROOT, overlay ? 'previews' : 'stills');
        fs.mkdirSync(dir, { recursive: true });
        const f = Number(arg || 0);
        const out = path.join(dir, `${id}${overlay ? '-preview' : ''}${arg ? '-f' + f : ''}.png`);
        fs.writeFileSync(out, await frame(eng, f));
        console.log('wrote', path.relative(ROOT, out));
      } else if (mode === 'video') {
        const dir = path.join(ROOT, 'renders', id); fs.mkdirSync(dir, { recursive: true });
        const mp4 = path.join(dir, `${id}.mp4`);
        const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
          '-an', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'grain', '-crf', '18', '-pix_fmt', 'yuv420p',
          '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
        const done = new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
        const t0 = Date.now();
        for (let i = 0; i < eng.info.frames; i++) {
          const buf = await frame(eng, i);
          if (i === 0) fs.writeFileSync(path.join(dir, `${id}-frame0.png`), buf);
          if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        }
        // frame 300 (p = 1.0) for the seam check: must equal frame 0
        fs.writeFileSync(path.join(dir, `${id}-frame300.png`), await frame(eng, eng.info.frames));
        ff.stdin.end(); await done;
        console.log('wrote', path.relative(ROOT, mp4), ((Date.now() - t0) / 1000).toFixed(1) + 's');
      }
      await eng.page.close();
    }
  } finally { await browser.close(); srv.close(); }
}
main().catch(e => { console.error(e); process.exit(1); });

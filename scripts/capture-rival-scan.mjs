import { chromium } from 'playwright'
import GIFEncoder from 'gif-encoder-2'
import { createCanvas, loadImage } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dir, '..', 'public')
const W = 1280, H = 720

async function shot(page) {
  return page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })
}

async function makeGif(buffers, outPath, delay = 80) {
  const enc = new GIFEncoder(W, H, 'neuquant', true)
  enc.setDelay(delay)
  enc.setRepeat(0)
  enc.setQuality(12)
  enc.start()
  for (const buf of buffers) {
    const img = await loadImage(buf)
    const canvas = createCanvas(W, H)
    canvas.getContext('2d').drawImage(img, 0, 0, W, H)
    enc.addFrame(canvas.getContext('2d'))
  }
  enc.finish()
  writeFileSync(outPath, enc.out.getData())
  console.log('✓', outPath)
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

async function run() {
  mkdirSync(PUBLIC, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: W, height: H } })
  const page = await ctx.newPage()

  console.log('\n🎬 RivalScan...')
  await page.goto('https://rivals.manarattar.com', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await wait(2500)
  const frames = []

  // Landing — show full dashboard
  for (let i = 0; i < 10; i++) { frames.push(await shot(page)); await wait(150) }

  // Click second competitor in sidebar (first is "All Updates")
  const sidebarItems = page.locator('aside div[class*="cursor"], aside button').filter({ hasNotText: 'Add Competitor' })
  const count = await sidebarItems.count()
  if (count > 1) {
    await sidebarItems.nth(2).click()
    await wait(700)
    for (let i = 0; i < 8; i++) { frames.push(await shot(page)); await wait(200) }
  }

  // Scroll through the updates feed
  for (let s = 0; s < 5; s++) {
    await page.mouse.wheel(0, 180)
    await wait(200)
    frames.push(await shot(page))
  }
  for (let i = 0; i < 6; i++) { frames.push(await shot(page)); await wait(150) }

  // Click back to All Updates
  const allUpdates = page.locator('aside').filter({ hasText: 'All Updates' }).locator('button, [role="button"]').first()
  if (await allUpdates.count()) {
    await allUpdates.click()
    await wait(600)
    for (let i = 0; i < 6; i++) { frames.push(await shot(page)); await wait(150) }
  }

  await makeGif(frames, join(PUBLIC, 'preview-rival-scan.gif'), 90)
  await browser.close()
  console.log('\n✅ RivalScan GIF captured!')
}

run().catch(e => { console.error(e); process.exit(1) })

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

  // ── Debate Engine ──────────────────────────────────────────────────────
  console.log('\n🎬 Debate Engine...')
  await page.goto('https://debate-engine-frontend.onrender.com', { waitUntil: 'networkidle', timeout: 60000 })
  await wait(1500)
  const debateFrames = []

  // Landing
  for (let i = 0; i < 6; i++) { debateFrames.push(await shot(page)); await wait(100) }

  // Type the topic
  const input = page.locator('textarea, input[type="text"]').first()
  await input.click()
  const topic = 'AI will replace software engineers'
  for (const ch of topic) {
    await input.type(ch, { delay: 30 })
    if (debateFrames.length % 4 === 0) debateFrames.push(await shot(page))
  }
  for (let i = 0; i < 4; i++) { debateFrames.push(await shot(page)); await wait(120) }

  // Click Start Debate
  const btn = page.locator('button').filter({ hasText: /start debate/i }).first()
  if (await btn.count()) await btn.click()
  await wait(800)
  for (let i = 0; i < 5; i++) { debateFrames.push(await shot(page)); await wait(200) }

  // Capture streaming for ~5s
  for (let i = 0; i < 20; i++) { debateFrames.push(await shot(page)); await wait(250) }

  await makeGif(debateFrames, join(PUBLIC, 'preview-debate-engine.gif'), 80)

  // ── Multi-Agent Researcher ─────────────────────────────────────────────
  console.log('\n🎬 Researcher...')
  await page.goto('https://researcher-frontend-psho.onrender.com', { waitUntil: 'networkidle', timeout: 60000 })
  await wait(1500)
  const resFrames = []

  for (let i = 0; i < 6; i++) { resFrames.push(await shot(page)); await wait(100) }

  const resInput = page.locator('textarea, input[type="text"]').first()
  await resInput.click()
  const query = 'How does RAG improve LLM accuracy?'
  for (const ch of query) {
    await resInput.type(ch, { delay: 25 })
    if (resFrames.length % 4 === 0) resFrames.push(await shot(page))
  }
  for (let i = 0; i < 4; i++) { resFrames.push(await shot(page)); await wait(120) }

  const resBtn = page.locator('button').filter({ hasText: /research|start|submit/i }).first()
  if (await resBtn.count()) await resBtn.click()
  await wait(800)
  for (let i = 0; i < 25; i++) { resFrames.push(await shot(page)); await wait(250) }

  await makeGif(resFrames, join(PUBLIC, 'preview-researcher.gif'), 80)

  // ── Contract Risk Analyzer ─────────────────────────────────────────────
  console.log('\n🎬 Contract Analyzer...')
  await page.goto('https://contract-analyzer-frontend-1dje.onrender.com/', { waitUntil: 'networkidle', timeout: 60000 })
  await wait(1500)
  const contractFrames = []

  for (let i = 0; i < 8; i++) { contractFrames.push(await shot(page)); await wait(150) }

  // Hover the visible dropzone container (not the hidden file input)
  const dropzone = page.locator('[class*="drop"], [class*="upload"], [class*="border-dashed"], label[for], form').first()
  if (await dropzone.count()) {
    await dropzone.hover({ force: true })
    await wait(400)
    for (let i = 0; i < 6; i++) { contractFrames.push(await shot(page)); await wait(150) }
  } else {
    for (let i = 0; i < 6; i++) { contractFrames.push(await shot(page)); await wait(150) }
  }

  // Scroll down slowly to show the UI
  for (let s = 0; s < 5; s++) {
    await page.mouse.wheel(0, 120)
    await wait(200)
    contractFrames.push(await shot(page))
  }
  for (let i = 0; i < 6; i++) { contractFrames.push(await shot(page)); await wait(150) }

  await makeGif(contractFrames, join(PUBLIC, 'preview-contract-analyzer.gif'), 100)

  // ── SwipeEat ───────────────────────────────────────────────────────────
  console.log('\n🎬 SwipeEat...')
  await page.goto('https://swiper-2xu5.onrender.com/', { waitUntil: 'networkidle', timeout: 60000 })
  await wait(1500)
  const swipeFrames = []

  for (let i = 0; i < 8; i++) { swipeFrames.push(await shot(page)); await wait(150) }

  // Try swiping — look for swipeable cards
  const card = page.locator('[class*="card"], [class*="swipe"], .meal, article').first()
  if (await card.count()) {
    const box = await card.boundingBox()
    if (box) {
      // Simulate swipe right
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      for (let s = 0; s < 8; s++) {
        await page.mouse.move(box.x + box.width / 2 + s * 30, box.y + box.height / 2)
        await wait(50)
        swipeFrames.push(await shot(page))
      }
      await page.mouse.up()
      await wait(400)
      for (let i = 0; i < 6; i++) { swipeFrames.push(await shot(page)); await wait(150) }
    }
  } else {
    // Just scroll and show UI
    for (let s = 0; s < 4; s++) {
      await page.mouse.wheel(0, 100)
      await wait(200)
      swipeFrames.push(await shot(page))
    }
    for (let i = 0; i < 8; i++) { swipeFrames.push(await shot(page)); await wait(150) }
  }

  await makeGif(swipeFrames, join(PUBLIC, 'preview-swipeat.gif'), 90)

  await browser.close()
  console.log('\n✅ All GIFs captured!')
}

run().catch(e => { console.error(e); process.exit(1) })

import puppeteer from "puppeteer";

import getCached from "./getCached.js";

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchRangesForSinglePermission = async (ctx, permission) => {
  if (!ctx.browser) {
    ctx.browser = await puppeteer.launch({headless: false})
    ctx.page = await ctx.browser.newPage();
    await ctx.page.setViewport({width: 1024, height: 800});
  }
  await ctx.page.goto(`https://registry.comcom.ge/Permission.aspx?PermID=${permission.id}`);
  const ranges = await scrapeRanges(ctx.page)
  return ranges
}

const scrapeRanges = async (page) => {
  await page.click('a[href="#technical"]')
  const indices = await page.$$eval('#MainContent_dgvNumTech tr.ui-widget-header th', (ths) => {
    const headers = ths.map(th => th.innerText)
    return {
      area: headers.indexOf('სამოქმედო ზონა'),
      numberCount: headers.indexOf('ნომრების რაოდენობა'),
      range: headers.indexOf('რესურსი'),
      note: headers.indexOf('შენიშვნა'),
    }
  })

  const rows = await page.$$eval(
    '#MainContent_dgvNumTech > tbody > tr:not(:first-child)', 
    (trs) => trs.map(tr => Array.from(tr.children).map(td => td.innerText)),
  )

  return rows.map(row => Object.fromEntries(
    Object.entries(indices).map(
      ([header, index]) => [header, row[index]]
    )
  ))
}

const fetchRangesForPermissions = async (permissions) => {
  const ctx = {browser: null}
  const permissinsRanges = {}
  for (const permission of permissions) {
    permissinsRanges[permission.id] = await getCached(
      `comcom-permission-ranges-${permission.id}`, 
      async () => await fetchRangesForSinglePermission(ctx, permission),
    )
  }
  if (ctx.browser) {
    await ctx.browser.close()
  }
  return permissinsRanges
}

export default fetchRangesForPermissions;
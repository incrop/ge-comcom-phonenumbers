import puppeteer from "puppeteer";

import getCached from "./getCached.js";

const fetchValidPermissions = async () => {
  const browser = await puppeteer.launch(/*{headless: false}*/);
  const page = await browser.newPage();
  
  await page.goto('https://registry.comcom.ge/Permissions.aspx');
  await page.setViewport({width: 1024, height: 800});
  
  await setupFilters(page)

  const permissions = await scrapePermissions(page)
  await browser.close();
  return permissions;
}

const setupFilters = async (page) => {
  // Show id (ნომერი) and subject (ნებ. დანიშნულება) columns
  await page.click('#MainContent_btnColumns')
  await page.click('#MainContent_cbxlstColumns_1')
  await page.click('#MainContent_cbxlstColumns_6')
  await page.click('#MainContent_btnApply')
  await page.waitForResponse('https://registry.comcom.ge/Permissions.aspx');
  await page.waitForSelector('.pleaseWait', {hidden: true});

  // Filter only valid ranges (მოქმედი)
  await page.select('#MainContent_ddlStatus', '1')
  await page.waitForSelector('.pleaseWait', {hidden: true});
  // Filter only phonenumber allocations (ნუმერაცია)
  await page.select('#MainContent_ddlPerCategorySearch', '1')
  await page.waitForResponse('https://registry.comcom.ge/Permissions.aspx');
  await page.waitForSelector('.pleaseWait', {hidden: true});

  // Submit filters
  await page.click('#MainContent_btnFilter')
  await page.waitForResponse('https://registry.comcom.ge/Permissions.aspx');
  await page.waitForSelector('.pleaseWait', {hidden: true});

  // Disable pagination
  await page.click('#MainContent_cbxShowPages')
  await page.waitForResponse('https://registry.comcom.ge/Permissions.aspx');
  await page.waitForSelector('.pleaseWait', {hidden: true});  
}

const scrapePermissions = async (page) => {
  const indices = await page.$$eval('#MainContent_dgvPers tr.ui-widget-header th', (ths) => {
    const headers = ths.map(th => th.innerText)
    return {
      id: headers.indexOf('ნომერი'),
      number: headers.indexOf('ნებ. №'),
      purpose: headers.indexOf('ნებ. დანიშნულება'),
      subject: headers.indexOf('ნებ. საგანი'),
      issuedAt: headers.indexOf('გაცემის თარიღი'),
      validUntil: headers.indexOf('მოქმედების ვადა'),
      decisionNumber: headers.indexOf('გადაწყვ. №'),
      status: headers.indexOf('სტატუსი'),
      operator: headers.indexOf('მფლობელი'),
    }
  })

  const rows = await page.$$eval(
    '#MainContent_dgvPers > tbody > tr:not(:first-child)', 
    (trs) => trs.map(tr => Array.from(tr.children).map(td => td.innerText)),
  )

  return rows.map(row => Object.fromEntries(
    Object.entries(indices).map(
      ([header, index]) => [header, row[index]]
    )
  ))
}

const fetchValidPermissionsCached = async () => {
  return await getCached('comcom-valid-permissions', fetchValidPermissions)
}

export default fetchValidPermissionsCached;
import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

export async function rankTracker(keyword, targetDomain) {
  let browser;
  try {
    const session = await bb.sessions.create({
      browserSettings: { blockAds: true },
    });
    console.log(`STEP 1: Browserbase session created (ID: ${session.id})`);
    
    browser = await chromium.connectOverCDP(session.connectUrl);
    console.log(`STEP 2: Playwright connected`);
    
    const page = browser.contexts()[0].pages()[0];
    page.setDefaultNavigationTimeout(45000);

    await page.goto("https://www.google.com", { waitUntil: "domcontentloaded" });
    try {
      const btn = await page.$('button[id="L2AGLb"],form[action*="consent"]button');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    } catch {}

    let found = null;
    let allResults = [];
    const cleanTarget = targetDomain.replace("www.", "").toLowerCase();
    console.log(`STEP 7: Target domain = ${cleanTarget}`);

    for (let gPage = 0; gPage < 5; gPage++) {
      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${gPage * 10}&num=10&hl=en&gl=us`,
        { waitUntil: "domcontentloaded" },
      );

      let pageResults = [];
      for (let retry = 0; retry < 3; retry++) {
        try {
          const currentUrl = page.url();
          console.log(`STEP 3: Google URL = ${currentUrl}`);

          if (currentUrl.includes('/sorry/index')) {
             console.log(`STEP 4: Google page type = sorry page`);
             if (retry === 2) {
                throw new Error("Blocked by Google (sorry page)");
             }
             await page.waitForTimeout(3000 + retry * 2000);
             await page.reload({ waitUntil: "domcontentloaded" });
             continue;
          } else {
             console.log(`STEP 4: Google page type = normal results`);
          }

          await page.waitForSelector("h3", { timeout: 8000, state: "attached" });
          await page.waitForTimeout(1500);
          
          const h3Count = await page.evaluate(() => document.querySelectorAll("h3").length);
          console.log(`STEP 5: H3 count = ${h3Count}`);

          // Debug extraction to see why it fails
          const debugData = await page.evaluate(() => {
              return Array.from(document.querySelectorAll("h3")).map(h3 => {
                  let a = h3.closest('a');
                  if (!a) {
                      let p=h3.parentElement;
                      for(let j=0;j<5 && p;j++,p=p.parentElement){
                        if (p.tagName==="A") { a=p; break; }
                        const sub=p.querySelector("a[href]");
                        if(sub && sub.contains(h3)){ a=sub; break; }
                      }
                  }
                  return {
                      h3Text: h3.innerText,
                      aFound: !!a,
                      aHref: a ? a.href : null
                  };
              });
          });
          console.log(`[DEBUG] Extracted h3 data before filtering:`, JSON.stringify(debugData, null, 2));

          pageResults = await page.evaluate(
            () => Array.from(document.querySelectorAll("h3")).map((h3)=>{
              let a=h3.closest('a');
              if(!a){
                let p=h3.parentElement;
                for(let j=0;j<5 && p;j++,p=p.parentElement){
                  if (p.tagName==="A") {
                    a=p;
                    break;
                  }
                  const sub=p.querySelector("a[href]");
                  if(sub && sub.contains(h3)){
                    a=sub;
                    break;
                  }
                }
              }
              if(!a || !a.href.startsWith("http")) return null;
              
              let domain = "";
              try {
                domain = new URL(a.href).hostname.replace("www.","");
              } catch(e) { return null; }
              
              // Handle Google /goto?url= or /url?q= redirects
              if (domain.includes('google.')) {
                 let container = a.parentElement || a;
                 while(container && container.tagName !== 'DIV') {
                    if(!container.parentElement) break;
                    container = container.parentElement;
                 }
                 
                 let cite = container.querySelector('cite');
                 let textSource = cite ? cite.innerText : container.innerText;
                 
                 if (textSource) {
                     let firstPart = textSource.split('\\n')[0].split('›')[0].trim().split(' ')[0].trim();
                     if (firstPart) {
                         if (firstPart.startsWith('http')) {
                             try { domain = new URL(firstPart).hostname.replace("www.",""); } catch(e){}
                         } else {
                             domain = firstPart.replace("www.","");
                         }
                     }
                 }
                 
                 // If we STILL couldn't find a non-google domain, return null like the original logic did
                 if (domain.includes('google.')) return null;
              }
              
              let s="", c=a.parentElement;
              for(let j=0;j<6 && j++;c=c.parentElement){
                 const txt = c.innerText || "";
                if(txt.length>h3.innerText.length + 50){
                  s=(txt.split("\\n").find((l)=>l.length > 30 && !l.includes(h3.innerText.substring(0,20))) || "").trim().substring(0,300);
                  if(s)break;
                }
              }
              return {
                 url:a.href,
                 domain:domain,
                 title:h3.innerText.trim(),
                 snippet:s
              }
            }).filter(Boolean)
          );
          
          console.log(`STEP 6: Google results extracted = ${pageResults.length} items`);
          // console.log("Extracted items:", pageResults);
          
          if(pageResults.length > 0) break;
          
          await page.reload({waitUntil:"domcontentloaded"});
        } catch (err) {
          console.log(`Wait for h3 or extraction failed: ${err.message}`);
          if(retry===2) {
             if (err.message.includes("Blocked by Google")) throw err;
             break;
          }
          await page.reload({waitUntil:"domcontentloaded"});
        }
      }
      
      if(!pageResults.length) break;

      for(const r of pageResults){
        r.position = allResults.length + 1;
        allResults.push(r);
        if(!found && (r.domain.toLowerCase().includes(cleanTarget) || cleanTarget.includes(r.domain.toLowerCase()))){
          found = {...r, page:gPage+1};
          console.log(`STEP 8: Target domain found at position = ${r.position}`);
        }
      }
      if(found) break;
      await page.waitForTimeout(2000+ Math.random()*2000);
    }

    await browser.close();
    const competitors = allResults.filter((r)=>!r.domain.toLowerCase().includes(cleanTarget) && !cleanTarget.includes(r.domain.toLowerCase())).slice(0,10);
    return {
      success: true,
      data: {
        keyword,
        targetDomain,
        position: found ?.position || null,
        page: found ?.page || null,
        title: found ?.title || "",
        snippet: found ?.snippet || "",
        competitors,
        totalResultsScanned: allResults.length,
      }
    }
  } catch (error) {
    if (browser) await browser.close().catch(()=>{});
    return { success: false, message: error.message };
  }
}
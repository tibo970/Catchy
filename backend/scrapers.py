import asyncio
from playwright.async_api import async_playwright
from typing import List, Dict

async def scrape_fnac(query: str) -> List[Dict]:
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Navigate to Fnac search
        url = f"https://www.fnac.com/SearchResult/ResultList.aspx?Search={query.replace(' ', '+')}"
        await page.goto(url)
        
        # Wait for search results
        try:
            await page.wait_for_selector(".Article-item", timeout=10000)
        except:
            await browser.close()
            return []

        # Extract product info
        articles = await page.query_selector_all(".Article-item")
        for article in articles[:5]:  # Limit to top 5 for speed
            try:
                name_el = await article.query_one(".Article-title")
                name = await name_el.inner_text() if name_el else "Unknown"
                
                price_el = await article.query_one(".userPrice")
                price_text = await price_el.inner_text() if price_el else "0"
                # Clean price: "299,99 €" -> 299.99
                price = float(price_text.replace("€", "").replace(",", ".").strip())
                
                link_el = await article.query_one(".Article-title a")
                link = await link_el.get_attribute("href") if link_el else "#"
                if link and not link.startswith("http"):
                    link = f"https://www.fnac.com{link}"

                results.append({
                    "retailer": "Fnac",
                    "name": name.strip(),
                    "price": price,
                    "currency": "EUR",
                    "url": link,
                    "prediction": "stable"  # Placeholder
                })
            except Exception as e:
                print(f"Error parsing Fnac article: {e}")
                continue

        await browser.close()
    return results

async def aggregate_results(query: str) -> List[Dict]:
    # Future: Run multiple scrapers in parallel
    fnac_results = await scrape_fnac(query)
    # Add Amazon, etc. later
    return fnac_results

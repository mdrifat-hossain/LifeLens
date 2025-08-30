from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

class Unimart:
    base_url = "https://unimart.online/search?q="

    async def fetch(self, search_term):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            # Block images, fonts, etc.
            async def handle_route(route):
                if route.request.resource_type in ["image", "stylesheet", "font", "media"]:
                    await route.abort()
                else:
                    await route.continue_()

            await page.route("**/*", handle_route)

            url = self.base_url + search_term.replace(" ", "+")
            await page.goto(url, timeout=60000)

            # Wait for products
            await page.wait_for_selector(".product-box-2")

            # Get rendered HTML
            html = await page.content()
            soup = BeautifulSoup(html, "html.parser")

            results = []
            products = soup.select(".product-box-2")
            for product in products:
                # Product name
                name_tag = product.select_one("h2.product-title a")
                name = name_tag.get_text(strip=True) if name_tag else None

                # Product link
                link = name_tag["href"] if name_tag and name_tag.has_attr("href") else None

                # Price
                price_tag = product.select_one(".product-price")
                price = price_tag.get_text(strip=True) if price_tag else None

                if price:
                    price = price.replace("TK", "").replace(" ", "")

                # Image link (check data-src first)
                img_tag = product.select_one("img")
                img_link = None
                if img_tag:
                    img_link = img_tag.get("data-src") or img_tag.get("src")

                results.append({
                    "name": name,
                    "original_price": price,
                    "link": link,
                    "image_link": img_link,
                    "shop": "Unimart"
                })

            await browser.close()
            return results

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import time

class MeenaBazar:
    base_url = "https://meenabazaronline.com/search/"

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

            url = self.base_url + search_term
            await page.goto(url, timeout=60000)

            # Wait for the location modal input
            location_input = await page.wait_for_selector("input.ant-select-selection-search-input")

            # Type "Dhaka" into the input
            await location_input.fill("Dhaka")

            # Continuously press Enter until the modal disappears
            while True:
                try:
                    await location_input.press("Enter")

                    # Check if the modal is gone
                    modal = await page.query_selector(".ant-modal-body")
                    if not modal:
                        break  # Modal disappeared, exit loop

                    time.sleep(0.1)  # small pause
                except Exception as e:
                    print("⚠️ Error pressing Enter:", e)
                    break

            # Wait for products
            await page.wait_for_selector(".product-thumb")

            # Extract HTML
            html = await page.content()
            soup = BeautifulSoup(html, "html.parser")

            results = []
            products = soup.select(".product-thumb")
            for product in products:
                # Product name
                name_tag = product.select_one(".content a.block.h-10")
                name = name_tag.get_text(strip=True) if name_tag else None

                # Product link
                link = name_tag["href"] if name_tag and name_tag.has_attr("href") else None

                # Image link
                img_tag = product.select_one("img")
                img_link = img_tag["src"] if img_tag else None

                # Prices
                original_price = None
                discount_price = None
                price_container = product.select_one(".price")
                if price_container:
                    line_through = price_container.select_one(".line-through")
                    if line_through:
                        original_price = line_through.get_text(strip=True)
                    # last <span> in .price is usually discount price
                    spans = price_container.select("span")
                    if spans:
                        discount_price = spans[-1].get_text(strip=True)

                if original_price:
                    original_price = original_price.replace("TK", "").replace(" ", "")
                    original_price = original_price.split('.')[0]

                if discount_price:
                    discount_price = discount_price.replace("TK", "").replace(" ", "")
                    discount_price = discount_price.split('.')[0]

                    
                if not original_price:
                    original_price = discount_price
                    discount_price = None

                results.append({
                    "name": name,
                    "discounted_price": discount_price,
                    "original_price": original_price,
                    "link": "https://meenabazaronline.com"+link if link else None,
                    "image_link": img_link,
                    "shop": "Meena Bazar"
                })

            await browser.close()
            return results

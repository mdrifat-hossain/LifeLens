from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

class Chaldal:
    base_url = "https://chaldal.com/search/"

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

            # Wait until products are visible
            await page.wait_for_selector(".product")

            # Get full HTML after products load
            html = await page.content()
            soup = BeautifulSoup(html, "html.parser")

            products = []
            for product in soup.select(".product"):
                # Product name
                name = product.select_one(".name").get_text(strip=True) if product.select_one(".name") else None

                weight = product.select_one(".subText").get_text(strip=True) if product.select_one(".subText") else None

                # Discounted price
                discounted_price = (
                    product.select_one(".discountedPrice span:nth-of-type(2)").get_text(strip=True)
                    if product.select_one(".discountedPrice") else None
                )

                # Original price
                original_price = (
                    product.select_one(".price span:nth-of-type(2)").get_text(strip=True)
                    if product.select_one(".price") else None
                )

                # Product link
                link = product.select_one("a.btnShowDetails")["href"] if product.select_one("a.btnShowDetails") else None

                # Image link
                img_tag = product.select_one("img")
                img_link = img_tag["src"] if img_tag else None
                shop = "Chaldal"

                if original_price:
                    original_price = original_price.replace(",", "").replace(" ", "")
                    original_price = original_price.split('.')[0]

                if discounted_price:
                    discounted_price = discounted_price.replace(",", "").replace(" ", "")
                    discounted_price = discounted_price.split('.')[0]

                products.append({
                    "name": name + " - " + weight if weight else None,
                    "discounted_price": discounted_price,
                    "original_price": original_price,
                    "link": "https://chaldal.com"+link if link else None,
                    "image_link": img_link,
                    "shop": "Chaldal"
                })

            products = products[:20]

            await browser.close()
            return products

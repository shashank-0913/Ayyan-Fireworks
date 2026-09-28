async function scrapeAyyanShop() {
  const allProducts = [];
  let page = 1;
  while (page <= 20) {
    const url = page === 1 ? 'https://ayyansworld.com/shop/' : `https://ayyansworld.com/shop/page/${page}/`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.status === 404) {
        console.log(`Page ${page} returned 404, stopping pagination.`);
        break;
      }
      const html = await res.text();
      
      // Parse WooCommerce product items
      // Look for product titles and image URLs
      // E.g. <li class="product ..."> ... <h2 class="woocommerce-loop-product__title">...</h2> ... <img src="..." srcset="...">
      const productRegex = /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      let countOnPage = 0;
      while ((match = productRegex.exec(html)) !== null) {
        const itemHtml = match[1];
        
        // Extract title
        const titleMatch = itemHtml.match(/<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([^<]+)<\/h2>/i)
          || itemHtml.match(/<h2[^>]*>([^<]+)<\/h2>/i)
          || itemHtml.match(/alt="([^"]+)"/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract full size image URL
        // From data-src, src, or srcset (choose largest)
        let imgUrl = '';
        const imgMatch = itemHtml.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) {
          imgUrl = imgMatch[1];
          // Remove WordPress image dimensions suffix like -300x300.png, -100x100.png, -600x600.png
          imgUrl = imgUrl.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
        }

        if (title && imgUrl) {
          allProducts.push({ title, imgUrl, page });
          countOnPage++;
        }
      }

      console.log(`Page ${page}: found ${countOnPage} products. Total collected: ${allProducts.length}`);
      if (countOnPage === 0) break;
      page++;
    } catch (e) {
      console.error(`Error on page ${page}:`, e);
      break;
    }
  }

  console.log('Scraped total official Ayyan products:', allProducts.length);
  console.log('Sample 10 items:', JSON.stringify(allProducts.slice(0, 10), null, 2));
}

scrapeAyyanShop();

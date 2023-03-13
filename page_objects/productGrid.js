class ProductGrid {

    constructor(page) {
        
        this.page = page
        this.thumbnailsGrid = page.locator('[class="thumbnails grid row list-inline"]')
        this.productCell = page.locator('[class="col-md-3 col-sm-6 col-xs-12"]')
        this.productName = page.locator('[class="prdocutname"]')
        this.addToCartBtn = page.locator('[class="fa fa-cart-plus fa-fw"]')
    }

    async clickAddToCart(i) {
        await this.addToCartBtn.nth(i).click()
    }
}

module.exports = {ProductGrid}
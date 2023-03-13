class ProductPage {

    constructor(page) {
        this.page = page
        this.addToCartBtn = page.locator('.productpagecart')
        this.alertMsg = page.locator('[class="alert alert-error alert-danger"]')
        this.productOptions = page.locator('#product')
        this.size = page.locator('[type="radio"]')
    }
        
    async clickAddToCartBtn() {
        await this.addToCartBtn.click()
    }

    async chooseSize(i) {
        const productOptions = await this.productOptions
        await productOptions.locator(this.size._selector).nth(i).click()
    }
}

module.exports = {ProductPage}
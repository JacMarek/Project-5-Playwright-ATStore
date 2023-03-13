const config = require('../playwright.config')
const {POManager} = require('./POManager')

class HomePage {
    
    constructor(page) {
        this.page = page

        this.poManager = new POManager(page)
        this.onMainBar = this.poManager.getMainBarClass()
        this.onProductPage = this.poManager.getProductPageClass()

        this.addToCartBtn = page.locator('.fa-cart-plus')
    }

    async addItemToCart(i) {
        await this.addToCartBtn.nth(i).click()
        await this.addItemFromProductPage()
    }

    async addItemFromProductPage() {
        const url = await this.page.url()
        const context = await this.page.context()
        if(url !== config.use.baseURL) {
            await this.onProductPage.clickAddToCartBtn()
            await this.onMainBar.clickMainLogoBtn()
        }
    }
}

module.exports = {HomePage}
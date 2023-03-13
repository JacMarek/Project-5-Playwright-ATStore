const {expect} = require('@playwright/test')

class POManager {
    
    constructor(page) {
        this.page = page
    }

    async openHomePage() {
        await this.page.goto('/')
        await expect(this.page).toHaveURL('/')
    }

    getHomePageClass() {
        const {HomePage} = require('./homePage')
        return new HomePage(this.page)
    }

    getMainBarClass() {
        const {MainBar} = require('./mainBar')
        return new MainBar(this.page)
    }

    getProductGridClass() {
        const {ProductGrid} = require('./productGrid')
        return new ProductGrid(this.page)
    }

    getProductPageClass() {
        const {ProductPage} = require('./productPage')
        return new ProductPage(this.page)
    }

    getCartPageClass() {
        const {CartPage} = require('./cartPage')
        return new CartPage(this.page)
    }

    getShoppingClass() {
        const {Shopping} = require('./shopping')
        return new Shopping(this.page)
    }
}

module.exports = {POManager}
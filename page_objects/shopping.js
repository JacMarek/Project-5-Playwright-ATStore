const {test, expect} = require('@playwright/test')

const {POManager} = require('./POManager')

class Shopping {

    constructor(page) {
        this.page = page

        this.poManager = new POManager(page)
        this.onMainBar = this.poManager.getMainBarClass()
        this.onProductGrid = this.poManager.getProductGridClass()
        this.onProductPage = this.poManager.getProductPageClass()

        this.tshirtThumbnail = page.locator('.thumbnail > a > [alt="blue cotton t-shirt"]')
    } 
    

    async goToTshirtsPage() {
        const subcategoriesMenu = await this.onMainBar.showApparealAndAccessoriesMenu()
        await subcategoriesMenu.getByRole('link', {name: 'T-shirts'}).click()
    }

    async goToShoesPage() {
        const subcategoriesMenu = await this.onMainBar.showApparealAndAccessoriesMenu()
        await subcategoriesMenu.getByText('Shoes').click()
    }

    async findParfume(parfumeName) {
        await this.onMainBar.searchbar.type(parfumeName)
        await this.onMainBar.searchbar.press('Enter')
    }
    
    async getTshirt() {
        return await this.onProductGrid.productCell.filter({ has: this.tshirtThumbnail })
    }

    async getSandals() {
        return await this.onProductGrid.productCell.filter({ hasText: 'Sandals' }).first()
    }

    async getParfume(i) {
        return await this.onProductGrid.productCell.filter({ has: this.onProductGrid.addToCartBtn }).nth(i) 
    }

    async getTshirtName() {
        const tShirt = await this.getTshirt()
        const tShirtName = await tShirt.locator(this.onProductGrid.productName._selector).textContent()
        return tShirtName
    }

    async getSandalsName() {
        const Sandals = await this.getSandals()
        const SandalsName = await Sandals.locator(this.onProductGrid.productName._selector).textContent()
        return SandalsName
    }

    async getParfumeName(i) {
        const Parfume = await this.getParfume(i)
        const ParfumeName = await Parfume.locator(this.onProductGrid.productName._selector).textContent()
        return ParfumeName
    }

    async addTshirtToCart() {           
        const tShirt = await this.getTshirt()
        await tShirt.locator(this.onProductGrid.addToCartBtn._selector).click()
        await this.onProductPage.clickAddToCartBtn()
    }

    async addSandalsToCart() {
        const sandals = await this.getSandals()
        await sandals.locator(this.onProductGrid.productName._selector).click()
        await this.onProductPage.clickAddToCartBtn()
        await expect(this.onProductPage.alertMsg).toBeVisible()
        await expect(this.onProductPage.alertMsg).toContainText('Please select all required options!')
        await this.onProductPage.chooseSize(0)
        await this.onProductPage.clickAddToCartBtn()
    }

    async addParfumeToCart(i) {
        await this.onProductGrid.clickAddToCart(i)
    }
}

module.exports = {Shopping}
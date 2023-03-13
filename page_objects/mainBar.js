const {expect} = require('@playwright/test')

class MainBar {

    constructor(page) {
        
        this.page = page
        
        this.mainLogoBtn = page.locator('[title="Automation Test Store"][alt="Automation Test Store"]')
        this.checkCartBtn = page.locator('#topnav [data-id="menu_cart"]')
        this.searchbar = page.getByPlaceholder('Search Keywords')      
        this.categoryMenu = page.locator('#categorymenu')
        this.subcategoriesMenu = page.locator('.subcategories')
        
        this.apparelAndAccessoriesMenu = this.categoryMenu.locator('li:has-text("Apparel & accessories")')
        this.apparelAndAccessoriesSubcategoriesMenu = this.apparelAndAccessoriesMenu.locator('.subcategories')
    }
    
    async clickMainLogoBtn() {
        await this.mainLogoBtn.click()
    }

    async goToCart() {
        await this.checkCartBtn.click()
    }

    async showApparealAndAccessoriesMenu() {
        await this.apparelAndAccessoriesMenu.hover()
        await expect(this.apparelAndAccessoriesSubcategoriesMenu).toBeVisible()
        return this.apparelAndAccessoriesSubcategoriesMenu
    }
}

module.exports = {MainBar}
const {expect} = require('@playwright/test')

class CartPage {

    constructor(page) {
        this.page = page
    
        this.cartTotal = page.locator('[class="dropdown hover"] .cart_total')
        this.productList = page.locator('[class="container-fluid cart-info product-list"]')
        this.productRow = this.productList.locator('tr:has(td)')
        this.quantity = page.locator('td > div > input')
        this.updateBtn = page.locator('#cart_update')

        this.countryDropdown = page.locator('#estimate_country')
        this.countryOption = this.countryDropdown.locator('option')
        this.stateDropdown = page.locator('#estimate_country_zones')
        this.stateOption = this.stateDropdown.locator('option:not([value="FALSE"])')
        this.zip = page.locator('#estimate_postcode')
        this.estimate = page.locator('.input-group.col-sm-8 > .input-group-btn > .btn.btn-default')
        this.shipments = page.locator('#shippings')
    }

    async getCartTotal() {
        const priceString = await this.cartTotal.textContent()
        const priceNumeric = parseFloat(priceString.replace('$', ''))
        return priceNumeric
    }
        
    async getItemRow(i) {
        return await this.productRow.nth(i)
    }
    
    async getItemUnitPrice(i) {
        const itemRow = await this.getItemRow(i)
        const priceString = await itemRow.locator('td').nth(3).textContent()
        const priceNumeric = parseFloat(priceString.replace('$', ''))
        return priceNumeric
    }
    
    async getItemQuantity(i) {
        const itemRow = await this.getItemRow(i)
        const quantityString = await itemRow.locator(this.quantity._selector).getAttribute('value')
        const quantityNumeric = parseFloat(quantityString)
        return quantityNumeric
    }

    async getItemTotal(i) {
        const itemRow = await this.getItemRow(i)
        const totalString = await itemRow.locator('td').nth(5).textContent()
        const totalNumeric = parseFloat(totalString.replace('$', ''))
        return totalNumeric
    }

    async typeNewQuantity(i, value) {
        const itemRow = await this.getItemRow(i)
        await itemRow.locator(this.quantity._selector).fill(value.toString())
        await this.clickUpdate()
        await this.checkTotalForItem(i)
        await this.checkTotalForCart()
    }

    async clickUpdate() {
        await this.updateBtn.click()
    }
    
    async calculateTotalForItem(unitPrice, quantity) {
        return unitPrice*quantity
    }

    async calculateTotalForCart() {

        const numberOfProductsInCart = await this.productRow.count()
        let calculatedTotalForCart = 0
        
        for(let i=0; i<numberOfProductsInCart; i++) {
            const itemTotal = await this.getItemTotal(i)
            calculatedTotalForCart += itemTotal
        }

        return calculatedTotalForCart
    }

    async checkTotalForItem(i) {
        const itemUnitPrice = await this.getItemUnitPrice(i)
        const itemQuantity = await this.getItemQuantity(i)
        const visibleValue = await this.getItemTotal(i)
        const calculatedValue = await this.calculateTotalForItem(itemUnitPrice, itemQuantity) 
        expect(visibleValue).toEqual(calculatedValue)
        console.log(visibleValue, calculatedValue)
    }

    async checkTotalForCart() {
        const visibleValue = await this.getCartTotal()
        const calculatedValue = await this.calculateTotalForCart()           
        expect(visibleValue).toEqual(calculatedValue)
        console.log(visibleValue, calculatedValue)
    }

    async chooseCountry(country) {
        await this.countryDropdown.selectOption(country)
        await expect(this.countryOption.filter({ hasText: country })).toHaveJSProperty('selected', true)
    }

    async chooseState(state) {
        await this.stateDropdown.selectOption(state)
        expect(await this.stateDropdown).toContainText(state)
    }
    
    async typeZipCode(zipCode) {
        await this.zip.type(zipCode)
        expect(await this.zip).toHaveValue(zipCode)
    }
    
    async clickEstimate() {
        await this.estimate.click()
    }

    async checkCountryAndState(country, states) {
        await this.chooseCountry(country)
        for(const state of states) {
            await expect(this.stateDropdown).toContainText(state)
        }
    }

    async checkStateListLength(country, length) {
        await this.chooseCountry(country)
        expect(await this.stateOption.count()).toBe(length) 
    }

    async checkShippingRate(country, state, zipCode, rate) {
        await this.chooseCountry(country)
        await this.chooseState(state)
        await this.typeZipCode(zipCode)
        await this.clickEstimate()
        await expect(this.shipments).toContainText(rate)
    }
}

module.exports = {CartPage}
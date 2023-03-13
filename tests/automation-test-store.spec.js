const {test, expect} = require('@playwright/test')
const {POManager} = require('../page_objects/POManager')

test.describe("Automation test store", () => {
    
    test.beforeEach(async({context, page}) => {
        
        context.poManager = new POManager(page)
        context.onHomePage = context.poManager.getHomePageClass()
        context.onMainBar = context.poManager.getMainBarClass()
        context.onCartPage = context.poManager.getCartPageClass()
        context.onShopping = context.poManager.getShoppingClass()
        await context.poManager.openHomePage()
    })

    test("Add t-shirt, shoes and parfume to the cart", async({context, page}) => {
        
        const {onMainBar, onCartPage, onShopping} = context

        let productsToBuy = []
        
        await onShopping.goToTshirtsPage()
        productsToBuy.push(await onShopping.getTshirtName())
        await onShopping.addTshirtToCart()
        await onMainBar.clickMainLogoBtn()

        await onShopping.goToShoesPage()
        productsToBuy.push(await onShopping.getSandalsName())
        await onShopping.addSandalsToCart()
        await onMainBar.clickMainLogoBtn()

        await onShopping.findParfume('Armani')
        productsToBuy.push(await onShopping.getParfumeName(2))
        await onShopping.addParfumeToCart(2)
        await onMainBar.goToCart()
                
        for(const item of productsToBuy) {
            await expect(onCartPage.productList).toContainText(item)
        } 
    })

    test("Check shipping form", async({context, page}) => {

        const {onHomePage, onMainBar, onCartPage} = context

        await onHomePage.addItemToCart(1)
        await onHomePage.addItemToCart(7)
        await onMainBar.goToCart()

        await onCartPage.checkCountryAndState('United Kingdom', ['London', 'Glasgow'])
        await onCartPage.checkCountryAndState('Poland', ['Mazowieckie', 'Mazurskie'])
        await onCartPage.checkStateListLength('Poland', 16)
        await onCartPage.checkShippingRate('Germany', 'Berlin', '12-345', '2.00')
    })

    test("Check total for item", async({context, page}) => {

        const {onHomePage, onMainBar, onCartPage} = context

        await onHomePage.addItemToCart(1)
        await onHomePage.addItemToCart(2)
        await onHomePage.addItemToCart(3)
        await onMainBar.goToCart()

        await onCartPage.checkTotalForItem(0)
        await onCartPage.checkTotalForCart()
        await onCartPage.typeNewQuantity(1, 7)
    })
})
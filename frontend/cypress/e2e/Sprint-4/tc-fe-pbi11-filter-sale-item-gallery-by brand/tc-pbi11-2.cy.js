describe(`TC-FE-PBI11-FILTER-SALE-ITEM-GALLERY-BY-BRAND-2\n 
    Test Scenario : normal - filter and sort`, () => {

    let resource = '/sale-items'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('The sale item table has sale items.',()=>{
        cy.get('.itbms-row').should('have.length.greaterThan',0)
    })

    it('Each sale item contains brand, model, ramGb, storageGb, and price.',()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-price')
    })

    it(`First sale item at ${resource}/1 should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')
    })

    it(`The 10th sale item at ${resource}/10 should be "Apple,iPhone 12 mini/4/64GB/16,500".`,()=>{
        cy.get('.itbms-row').eq(9).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 12 mini')
        cy.get('@row').contains('.itbms-ramGb','4')
        cy.get('@row').contains('.itbms-storageGb','64')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','16,500')
    })

    it(`should have a "Filter by brand(s)" button.\n
        should show a brand list in alphabetical order (20 brands)\n
        should show "Asus" brand in "Filter by brand(s)" with a clear(x) button.\n
        should show a a list of "ASUS" phones`,()=>{
        cy.get('.itbms-brand-filter-button').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)
        
        cy.get('.itbms-filter-item').as('brand-options')
        cy.get('@brand-options').should('have.length', 20)
        cy.get('@brand-options').eq(0).contains('Apple')
        cy.get('@brand-options').eq(1).contains('ASUS')
        cy.get('@brand-options').eq(2).contains('BlackBerry')
        cy.get('@brand-options').eq(3).contains('Google')
        cy.get('@brand-options').eq(4).contains('Honor')
        cy.get('@brand-options').eq(5).contains('HTC')
        cy.get('@brand-options').eq(6).contains('Huawei')
        cy.get('@brand-options').eq(7).contains('Lenovo')
        cy.get('@brand-options').eq(8).contains('LG')
        cy.get('@brand-options').eq(9).contains('Motorola')            
        cy.get('@brand-options').eq(10).contains('Nokia')  
        cy.get('@brand-options').eq(11).contains('Nothing')
        cy.get('@brand-options').eq(12).contains('OnePlus')
        cy.get('@brand-options').eq(13).contains('OPPO')
        cy.get('@brand-options').eq(14).contains('Realme')
        cy.get('@brand-options').eq(15).contains('Samsung')
        cy.get('@brand-options').eq(16).contains('Sony')
        cy.get('@brand-options').eq(17).contains('Vivo')
        cy.get('@brand-options').eq(18).contains('Xiaomi')
        cy.get('@brand-options').eq(19).contains('ZTE')

        cy.get('@brand-options').eq(1).contains('ASUS').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('asus')
            )
            expect(matched).to.have.length(10)
        })
        cy.wait(100)
    })

    it(`[Step 1] should show "ASUS","Samsung" and "LG" in "Filter by brand(s)".\n
        should show a a list of "ASUS" and "Samsung" phones with "Samsung" phones shown first.\n
        should sort sale items by brand in ascending order.\n
        should show 10 ASUS phones following by 1 LG phone and 10 Samsung phones.\n
        [Step 2] should show "ASUS","Samsung", "LG" and "OPPO" in "Filter by brand(s)".\n
        should show 10 ASUS phones following by 1 LG phone,  10 OPPO phones and then 10 Samsung phones.\n`,()=>{
        cy.get('.itbms-brand-filter-button').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'ASUS').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Samsung').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'LG').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'OPPO').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-asc').should('exist').as('brand-asc')
        cy.get('@brand-asc').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('asus')
            )
            expect(matched).to.have.length(10)
        })
        cy.wait(100)

        cy.get('[class^="itbms-page-"]').then(($pages)=>{
            expect($pages).to.have.length.greaterThan(0)
            cy.get('.itbms-page-3').should('exist').click()
        })
    })

})
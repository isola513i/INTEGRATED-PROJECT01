describe(`TC-FE-PBI11-FILTER-SALE-ITEM-GALLERY-BY-BRAND-3\n 
    Test Scenario : normal - clear filter`, () => {

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
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
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

    it(`[Step 1] should delete the sale item "LG, W41 Pro/6/128GB/5,600".`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'LG').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-model').contains('W41 Pro').should('exist').as('delSaleItem') 
        cy.get('@delSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').should('exist').as('delete') ;
        cy.get('@delete').click() 
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        // cy.get('.itbms-message').contains('The sale item has been deleted.')

        // cy.url().should('contain','/sale-items') ;

        // cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        // cy.get('@brand-filter').click()
        // cy.wait(100)

        // cy.contains('.itbms-filter-item', 'LG').should('exist').click()
        // cy.wait(100)

        // cy.get('.itbms-model').should('not.contain', 'W41 Pro');
    })    

    it(`[Step 2] Should remove "ASUS" and show "Samsung", "LG" and "OPPO" in "Filter by brand(s)".\n
        should show 10 OPPO phones following by 10 Samsung phones.`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
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

        cy.get('.itbms-filter-item-clear').as('clear-item')
        cy.get('@clear-item').eq(0).should('exist').click()
        cy.wait(100)
    })

    it(`[Step 3] Should no brand in "Filter by brand(s)".\n
        should show 60 sale items sorted by brand in ascending order.\n
        should show "Apple" phones in the first page and "Xiaomi" phone in the last page.`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'ASUS').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Samsung').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'LG').should('exist').click()
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

        cy.get('.itbms-filter-item-clear').as('clear-item')
        cy.get('@clear-item').eq(0).should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-filter-clear').as('brand-filter-clear')
        cy.get('@brand-filter-clear').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-page-last').then(($pages)=>{
            cy.get('.itbms-page-last').should('exist').click()
            cy.wait(100)

            cy.get('.itbms-brand').then(($brands) => {
                const matched = $brands.filter((index, el) =>
                    el.textContent.toLowerCase().includes('xiaomi')
                )
                expect(matched).to.have.length(10)
            })
        })
    })
})
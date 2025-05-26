describe(`TC-FE-PBI11-FILTER-SALE-ITEM-GALLERY-BY-BRAND-4\n 
    Test Scenario : normal - filter setting peristence`, () => {

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

    it(`[Step 1 and 2] should have a "Filter by brand(s)" button.\n
        should show a brand list in alphabetical order (20 brands)\n
        should show "Huawei" and "Xiaomi" brand in "Filter by brand(s)" with a clear(x) button.\n
        should show a a list of "Huawei" and "Xiaomi" phones.\n
        should refresh sale item gallery page.\n
        should show "Huawei" and "Xiaomi" brand in "Filter by brand(s)".\n
        should show a list of "Huawei" and "Xiaomi" phones.`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Xiaomi').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-asc').should('exist').as('brand-asc')
        cy.get('@brand-asc').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(10)
        })
        cy.wait(100)

        cy.reload()
        cy.wait(100)
    })

    it(`[Step 3 and 5] should show sale item list page and navigate back to sale item gallery page.\n
        should show "Huawei" and "Xiaomi" brand in "Filter by brand(s)".\n
        should show a list of "Huawei" and "Xiaomi" phones.".`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Xiaomi').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-asc').should('exist').as('brand-asc')
        cy.get('@brand-asc').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(10)
        })
        cy.wait(100)

        cy.visit('/sale-items/list')
        cy.wait(100) 

        cy.visit('/sale-items') 
        cy.wait(100)
    })    

    it(`[Step 4 and 5] should show manage brand page and navigate back to sale item gallery page.\n
        should show "Huawei" and "Xiaomi" brand in "Filter by brand(s)".\n
        should show a list of "Huawei" and "Xiaomi" phones.".`,()=>{
        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Xiaomi').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-asc').should('exist').as('brand-asc')
        cy.get('@brand-asc').click()

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(10)
        })
        cy.wait(100)

        cy.visit('/brands')
        cy.wait(100) 

        cy.visit('/sale-items') 
        cy.wait(100)
    })  

    it(`[Step 6] Close the brower and open sale item gallery page at /sale-items.\n
        should show "Apple" phones on the first page and "OPPO" on  the last page.`,()=>{
        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })
    })  
})
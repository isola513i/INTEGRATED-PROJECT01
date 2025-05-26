describe(`TC-FE-PBI12-VIEW-SALE-ITEM-GALLERY-PAGINATION-5\n 
    Test Scenario : normal - pagination setting persistence`, () => {

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

    it(`Each sale item contains brand, model, ramGb, storageGb, and price.\n`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('.itbms-brand')
        cy.get('.itbms-model')
        cy.get('.itbms-ramGb')
        cy.get('.itbms-storageGb')
        cy.get('.itbms-price')
    })

    it(`should have "Filter by brand(s)",\n
                    "No sort", "Sort By Brand in Ascending" button,\n
                    "Sort By Brand in Descending" button and \n
                    "Show page size" dropdown with default 10.
                    "Navigation bar (First,Prev,1-6,Next,Last)`,()=>{
        cy.get('.itbms-brand-filter').should('exist')
        cy.get('.itbms-brand-none').should('exist')
        cy.get('.itbms-brand-asc').should('exist')
        cy.get('.itbms-brand-desc').should('exist')
        cy.get('.itbms-page-size').should('exist')
        cy.get('.itbms-page-size').should('have.value',10)
        cy.get('.itbms-page-first').should('exist')
        cy.get('.itbms-page-prev').should('exist')
        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-next').should('exist')
        cy.get('.itbms-page-last').should('exist')
    })

    it(`[Step 0] should change page size to 5.\n
        should show page 1.\n
        should show 4 page numbers (1-4)\n
        should show 5 OPPO phones.\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'OPPO').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('not.exist')
        cy.get('.itbms-page-5').should('not.exist')
        cy.get('.itbms-page-6').should('not.exist')
        cy.get('.itbms-page-7').should('not.exist')
        cy.get('.itbms-page-8').should('not.exist')
        cy.get('.itbms-page-9').should('not.exist')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })

    })

    it(`[Step 1] should show page 3 and show 5 Huawei phones.\n
        [Step 2] should refresh sale item gallery page.\n
         should have 5 page size.\n
         There are 4 page numbers (1-4), page 3 is highlighted, and the gallery shows 5 Huawei phones.\n
        [Step 3] should show detail and click back to return the gallery page.\n
         should have 5 page size.\n
         There are 4 page numbers (1-4), page 3 is highlighted, and the gallery shows 5 Huawei phones.\n
        [Step 4] should show sale item list and click back to return the gallery page.\n
         should have 5 page size.\n
         There are 4 page numbers (1-4), page 3 is highlighted, and the gallery shows 5 Huawei phones.\n
        [Step 5] should have 10 page size.\n
         should have 2 page numbers (1-2), page 1 is highlighted, and the gallery shows 10 OPPO phones.\n
        [Step 6] should have 5 page size.
        should click "Last" button.
        should have 4 page numbers (1-4), page 4 is highlighted, and the gallery shows 5 Huawei phones.\n
        `,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'OPPO').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-page-2').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(5)
        })

        cy.reload()
        cy.contains('.itbms-page-size',5)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('not.exist')
        cy.get('.itbms-page-5').should('not.exist')
        cy.get('.itbms-page-6').should('not.exist')
        cy.get('.itbms-page-7').should('not.exist')
        cy.get('.itbms-page-8').should('not.exist')
        cy.get('.itbms-page-9').should('not.exist')

        cy.contains('.itbms-brand-filter','Huawei')
        cy.contains('.itbms-brand-filter','OPPO')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(5)
        })

        //[Step 3] Click the first sale item to view detail page
        cy.get('.itbms-row').should('exist')
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').should('exist')
        cy.get('.itbms-model').should('exist')
        cy.get('.itbms-price').should('exist')
        cy.get('.itbms-description').should('exist')
        cy.get('.itbms-ramGb').should('exist')
        cy.get('.itbms-storageGb').should('exist')
        cy.get('.itbms-color').should('exist')
        cy.get('.itbms-quantity').should('exist')

        cy.visit('/sale-items')
        cy.wait(100)

        cy.contains('.itbms-page-size',5)
        cy.contains('.itbms-brand-filter','Huawei')
        cy.contains('.itbms-brand-filter','OPPO')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(5)
        })
    
        //[Step 4] Open sale item list page at /sale-items/list
        cy.visit('/sale-items/list')
        cy.wait(100)

        it('The sale item list has sale items.',()=>{
            cy.get('.itbms-row').should('have.length.above',0)
        })

        cy.visit('/sale-items')
        cy.wait(100)

        cy.contains('.itbms-page-size',5)
        cy.contains('.itbms-brand-filter','Huawei')
        cy.contains('.itbms-brand-filter','OPPO')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(5)
        })

        //[Step 5] Change page size to 10.
        cy.get('.itbms-page-size').select('10')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('not.exist')
        cy.get('.itbms-page-3').should('not.exist')
        cy.get('.itbms-page-4').should('not.exist')
        cy.get('.itbms-page-5').should('not.exist')
        cy.get('.itbms-page-6').should('not.exist')
        cy.get('.itbms-page-7').should('not.exist')
        cy.get('.itbms-page-8').should('not.exist')
        cy.get('.itbms-page-9').should('not.exist')

        cy.contains('.itbms-brand-filter','Huawei')
        cy.contains('.itbms-brand-filter','OPPO')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(10)
        })

        //[Step 6] Change page size to 5 and click "Last"
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('not.exist')
        cy.get('.itbms-page-5').should('not.exist')
        cy.get('.itbms-page-6').should('not.exist')
        cy.get('.itbms-page-7').should('not.exist')
        cy.get('.itbms-page-8').should('not.exist')
        cy.get('.itbms-page-9').should('not.exist')

        cy.contains('.itbms-brand-filter','Huawei')
        cy.contains('.itbms-brand-filter','OPPO')

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(5)
        })
    })

    it(`[Step 7] Close the browser and open sale item gallery page at /sale-items.\n
        should have page size 10. There are 6 page numbers (1-6), page 1 is highlighted, and the gallery shows 10 Apple phones.]`,()=>{
        cy.contains('.itbms-page-size',10)
        cy.get('.itbms-filter-item').should('have.length',0)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('not.exist')
        cy.get('.itbms-page-7').should('not.exist')
        cy.get('.itbms-page-8').should('not.exist')
        cy.get('.itbms-page-9').should('not.exist')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')
    })
})
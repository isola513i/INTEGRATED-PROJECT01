describe(`TC-FE-PBI12-VIEW-SALE-ITEM-GALLERY-PAGINATION-1\n 
    Test Scenario : normal - page navigation bar with < 10 pages`, () => {

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
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-price')
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

    it(`[Step 1] Page 1 First sale item should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.1] should click "Next" button.\n
        Page 2 First sale item should be "Samsung,Galaxy S23 Ultra/-/512GB/39,600".\n
        should shows 10 Samsung phones`,()=>{
        cy.get('.itbms-page-next').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S23 Ultra')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','39,600')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('samsung')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.2] should click "Prev" button.\n
        Page 1 First sale item should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-page-next').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-page-prev').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.3] should click "5" button.\n
        Page 5 First sale item should be "ASUS,ROG Phone 7/16/512GB/33,000".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-page-4').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','ASUS')
        cy.get('@row').contains('.itbms-model','ROG Phone 7')
        cy.get('@row').contains('.itbms-ramGb','16')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('asus')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.4] should click "Next" button.\n
        Page 6 First sale item should be "OPPO,Find X6 Pro/12/256GB/33,000".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-page-4').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-page-next').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-model','Find X6 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.5] should click "First" button.\n
        Page 1 First sale item should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-page-5').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-page-first').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 1.6] should click "Last" button.\n
        Page 6 First sale item should be "OPPO,Find X6 Pro/12/256GB/33,000".\n
        should shows 10 Apple phones`,()=>{
        cy.get('.itbms-page-last').should('exist').click({force: true}) 
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-model','Find X6 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(10)
        })
    })

})
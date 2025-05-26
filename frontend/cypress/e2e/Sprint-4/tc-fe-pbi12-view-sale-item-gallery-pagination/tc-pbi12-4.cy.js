describe(`TC-FE-PBI12-VIEW-SALE-ITEM-GALLERY-PAGINATION-4\n 
    Test Scenario : normal - pagination with sort and filter`, () => {

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

    it(`[Step 0] should change page size to 5.\n
        should show 10 page numbers (1-10).\n
        [Step 1] should show page 12 when clicking "Last" button.\n
        should show 5 OPPO phones (A78, ..., Reno6 Pro).\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)            
        
        cy.get('[class*="itbms-page-"]').contains('12').should('exist')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })
    })

    it(`[Step 2] should sort sale items by brand in descending\n
        should show 10 page numbers (1-10).\n
        should show 5 Xiaomi phones.\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)            
        
        cy.get('[class*="itbms-page-"]').contains('12').should('exist')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)
    })

    it(`[Step 3] should click "Last" button.\n
        should show page 12.\n
        should show 5 Apple phones.\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)            
        
        cy.get('[class*="itbms-page-"]').contains('12').should('exist')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(5)
        })

    })

    it(`[Step 4] should filter brands with "Huawei" and "OPPO".\n
        should show page 1.\n
        should show 5 OPPO phones.\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

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

    it(`[Step 5] should change page size to 20.\n
        should not show page navigation bar.\n
        should show 20 items starting with 10 OPPO phones, follow by 10 Huawei phones.\n`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'OPPO').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-page-size').select('20')
        cy.wait(100)

        cy.get('.itbms-page-first').should('not.be.visible')
        cy.get('.itbms-page-prev').should('not.be.visible')
        cy.get('.itbms-page-0').should('not.be.visible')
        cy.get('.itbms-page-next').should('not.be.visible')
        cy.get('.itbms-page-last').should('not.be.visible')

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('huawei')
            )
            expect(matched).to.have.length(10)
        })
    })

    it(`[Step 6] should change page size to 5.\n
        should show page 1.\n
        should show 4 page numbers (1-4)\n
        should show 5 OPPO phones.`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')
        cy.get('.itbms-page-4').should('exist')
        cy.get('.itbms-page-5').should('exist')
        cy.get('.itbms-page-6').should('exist')
        cy.get('.itbms-page-7').should('exist')
        cy.get('.itbms-page-8').should('exist')
        cy.get('.itbms-page-9').should('exist')

        cy.get('.itbms-brand-desc').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-brand-filter').should('exist').as('brand-filter')
        cy.get('@brand-filter').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'Huawei').should('exist').click()
        cy.wait(100)

        cy.contains('.itbms-filter-item', 'OPPO').should('exist').click()
        cy.wait(100)

        cy.get('.itbms-page-size').select('20')
        cy.wait(100)

        cy.get('.itbms-page-first').should('not.be.visible')
        cy.get('.itbms-page-prev').should('not.be.visible')
        cy.get('.itbms-page-0').should('not.be.visible')
        cy.get('.itbms-page-next').should('not.be.visible')
        cy.get('.itbms-page-last').should('not.be.visible')

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

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })

    })
})
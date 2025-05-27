describe(`TC-FE-PBI12-VIEW-SALE-ITEM-GALLERY-PAGINATION-3\n 
    Test Scenario : normal - page size = 5 \n
                           - page navigation bar with > 10 pages`, () => {

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

    it(`[Step 0] should change page size to 20.\n
        should show 3 pages in page navigation bar.\n
        should show 20 sale items starting with 10 Apple phones follow by 10 Samsung phones.\n
        [Step 1] should change page size to 5.\n
        should show 10 page numbers (1-10).\n
        should show 5 tiems with 5 Apple phones\n
        should disable both "First" and "Prev" buttons`,()=>{
        cy.get('.itbms-page-size').select('20')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')

        cy.get('.itbms-row').should('have.length',20)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('samsung')
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

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 1.1] should click the page 10.\n
        should show 5 Asus phones (ROG Phone 5s, ..., ROG Phone 3).\n
        should enable both "First" and "Prev" buttons.\n
        should enable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-9').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('asus')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 1.2] should click the page "Next".\n
        should show the page 11.
        should show 5 OPPO phones (Find X6 Pro, ..., Find X5 Pro).\n
        should enable both "First" and "Prev" buttons\n
        should enable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-9').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-page-next').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 1.3] should click the page "2".\n
        should show the page 2.
        should show 5 Apple phones (iPhone 12, ..., iPhone 12 mini).\n
        should enable both "First" and "Prev" buttons\n
        should enable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-1').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 1.4] should click the page "Prev".\n
        should show the page 1.
        should show 5 Apple phones.\n
        should disable both "First" and "Prev" buttons\n
        should enable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-1').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-page-prev').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 1.5] should click the page "Last".\n
        should show the page 12.
        should show 5 OPPO phones (A78, ..., Reno6 Pro).\n
        should anable both "First" and "Prev" buttons\n
        should disable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 1.6] should click the page "First".\n
        should show the page 2.
        should show 5 Apple phones.\n
        should disable both "First" and "Prev" buttons\n
        should enable both "Next" and "Last" buttons`,()=>{
        cy.get('.itbms-page-size').select('5')
        cy.wait(100)

        cy.get('.itbms-page-first').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('apple')
            )
            expect(matched).to.have.length(5)
        })

        cy.get('.itbms-page-first').as('first') ;
        cy.get('@first').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-page-prev').as('prev') ;
        cy.get('@prev').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.get('.itbms-page-next').as('next') ;
        cy.get('@next').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-page-last').as('last') ;
        cy.get('@last').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

})
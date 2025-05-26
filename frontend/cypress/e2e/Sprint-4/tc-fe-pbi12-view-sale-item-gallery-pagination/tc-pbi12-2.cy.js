describe(`TC-FE-PBI12-VIEW-SALE-ITEM-GALLERY-PAGINATION-2\n 
    Test Scenario : normal - page size = 20 \n
                           - handling of moving last page`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')
    let lastItemId 

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

    it(`[Step 1] should change page size to 20.\n
        should show 3 pages in page navigation bar.\n
        should show 20 sale items starting with 10 Apple phones follow by 10 Samsung phones.\n
        [Step 2] should add an item "Samsung/Galaxy S25 Ultra".\n
        [Step 3] should click "Last" button.\n
        should show 4 pages in page navigation bar.\n
        should show only "Samsung/Galaxy S25 Ultra" in page 4.\n`,()=>{
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


        cy.request({
                method: 'POST',
                url: `${baseAPI}/v1/sale-items`, // เปลี่ยน URL ให้ตรงกับของคุณ
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    model: 'Galaxy S25 Ultra',
                    price: 44900,
                    quantity: 10,
                    description: "Android 15",
                    brand: {id: 1, name: "Samsung"},
                    ramGb: "",
                    storageGb: "",
                    color: ""
                }
        }).then((response) => {
            expect(response.status).to.eq(201) 

            lastItemId = response.body.id
        })

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-page-3').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S25 Ultra')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-price','44,900')
    })


    it(`[Step 4] should delete the sale item "Samsung/Galaxy S25 Ultra".\n
        [Step 5] should click "First" button and then click "Last" button.\n
        should show 3 pages in page navigation bar.\n
        should show 20 sale items in pag 3 starting with 10 ASUS phones follow by 10 OPPO phones.\n\n`,()=>{
        cy.get('.itbms-page-size').select('20')
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('exist')

        cy.get('.itbms-row').should('have.length',20)

        cy.request({
                method: 'DELETE',
                url: `${baseAPI}/v1/sale-items/${lastItemId}`
        }).then((response) => {
            expect(response.status).to.eq(204) 
        })

        cy.get('.itbms-page-first').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-page-0').should('exist')
        cy.get('.itbms-page-1').should('exist')
        cy.get('.itbms-page-2').should('exist')
        cy.get('.itbms-page-3').should('not.exist')

        cy.get('.itbms-page-last').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('asus')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-brand').then(($brands) => {
            const matched = $brands.filter((index, el) =>
                el.textContent.toLowerCase().includes('oppo')
            )
            expect(matched).to.have.length(10)
        })

        cy.get('.itbms-page-2').should('exist').click({force: true})
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','ASUS')
        cy.get('@row').contains('.itbms-model','ROG Phone 7')
        cy.get('@row').contains('.itbms-ramGb','16')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-price','33,000')
    })
})
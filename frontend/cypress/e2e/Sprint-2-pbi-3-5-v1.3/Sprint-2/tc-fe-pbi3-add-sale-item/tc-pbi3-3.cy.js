describe(`TC-FE-PBI3-ADD-SALE-ITEM-3\n 
    Test Scenario : normal - optional fields`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have "Add Sale Item" button and click to open the page for entry new sale item',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
    })

    it('should have save button and the button is disabled',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it('should be enable the save button after add all fields',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Samsung') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('Galaxy S25 Ultra') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('44900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('10') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should save the new sale item and should have statusCode 201',()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Samsung') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('Galaxy S25 Ultra') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('44900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('10') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true}) ;
        cy.wait(100)

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
        })

        cy.get('.itbms-message').contains('The sale item has been successfully added.')

        cy.url().should('contain','/sale-items') ;
    })

    it('should have the new sale item in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-price','44,900')
    })

    it('should have the new sale item in the sale item gallery and should have the detail of the new sale item',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Samsung')
        cy.get('.itbms-model').contains('Galaxy S25 Ultra')
        cy.get('.itbms-price').contains('44,900')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50')
        cy.get('.itbms-ramGb').contains('-')
        cy.get('.itbms-screenSizeInch').contains('-')
        cy.get('.itbms-storageGb').contains('-')
        cy.get('.itbms-color').contains('-')
        cy.get('.itbms-quantity').contains('10')
    })
})
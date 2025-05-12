describe(`TC-FE-PBI3-ADD-SALE-ITEM-5\n 
    Test Scenario : normal - trimmed`, () => {

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
        cy.get('@brandSelect').select('Vivo') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('     V27     ') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('11684') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('     Aura Light Portrait System     ') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('8') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('8') ;


        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('256') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('     Noble Black     ') ;

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
        cy.get('@brandSelect').select('Vivo') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('     V27     ') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('11684') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('     Aura Light Portrait System     ') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('8') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('8') ;


        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('256') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('     Noble Black     ') ;

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
        cy.get('.itbms-model').contains('V27').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Vivo')
        cy.get('@row').contains('.itbms-model','V27')
        cy.get('@row').contains('.itbms-ramGb','8')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','11,684')
    })

    it('should have the new sale item in the sale item gallery and should have the detail of the new sale item',()=>{
        cy.get('.itbms-model').contains('V27').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Vivo')   
        cy.get('.itbms-model').contains('V27')
        cy.get('.itbms-price').contains('11,684')
        cy.get('.itbms-description').contains('Aura Light Portrait System')
        cy.get('.itbms-ramGb').contains('8')
        cy.get('.itbms-storageGb').contains('256')
        cy.get('.itbms-storageGb-unit').contains('GB')
        cy.get('.itbms-color').contains('Noble Black')
        cy.get('.itbms-quantity').contains('8')
    })

})
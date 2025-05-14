describe(`TC-FE-PBI3-ADD-SALE-ITEM-4\n 
    Test Scenario : normal - all fields
                           - max size (model)`, () => {

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
        cy.get('@brandSelect').select('OPPO') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('7999') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('12') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('6') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.7') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('128') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Pink') ;

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
        cy.get('@brandSelect').select('OPPO') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('7999') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('12') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('6') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.7') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('128') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Pink') ;

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
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-model','1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','128')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','7,999')
    })

    it('should have the new sale item in the sale item gallery and should have the detail of the new sale item',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('OPPO')
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G')
        cy.get('.itbms-price').contains('7,999')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม')
        cy.get('.itbms-ramGb').contains('6')
        cy.get('.itbms-screenSizeInch').contains('6.7')
        cy.get('.itbms-storageGb').contains('128')
        cy.get('.itbms-storageGb-unit').contains('GB')
        cy.get('.itbms-color').contains('Pink')
        cy.get('.itbms-quantity').contains('12')
    })

})
describe(`TC-FE-PBI3-ADD-SALE-ITEM-1\n 
    Test Scenario : normal - all fields\n
                           - cancel the action`, () => {

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

    it('should be enabled the save button after adding data for Brand, Model, Price and Description',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('iPhone 15 Pro Max') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('57900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should be enable the save button after adding all non-opional fields',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('iPhone 15 Pro Max') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('57900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('5') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should be enable the save button after add all fields',()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('iPhone 15 Pro Max') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('57900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('5') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('8') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.7') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('512') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Black Titanium') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should return to the sale item gallery when clicking the cancel button',()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('iPhone 15 Pro Max') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('57900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('5') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('8') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.7') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('512') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Black Titanium') ;

        cy.get('.itbms-cancel-button').as('cancel') ;
        cy.get('@cancel').click() 

        cy.url().should('contain','/sale-items') ;
    })

})
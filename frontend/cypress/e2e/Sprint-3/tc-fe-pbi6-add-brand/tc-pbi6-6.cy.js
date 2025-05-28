describe(`TC-FE-PBI6-ADD-BRAND-6\n 
    Test Scenario : normal - add 2 sale items with Infinix and Meizu brand.`, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item list page at ${resource}`, () => {
    })

    it(`should have "Add Sale Item" button and click to open the page for entry new sale item`,()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)
    })

    it(`should contains "Infinix", "Tecno" and "Meizu" options in the brand list".\n should have save button and the button is disabled`,()=>{
        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').should("contain","Infinix").and("contain","Samsung").and("contain","Meizu")

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`should add and save data (td-1).\n 
        should have statusCode 201.\n
        should show a message "The sale item has been successfully added."\n
        should have the new sale item in the sale item list`,()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Infinix') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('Note 50 Pro+') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('13999') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('ระบบปฎิบัติการ Android 15 หน้าจอ AMOLED กล้องหลังคู่ 50MP + 2MP, กล้องหน้า 13MP') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('9') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('8') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.7') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('256') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Enchanted Purple') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true}) ;
        cy.wait(100)

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
        })

        cy.get('.itbms-message').contains('The sale item has been successfully added.')

        cy.url().should('contain','/sale-items/list') ;

        cy.get('.itbms-model').contains('Note 50 Pro+').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Infinix')
        cy.get('@row').contains('.itbms-model','Note 50 Pro+')
        cy.get('@row').contains('.itbms-ramGb','8')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-color','Enchanted Purple')
        cy.get('@row').contains('.itbms-price','13,999')
    })

    it(`should add and save data (td-2).\n 
        should have statusCode 201.\n
        should show a message "The sale item has been successfully added."\n
        should have the new sale item in the sale item list`,()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Meizu') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('21 5G') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('17029') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('Snapdragon8 Gen 3 หน้าจอ AMOLED  รีเฟรช 120Hz') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('12') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('12') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.5') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('512') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Black') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true}) ;
        cy.wait(100)

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
        })

        cy.get('.itbms-message').contains('The sale item has been successfully added.')

        cy.url().should('contain','/sale-items/list') ;

        cy.get('.itbms-model').contains('21 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Meizu')
        cy.get('@row').contains('.itbms-model','21 5G')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-color','Black')
        cy.get('@row').contains('.itbms-price','17,029')
    })

})
describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-2\n 
    Test Scenario : fail - add sale item with invalid data`, () => {
    
    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    let lastSaleItemId 

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`[Step 1] Open the sale item gallery page at ${resource}`, () => {
    })

    it(`[Step 1.1] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-4).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('');
        cy.get('@brandSelect').blur() 


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.contains('.itbms-message','Brand must be selected.').should('exist') ;
    })

    it(`[Step 1.2] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-5).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('     ') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Model must be 1-60 characters long.').should('exist') ;
    })

    it(`[Step 1.3] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-6).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('     iPhone 16 Pro Max-Ultra Hyper-Realistic ProMotion XDR Display     ') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Model must be 1-60 characters long.').should('exist') ;
    })

    it(`[Step 1.4] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-7).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('     ') ;
        cy.get('@descriptionInput').blur() ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Description must be 1-65,535 characters long.').should('exist') ;
    })

    it(`[Step 1.5] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-8).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('     ') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Description must be 1-65,535 characters long.').should('exist') ;
    })

    it(`[Step 1.6] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-9).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('-1') ;
        cy.get('@quantityInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Quantity must be non-negative integer.').should('exist') ;
    })

    it(`[Step 1.7] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-10).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('-1') ;
        cy.get('@priceInput').blur() ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Price must be non-negative integer.').should('exist') ;
    })

    it(`[Step 1.8] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-11).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('0') ;
        cy.get('@screenSizeInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Screen size must be positive number with at most 2 decimal points or not specified').should('exist') ;
    })

    it(`[Step 1.9] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-12).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;
    
        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('-0.01') ;
        cy.get('@screenSizeInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Screen size must be positive number with at most 2 decimal points or not specified.').should('exist') ;
    })

    it(`[Step 1.10] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-13).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.111') ;
        cy.get('@screenSizeInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Screen size must be positive number with at most 2 decimal points or not specified.').should('exist') ;
    })

    it(`[Step 1.11] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-14).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('0') ;
        cy.get('@ramGbInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','RAM size must be positive integer or not specified.').should('exist') ;
    })

    it(`[Step 1.12] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-15).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;
    
        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('-1') ;
        cy.get('@ramGbInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','RAM size must be positive integer or not specified.').should('exist') ;
    })

    it(`[Step 1.13] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-16).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('0') ;    
        cy.get('@storageGbInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Storage size must be positive integer or not specified.').should('exist') ;
    })

    it(`[Step 1.14] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-17).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('-1') ;    
        cy.get('@storageGbInput').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Storage size must be positive integer or not specified.').should('exist') ;
    })

    it(`[Step 1.15] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-18).\n
        should diable "Save" with the error message.`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('ZTE');


        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('A') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('1') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('1') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('     Whispering Willow Enchanted Forests Green     ') ;  
        cy.get('@colorInput').blur() ;
        

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
        cy.contains('.itbms-message','Color must be 1-40 characters long or not specified.').should('exist') ;
    })
});
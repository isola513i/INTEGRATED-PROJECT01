describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-3\n 
    Test Scenario : fail - edit sale item with invalid data`, () => {
    
    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    let lastSaleItemId 

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.contains('.itbms-model',"iPhone 14 Pro Max").should('exist').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit')
        cy.get('@edit').should('exist').click()
        cy.wait(100)
    }) ;

    it(`[Step 1] Open the sale item gallery page at ${resource}\n
        should have the sale item "iPhone 14 Pro Max".\n
        [Step 2] should show a form for editing the sale item "iPhone 14 Pro Max".`, () => {
    })

    it(`[Step 3] should change the model field to "   " and navigate to next file.\n
        should show an error message "Model must be 1-60 characters long."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-model').clear().type('   ')
        cy.get('.itbms-model').blur() ;
        cy.get('.itbms-message').should('contain','Model must be 1-60 characters long.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 4] should change the model field to "     iPhone 16 Pro Max-Ultra Hyper-Realistic ProMotion XDR Display     " and navigate to next file.\n
        should show an error message "Model must be 1-60 characters long."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-model').clear().type("     iPhone 16 Pro Max-Ultra Hyper-Realistic ProMotion XDR Display     ")
        cy.get('.itbms-model').blur() ;
        cy.get('.itbms-message').should('contain','Model must be 1-60 characters long.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 5] should change the model field to "     iPhone 16 Pro MaxUltra Hyper-Realistic ProMotion XDR Display     " and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-model').clear().type("     iPhone 16 Pro MaxUltra Hyper-Realistic ProMotion XDR Display     ")
        cy.get('.itbms-model').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 6] should change the description field to "     " and navigate to next file.\n
        should show an error message "Description must be 1-65,535 characters long."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-description').clear().type("     ")
        cy.get('.itbms-description').blur() ;
        cy.get('.itbms-message').should('contain','Description must be 1-65,535 characters long.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 9] should change the quantity field to -1  and navigate to next file.\n
        should show an error message "Quantity must be non-negative integer."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-quantity').clear().type("-1")
        cy.get('.itbms-quantity').blur() ;
        cy.get('.itbms-message').should('contain','Quantity must be non-negative integer.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 10] should change the quantity field to 0  and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-quantity').clear().type("0")
        cy.get('.itbms-quantity').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    }) 

    it(`[Step 11] should change the price field to -1  and navigate to next file.\n
        should show an error message "Price must be non-negative integer."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-price').clear().type("-1")
        cy.get('.itbms-price').blur() ;
        cy.get('.itbms-message').should('contain','Price must be non-negative integer.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 12] should change the price field to 0  and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-price').clear().type("0")
        cy.get('.itbms-price').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    }) 

    it(`[Step 13] should change the screen size field to 0  and navigate to next file.\n
        should show an error message "Screen size must be positive number with at most 2 decimal points or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-screenSizeInch').clear().type("0")
        cy.get('.itbms-screenSizeInch').blur() ;
        cy.get('.itbms-message').should('contain','Screen size must be positive number with at most 2 decimal points or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 14] should change the screen size field to -0.01  and navigate to next file.\n
        should show an error message "Screen size must be positive number with at most 2 decimal points or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-screenSizeInch').clear().type("-0.01")
        cy.get('.itbms-screenSizeInch').blur() ;
        cy.get('.itbms-message').should('contain','Screen size must be positive number with at most 2 decimal points or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 15] should change the screen size field to 6.111  and navigate to next file.\n
        should show an error message "Screen size must be positive number with at most 2 decimal points or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-screenSizeInch').clear().type("6.111")
        cy.get('.itbms-screenSizeInch').blur() ;
        cy.get('.itbms-message').should('contain','Screen size must be positive number with at most 2 decimal points or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 16] should change the screen size field to 0.01  and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-screenSizeInch').clear().type("0.01")
        cy.get('.itbms-screenSizeInch').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    }) 

    it(`[Step 17] should change the RAM field to 0  and navigate to next file.\n
        should show an error message "RAM size must be positive integer or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-ramGb').clear().type("0")
        cy.get('.itbms-ramGb').blur() ;
        cy.get('.itbms-message').should('contain','RAM size must be positive integer or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 18] should change the RAM field to -1  and navigate to next file.\n
        should show an error message "RAM size must be positive integer or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-ramGb').clear().type("-1")
        cy.get('.itbms-ramGb').blur() ;
        cy.get('.itbms-message').should('contain','RAM size must be positive integer or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 19] should change the RAM field to ""  and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-ramGb').clear()
        cy.get('.itbms-ramGb').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    }) 

    it(`[Step 20] should change the storage size field to 0  and navigate to next file.\n
        should show an error message "Storage size must be positive integer or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-storageGb').clear().type("0")
        cy.get('.itbms-storageGb').blur() ;
        cy.get('.itbms-message').should('contain','Storage size must be positive integer or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 21] should change the storage size field to -1  and navigate to next file.\n
        should show an error message "Storage size must be positive integer or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-storageGb').clear().type("-1")
        cy.get('.itbms-storageGb').blur() ;
        cy.get('.itbms-message').should('contain','Storage size must be positive integer or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    }) 

    it(`[Step 22] should change the storage size field to ""  and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-storageGb').clear()
        cy.get('.itbms-storageGb').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    }) 


    it(`[Step 23] should change the color field to "     Whispering Willow Enchanted Forests Green     " and navigate to next file.\n
        should show an error message "Color must be 1-40 characters long or not specified."\n
        should disable the "save" button.`,()=>{
        
        cy.get('.itbms-color').clear().type("     Whispering Willow Enchanted Forests Green     ")
        cy.get('.itbms-color').blur() ;
        cy.get('.itbms-message').should('contain','Color must be 1-40 characters long or not specified.')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 24] should change the color field to "     Whispering Willow Enchanted Forest Green     " and navigate to next file.\n
        should enable the "save" button without the error message.`,()=>{
        
        cy.get('.itbms-color').clear().type("     Whispering Willow Enchanted Forest Green     ")
        cy.get('.itbms-color').blur() ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-cancel-button').should('exist').click()
        cy.wait(100)
    })

});
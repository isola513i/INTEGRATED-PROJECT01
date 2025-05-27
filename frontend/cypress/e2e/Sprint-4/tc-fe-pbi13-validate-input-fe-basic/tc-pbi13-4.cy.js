describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-4\n 
    Test Scenario : normal - add brand with valid data\n
                           - compulsory field only
                           - min boundary case
                           - max boundary case with leading/trailing whitespaces`, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`[Step 1] Open the sale item list page at ${resource}`, () => {
    })

    it(`should have "Manage Brand" button and click to open the brand list page in table view\n
        should have id and name fields\n`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-id')
        cy.get('@row').find('.itbms-name')
    })

    it(`should have "1 Samsung" at row 1 and "2 Apple" at row 2`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-id','1')
        cy.get('@row').contains('.itbms-name','Samsung')

        cy.get('.itbms-row').eq(1).as('row')
        cy.get('@row').contains('.itbms-id','2')
        cy.get('@row').contains('.itbms-name','Apple')
    })

    it('[Step 2] should have Add Brand button and click to open a page for entry new brand details',()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)
    })

    it('should have save button and the button is disabled',()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 3] should enable the save button after adding "ไอทีบางมด" for Brand name and the error message is not shown.\n
        [Step 4] should add "ไอทีบางมด" brand successfully.\n
        should have "ไอทีบางมด" in the Manage Brand page.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('ไอทีบางมด')
        cy.get('.itbms-isActive').uncheck()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-save-button').click()
        cy.wait(100)

        cy.contains('.itbms-row', 'ไอทีบางมด').should('exist')

    })

    it(`[Step 5] should click "Edit" to view the "ไอทีบางมด" brand detail.\n
        should click "Cancel" button to cancel the editing.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('ไอทีบางมด').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-name').should("have.value",'ไอทีบางมด')
        cy.get('.itbms-countryOfOrigin').should("have.value",'')
        cy.get('.itbms-websiteUrl').should("have.value",'')
        cy.get('.itbms-isActive').should('not.be.checked')

        cy.get('.itbms-cancel-button').click()
        cy.wait(100)

        cy.url().should('contain','/brands')
    })

    it(`[Step 6] should click "Delete" button to delete the "ไอทีบางมด" brand.\n
        should click "Confirm" button.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('ไอทีบางมด').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete ไอทีบางมด brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        cy.url().should('contain','/brands')
        cy.get('.itbms-name').should('not.contain', 'ไอทีบางมด');
    })

    it(`[Step 7] should enable the save button after adding "I" for Brand name and the error message is not shown.\n
        [Step 8] should add "I" brand successfully.\n
        should have "I" in the Manage Brand page.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('I')
        cy.get('.itbms-countryOfOrigin').type('T')
        cy.get('.itbms-isActive').check()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-save-button').click()
        cy.wait(100)

        cy.contains('.itbms-row', 'I').should('exist')

    })

    it(`[Step 9] should click "Edit" to view the "I" brand detail.\n
        should click "Cancel" button to cancel the editing.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('I').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-name').should("have.value",'I')
        cy.get('.itbms-countryOfOrigin').should("have.value",'T')
        cy.get('.itbms-websiteUrl').should("have.value",'')
        cy.get('.itbms-isActive').should('be.checked')

        cy.get('.itbms-cancel-button').click()
        cy.wait(100)

        cy.url().should('contain','/brands')
    })

    it(`[Step 10] should click "Delete" button to delete the "I" brand.\n
        should click "Confirm" button.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('I').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete I brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        cy.url().should('contain','/brands')
        cy.get('.itbms-name').should('not.contain', 'I');
    })

    it(`[Step 11] should enable the save button after adding "     ITBangmod-KMUTT-TH-Innovations     " for Brand name and the error message is not shown.\n
        [Step 12] should add "ITBangmod-KMUTT-TH-Innovations" brand successfully.\n
        should have "ITBangmod-KMUTT-TH-Innovations" in the Manage Brand page.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('     ITBangmod-KMUTT-TH-Innovations     ')
        cy.get('.itbms-countryOfOrigin').type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
         cy.get('.itbms-websiteUrl').type('     https://www.sit.kmutt.ac.th/bsc/LKJADF8E     ')
        cy.get('.itbms-isActive').check()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
        cy.get('.itbms-save-button').click()
        cy.wait(100)

        cy.contains('.itbms-row', 'ITBangmod-KMUTT-TH-Innovations').should('exist')

    })

    it(`[Step 13] should click "Edit" to view the "ITBangmod-KMUTT-TH-Innovations" brand detail.\n
        should click "Cancel" button to cancel the editing.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('ITBangmod-KMUTT-TH-Innovations').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-name').should("have.value",'ITBangmod-KMUTT-TH-Innovations')
        cy.get('.itbms-countryOfOrigin').should("have.value",'อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข')
        cy.get('.itbms-websiteUrl').should("have.value",'https://www.sit.kmutt.ac.th/bsc/LKJADF8E')
        cy.get('.itbms-isActive').should('be.checked')

        cy.get('.itbms-cancel-button').click()
        cy.wait(100)

        cy.url().should('contain','/brands')
    })

    it(`[Step 14] should click "Delete" button to delete the "ITBangmod-KMUTT-TH-Innovations" brand.\n
        should click "Confirm" button.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('ITBangmod-KMUTT-TH-Innovations').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete ITBangmod-KMUTT-TH-Innovations brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        cy.url().should('contain','/brands')
        cy.get('.itbms-name').should('not.contain', 'ITBangmod-KMUTT-TH-Innovations');
    })

})
describe(`TC-FE-PB25-VIEW-SALE-ITEM-LIST-BY-SELLER-2\n 
    Test Scenario : normal - seller(td-4)\n
                           - view sale-items list owned by the current logged-in seller\n
                           - edit a sale item
                           - cancel the action`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somsuk@ad.sit.kmutt.ac.th') ;
        cy.get('.itbms-password').as('password') ;
        cy.get('@password').type('itProj24*SOM') ;
        cy.get('.itbms-signin-button').as('submit') ;
        cy.get('@submit').click() ;
        cy.wait(100)

        cy.on('window:alert', (text) => {
            expect(text).to.contains('The user account has been successfully logged in.')
        })
        cy.wait(200) ;

        cy.url().should('include', '/sale-items/list') ;
    }) ;

    it(`[step 1] Open the Sign In page at ${resource}.\n
        should display a sale-items list page.`, () => {
    })

    it(`should show the sale-items list owned by the current logged-in seller.\n
        should contains 30 sale items or 3 pages.`,()=>{
        cy.get('.itbms-row').should('have.length.above',0)
        cy.get('body').then($body => {
            const rowCount = $body.find('.itbms-row').length ;
            const page2 = $body.find('.itbms-page-2').length>0 ;
            expect(rowCount === 30 || page2).to.be.true ;
        }) ;
    })

    it(`Each sale item contains id, brand, model, ramGb, storageGb, color, price 
        and the edit and delete buttons.`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-id')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-color')
        cy.get('@row').find('.itbms-price')
        cy.get('@row').find('.itbms-edit-button')
        cy.get('@row').find('.itbms-delete-button')
    })

    it(`The First sale item should be "Apple, iPhone 14, 6Gb, 256Gb, Midnight, 29,700".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-id','2')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-color','Midnight')
        cy.get('@row').contains('.itbms-price','29,700')
    })

    it(`The 10th sale item should be "Samsung, Galaxy S21 FE, 6Gb 128Gb, Olive, 19,800".`,()=>{
        cy.get('.itbms-row').eq(9).as('row')
        cy.get('@row').contains('.itbms-id','25')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S21 FE')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','128')
        cy.get('@row').contains('.itbms-color','Olive')
        cy.get('@row').contains('.itbms-price','19,800')
    })

    it(`[step 2] should click the "Edit" button of the first sale item.\n 
        should show a form for editing the sale item details.\n
        should disable the "Save" button.`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.url().should('include', '/sale-items/2/edit') ;

        cy.get('.itbms-brand').contains('Apple')
        cy.get('input.itbms-model').should('have.value','iPhone 14')
        cy.get('input.itbms-price').should('have.value','29700')
        cy.get('textarea.itbms-description').should('have.value','ไอโฟนรุ่นใหม่ล่าสุด รองรับ 5G เร็วแรง ถ่ายภาพสวยทุกสภาพแสง')
        cy.get('input.itbms-ramGb').should('have.value','6')
        cy.get('input.itbms-screenSizeInch').should('have.value','6.1')
        cy.get('input.itbms-storageGb').should('have.value','256')
        cy.get('input.itbms-color').should('have.value','Midnight')
        cy.get('input.itbms-quantity').should('have.value','8')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

    })

})
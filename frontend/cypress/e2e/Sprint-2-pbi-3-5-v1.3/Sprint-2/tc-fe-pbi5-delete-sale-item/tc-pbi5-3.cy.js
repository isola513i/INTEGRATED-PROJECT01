describe(`TC-FE-PBI4-ADD-SALE-ITEM-3\n 
    Test Scenario : fail - the sale item does not exist, \n
                        eg. the sale item already been deleted by another user. `, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')
    let requestUrl = ''

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have the sale item "1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G" in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','OPP')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-price','7,999')
    })

    it('should have the sale item "1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G"  in the sale item gallery and should have the detail of the sale item',()=>{
         cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('OPPO')
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G') 
        cy.get('.itbms-price').contains('7,999')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม')
        cy.get('.itbms-ramGb').contains('-')
        cy.get('.itbms-screenSizeInch').contains('-')
        cy.get('.itbms-storageGb').contains('-')
        cy.get('.itbms-color').contains('-')
        cy.get('.itbms-quantity').contains('12')
    })

    it('should have delete button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the delete dialog with message "Do you want to delete this sale item?" ',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').click() 
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 
    })

    it('should delete the sale item and should have statusCode 404 with a message "The requested sale item does not exist."',()=>{
        cy.intercept('GET',`${baseAPI}/v1/sale-items/**`).as('getSaleItem') ;

        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.wait('@getSaleItem').then((interception)=>{
            requestUrl = interception.request.url
            cy.log(`Request URL: ${requestUrl}`)

            cy.request('DELETE', requestUrl).then((response) => {
                expect(response.status).to.equal(204)
            })
        })

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').click() 
        cy.wait(100)

         cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(404)
        })
        cy.wait(100)

        cy.get('.itbms-message').contains('The requested sale item does not exist.')

        cy.url().should('contain','/sale-items') ;

        cy.get('.itbms-model').should('not.contain', '1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G');
    })
})
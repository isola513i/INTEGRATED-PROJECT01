describe(`TC-FE-PBI2-VIEW-SALE-ITEM-DETAIL-3 with Message\n 
    Test Scenario : fail - view sale item with invalid ID`, () => {

    let resource = '/sale-items'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('The sale item table has 60 sale items.',()=>{
        cy.get('.itbms-row').should('have.length',60)
    })

    it('Each sale item contains brand, model, ramGb, storageGb, and price.',()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-price')
    })

    it(`Open sale item at ${resource}/999. Frontend show message "The requested sale item doesnot exist."`,()=>{
        cy.visit('/sale-items/999')

        cy.get('.itbms-message').contains('The requested sale item does not exist.')
      
        cy.location().should((location)=>{
            expect(location.pathname).to.eq('/sale-items')
        })

    })

})
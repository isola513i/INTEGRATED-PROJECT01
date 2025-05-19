describe(`TC-FE-PBI-PRE6-VIEW-SALE-ITEM-LIST-2\n 
    Test Scenario : normal - normal - sale item table has data`, () => {

    let resource = '/sale-items/list'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item list page at ${resource}`, () => {
    })

    it('The sale item table has sale items.',()=>{
        cy.get('.itbms-row').should('have.length.above',0)
    })

    it('Each sale item contains id, brand, model, ramGb, storageGb, color and price.',()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-id')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-color')
        cy.get('@row').find('.itbms-price')
    })

    it(`First sale item at ${resource}/1 should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-id','1')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-color','Space Black')
        cy.get('@row').contains('.itbms-price','42,900')
    })

    it(`Fifth sale item at ${resource}/5 should be "Apple,iPhone 12 Pro Max/6/256GB/29,700".`,()=>{
        cy.get('.itbms-row').eq(4).as('row')
        cy.get('@row').contains('.itbms-id','5')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 12 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-color','Pacific Blue')
        cy.get('@row').contains('.itbms-price','29,700')
    })

    it(`11th sale item at ${resource}/16 should be "Samsung,Galaxy S23 Ultra/-/512GB/39,600".`,()=>{
        cy.get('.itbms-row').eq(10).as('row')
        cy.get('@row').contains('.itbms-id','16')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S23 Ultra')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-color','-')
        cy.get('@row').contains('.itbms-price','39,600')
    })

})
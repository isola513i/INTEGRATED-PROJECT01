describe(`TC-FE-PBI1-VIEW-SALE-ITEM-GALLERY-2\n 
    Test Scenario : normal - normal - sale item table has data`, () => {

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

    it(`First sale item at ${resource}/1 should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')
    })

    it(`Fifth sale item at ${resource}/5 should be "Apple,iPhone 12 Pro Max/6/256GB/29,700".`,()=>{
        cy.get('.itbms-row').eq(4).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 12 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','29,700')
    })

    it(`11th sale item at ${resource}/16 should be "Samsung,Galaxy S23 Ultra/-/512GB/39,600".`,()=>{
        cy.get('.itbms-row').eq(10).as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S23 Ultra')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','39,600')
    })

    it(`22th sale item at ${resource}/32 should be "Xiaomi,13T Pro/12/-GB/23,100".`,()=>{
        cy.get('.itbms-row').eq(21).as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','13T Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','23,100')
    })

    it(`60th sale item at ${resource}/85 should be "OPPO,Reno6 Pro/12/256GB/16,500".`,()=>{
        cy.get('.itbms-row').eq(59).as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-model','Reno6 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','16,500')
    })

})
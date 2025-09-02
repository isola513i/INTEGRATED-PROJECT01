describe(`TC-FE-PBI22-VALIDATE-MATCH-PASSWORD-1\n 
    Test Scenario : failed - one space email and one space password`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open Sign In page at ${resource}`, () => {
    })


    it('should have Sign In button and the button is disabled',()=>{
        cy.get('.itbms-signin-button').as('signin') ;
        cy.get('@signin').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })    

    it('should disable the Sign In button after type empty email and password.',()=>{

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type(' ')

        cy.get('.itbms-password').as('password')
        cy.get('@password').type(' ')

        cy.get('.itbms-signin-button').as('signin') ;
        cy.get('@signin').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })        

    })
})
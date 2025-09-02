describe(`TC-FE-PBI21-MATCH-PASSWORD-2\n 
    Test Scenario : failed - password is incorrect.`, () => {

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

    it('should be enable the Sign In button after type email and password.',()=>{

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somchai@ad.sit.kmutt.ac.th')

        cy.get('.itbms-password').as('password')
        cy.get('@password').type('itbkk.somchai')

        cy.get('.itbms-signin-button').as('signin') ;
        cy.get('@signin').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })        

    })

    it('should sign in fail and should have status code 401.',()=>{
        cy.intercept('POST',`${baseAPI}/v2/users/**`,{
            statusCode: 401
        }).as('request')

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somchai@ad.sit.kmutt.ac.th')

        cy.get('.itbms-password').as('password')
        cy.get('@password').type('iitbkk.somchai')

        cy.get('.itbms-signin-button').as('signin') ;
        cy.get('@signin').click()

        cy.wait('@request').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(401)
        })

        cy.get('.itbms-message').contains('Email or Pasword is incorrect.')
    })
})
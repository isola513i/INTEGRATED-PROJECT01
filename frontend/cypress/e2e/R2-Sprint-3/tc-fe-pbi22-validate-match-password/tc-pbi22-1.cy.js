describe(`TC-FE-PBI22-VALIDATE-MATCH-PASSWORD-1\n 
    Test Scenario : normal - standard email format\n
                           - max-length email and password`, () => {

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

    it('should be enable the Sign In button after type max-length email and max-length password.',()=>{

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('max-email-validate-match-psswrd@ad.sit.kmutt.ac.th')

        cy.get('.itbms-password').as('password')
        cy.get('@password').type('Password2025**')

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
        cy.get('@email').type('max-email-validate-match-psswrd@ad.sit.kmutt.ac.th')

        cy.get('.itbms-password').as('password')
        cy.get('@password').type('Password2025**')

        cy.get('.itbms-signin-button').as('signin') ;
        cy.get('@signin').click()

        cy.wait('@request').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(401)
        })

        cy.get('.itbms-message').contains('Email or Pasword is incorrect.')
    })
})
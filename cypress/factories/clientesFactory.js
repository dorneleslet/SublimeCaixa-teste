import Chance from "chance";

const chance = new Chance()

Cypress.Commands.add('gerarClientes', () => {
    return {
        nome: chance.nome(),
        telefone: chance.phone({ formatted: false}),
        nif: chance.string({ length: 9, pool: "0123456789", numeric: true}),
        nascimento: chance.birthday({string: true, american:false}),
        email: chance.email()
    }
})
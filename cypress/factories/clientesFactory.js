import Chance from 'chance';

const chance = new Chance();

function formatoNasc(data) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0');
    const yyyy = data.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

export function gerarClientes() {
    const nascDate = chance.birthday({ type: 'adult' })
    return {
        nome: chance.name(),
        telefone: `+3519${chance.string({ length: 8, pool: "0123456789"})}`,
        nif: chance.string({ length: 9, pool: "0123456789"}),
        nascimento: formatoNasc(nascDate),
        email: `teste${chance.string({ length: 6, pool: "0123456789" })}@email.com`
    }
}
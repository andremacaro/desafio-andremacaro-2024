class RecintosZoo {
    constructor(id, bioma, tamanhoTotal) {
        this.id = id;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animais = [];
    }

    toString() {
        return `Recinto{tamanhoTotal=${this.tamanhoTotal}, bioma='${this.bioma}', id=${this.id}, animais=${JSON.stringify(this.animais)}}`;
    }

    espacoOcupado() {
        let espacoOcupado = 0;
        for (let animal of this.animais) {
            espacoOcupado += animal.tamanho * animal.quantidade;
        }
        return espacoOcupado;
    }

    especiesDiferentes(novoAnimal) {
        for (let animal of this.animais) {
            if (animal.especie === novoAnimal.especie) {
                return false;
            }
        }
        return true;
    }

    biomaAdequado(biomasPossiveis) {
        for (let biomaPossivel of biomasPossiveis) {
            if (this.bioma.includes(biomaPossivel)) {
                return true;
            }
        }
        return false;
    }

    carnivoroMesmaEspecie(especie) {
        for (let animal of this.animais) {
            if (animal.especie === especie && animal.isCarnivoro()) {
                return true;
            }
        }
        return false;
    }
    
    analisaRecintos(especie, quantidade) {
        let recintosViaveis = [];
        let erro = null;
    
        // Verificar se a espécie é válida
        let especieValida = animaisPossiveis.some(animal => animal.especie === especie);
        if (!especieValida) {
            erro = "Animal inválido";
            recintosViaveis = false;
            return { erro, recintosViaveis };
        }
    
        // Verificar se a quantidade é válida
        if (quantidade <= 0) {
            erro = "Quantidade inválida";
            recintosViaveis = false;
            //console.log(recintosViaveis);
            return { erro, recintosViaveis }
        }
    
        // Loop para descobrir o tamanho do animal que está sendo passado como parâmetro
        let novoAnimal = animaisPossiveis.find(animal => animal.especie === especie);
        if (!novoAnimal) {
            recintosViaveis.push("Animal não encontrado");
            console.log(recintosViaveis);
            return recintosViaveis;
        }
    
        let espacoReservado = novoAnimal.tamanho * quantidade;
    
        for (let recinto of recintos) {
            // Verifica se o bioma é adequado para o novo animal
            if (!recinto.biomaAdequado(novoAnimal.biomasPossiveis)) {
                continue;
            }
    
            // Verifica se hipopótamos podem habitar no mesmo recinto que outros animais
            if (especie === "HIPOPOTAMO" && recinto.animais.length > 0) {
                if (recinto.bioma !== "savana e rio") {
                    continue;
                }
            }
    
            // Verifica se o recinto possui pelo menos um animal para o macaco se sentir confortável
            if (especie === "MACACO" && recinto.animais.length === 0 && quantidade < 2) {
                continue;
            }
    
            // Verifica se há carnívoros no recinto
            let temCarnivorosNoRecinto = recinto.animais.some(animal => animal.isCarnivoro());
            if (!novoAnimal.isCarnivoro() && temCarnivorosNoRecinto) {
                continue;
            }
    
            // Impede que carnívoros de diferentes espécies habitem o mesmo recinto
            if (novoAnimal.isCarnivoro() && !recinto.carnivoroMesmaEspecie(especie) && recinto.animais.length > 0) {
                continue;
            }
    
            let espacoDisponivel = calculaEspacoDisponivel(recinto, novoAnimal);
            if (espacoDisponivel >= espacoReservado) {
                recintosViaveis.push(`Recinto ${recinto.id} (espaço livre: ${espacoDisponivel - espacoReservado} total: ${recinto.tamanhoTotal})`);
            }
        }
    
        if (recintosViaveis.length === 0) {
            erro = "Não há recinto viável"
            recintosViaveis = false;
            return {erro, recintosViaveis}
        }
    
        return { erro, recintosViaveis };
    }


}

class Animal {
    constructor(especie, tamanho, biomasPossiveis, quantidade = 0) {
        this.especie = especie;
        this.tamanho = tamanho;
        this.biomasPossiveis = biomasPossiveis;
        this.quantidade = quantidade;
    }

    toString() {
        return `Animal{especie='${this.especie}', tamanho=${this.tamanho}, biomasPossiveis=${JSON.stringify(this.biomasPossiveis)}}`;
    }

    isCarnivoro() {
        return ["LEAO", "CROCODILO", "LEOPARDO"].includes(this.especie);
    }
}

const recintos = [];
const animaisPossiveis = [];

// Inicializando os recintos e adicionando os animais
recintos.push(new RecintosZoo(1, "savana", 10));
recintos.push(new RecintosZoo(2, "floresta", 5));
recintos.push(new RecintosZoo(3, "savana e rio", 7));
recintos.push(new RecintosZoo(4, "rio", 8));
recintos.push(new RecintosZoo(5, "savana", 9));

function adicionarAnimais(recinto, animal) {
    for (let i = 0; i < animal.quantidade; i++) {
        recinto.animais.push(new Animal(animal.especie, animal.tamanho, animal.biomasPossiveis, 1));
    }
}

adicionarAnimais(recintos[0], new Animal("MACACO", 1, ["savana", "floresta"], 3));
adicionarAnimais(recintos[2], new Animal("GAZELA", 2, ["savana"], 1));
adicionarAnimais(recintos[4], new Animal("LEAO", 3, ["savana"], 1));

// Inicializando a lista de animais pré-estabelecidos
animaisPossiveis.push(new Animal("LEAO", 3, ["savana"]));
animaisPossiveis.push(new Animal("LEOPARDO", 2, ["savana"]));
animaisPossiveis.push(new Animal("CROCODILO", 3, ["rio"]));
animaisPossiveis.push(new Animal("MACACO", 1, ["savana", "floresta"]));
animaisPossiveis.push(new Animal("GAZELA", 2, ["savana"]));
animaisPossiveis.push(new Animal("HIPOPOTAMO", 4, ["savana", "rio"]));

function calculaEspacoDisponivel(recinto, novoAnimal) {
    let espacoOcupado = recinto.espacoOcupado();
    let especiesDiferentes = recinto.animais.length > 0 && recinto.especiesDiferentes(novoAnimal);

    if (especiesDiferentes) {
        espacoOcupado += 1;
    }
    return recinto.tamanhoTotal - espacoOcupado;
}

// Método Principal
const resultado = new RecintosZoo().analisaRecintos("HIPOPOTAMO", 1)
console.log(resultado)


export { RecintosZoo as RecintosZoo };
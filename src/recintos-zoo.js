class RecintosZoo {

    constructor() {
        // Definindo os recintos disponíveis
        this.recintos = [
          { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
          { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
          { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
          { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
          { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'leao', quantidade: 1 }] }
        ];
    
        // Definindo as características das espécies tratadas pelo zoológico
        this.animaisTratados = {
          leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
          leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
          crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
          macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
          gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
          hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
      }

    recintosViaveis = [];

    analisaRecintos(animal, quantidade) {
        // Convertendo o nome do animal para minúsculas para evitar erros de comparação
        animal = animal.toLowerCase();

        // Validação do tipo de animal
        if (!this.animaisTratados[animal]) {
        return 'Animal inválido';
        }

        // Validação da quantidade de animais
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return 'Quantidade inválida';
        }

        const { tamanho, biomas, carnivoro } = this.animaisTratados[animal];

        // Lista para armazenar os recintos viáveis
        const recintosViaveis = [];

        // Verificando cada recinto
        this.recintos.forEach((recinto) => {
            const biomaRecinto = recinto.bioma.split(' e '); // Bioma pode ser composto por dois (savana e rio)
            const espacoOcupado = this.calcularEspacoOcupado(recinto);
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;
            let animaisDiferentes = 0;
            
            recinto.animais.forEach(a => {
                if (a.especie !== animal) animaisDiferentes = 1;
            })

            const espacoNecessario = tamanho * quantidade + animaisDiferentes; // Se houver animais diferentes, precisa de 1 espaço extra

            // Verifica se o bioma é compatível e se há espaço suficiente
            const biomaCompativel = biomas.some(bioma => biomaRecinto.includes(bioma));

            // Verifica se o recinto é viável com base nas regras
            if (biomaCompativel && espacoDisponivel >= espacoNecessario) {
                const compatibilidadeAnimais = this.verificarCompatibilidade(recinto, animal, carnivoro);

                if (compatibilidadeAnimais) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    espacoTotal: recinto.tamanhoTotal
                });
                }
            }
        });

        // Retornando os recintos viáveis ou uma mensagem de erro
        if (recintosViaveis.length > 0) {
        return recintosViaveis
            .sort((a, b) => a.numero - b.numero)
            .map(
            (r) => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`
            );
        } else {
        return 'Não há recinto viável';
        }
    }

    // Método para calcular o espaço ocupado em um recinto
    calcularEspacoOcupado(recinto) {
        let espacoOcupado = 0;
        recinto.animais.forEach((animal) => {
        const especieInfo = this.animaisTratados[animal.especie];
        if (especieInfo) {
            espacoOcupado += especieInfo.tamanho * animal.quantidade;
        }
        });
        return espacoOcupado;
    }

    verificarCompatibilidade(recinto, novoAnimal, novoAnimalCarnivoro) {
        for (const animal of recinto.animais) {
          const especieInfo = this.animaisTratados[animal.especie];
          if (!especieInfo) return false; // Caso a espécie não seja tratada, não é compatível
    
          // Carnívoros só podem estar com a própria espécie
          if (especieInfo.carnivoro || novoAnimalCarnivoro) {
            if (animal.especie !== novoAnimal) return false;
          }
        }
    
        // Regra especial para hipopótamos
        if (novoAnimal === 'hipopotamo' && recinto.bioma !== 'savana e rio') {
          return false;
        }
    
        return true;
      }
}

export { RecintosZoo as RecintosZoo };

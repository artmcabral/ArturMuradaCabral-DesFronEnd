import { carregarTarefas } from "./api.js";

export const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "prazo-asc",
    carregamento: "carregando",
    erro: null
};

export async function iniciar() {
    estado.carregamento = "carregando";
    estado.erro = null;

    try {
        const tarefas = await carregarTarefas();

        estado.tarefas = tarefas;
        estado.carregamento = "sucesso";

    } catch (erro) {
        estado.carregamento = "erro";
        estado.erro = erro;
    }
}

iniciar();
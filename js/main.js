import { carregarTarefas } from "./api.js";
import { derivarTarefas } from "./derivacao.js";
import { renderizarTarefas } from "./renderizacao.js";
import { renderizarEstado } from "./estados.js";

export const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "prazo-asc",
    carregamento: "carregando",
    erro: null
};

function atualizarInterface() {
    const tarefasVisiveis = derivarTarefas(estado);

    if (estado.carregamento === "carregando") {
        renderizarEstado("carregando");
        return;
    }

    if (estado.carregamento === "erro") {
        if (estado.erro.message === "Formato inválido") {
            renderizarEstado(
                "erro",
                "Não foi possível carregar as tarefas porque o arquivo possui um formato inválido."
            );
        } else {
            renderizarEstado(
                "erro",
                "Não foi possível carregar as tarefas."
            );
        }

        return;
    }

    if (estado.tarefas.length === 0) {
        renderizarEstado(
            "vazio",
            "Não há tarefas cadastradas."
        );

        renderizarTarefas([]);
        return;
    }

    renderizarTarefas(tarefasVisiveis);

    if (tarefasVisiveis.length === 0) {
        renderizarEstado(
            "sucesso",
            "Nenhuma tarefa encontrada para os filtros selecionados."
        );

        return;
    }

    renderizarEstado(
        "sucesso",
        `${tarefasVisiveis.length} de ${estado.tarefas.length} tarefas.`
    );
}

function configurarControles() {
    const busca = document.querySelector("#busca");
    const status = document.querySelectorAll('input[name="status"]');
    const prioridades = document.querySelectorAll('input[name="prioridade"]');
    const ordenacao = document.querySelector("#ordenacao");
    const limpar = document.querySelector("#limpar-filtros");

    busca.addEventListener("input", () => {
        estado.busca = busca.value;
        atualizarInterface();
    });

    status.forEach(opcao => {
        opcao.addEventListener("change", () => {
            if (opcao.checked) {
                estado.status = opcao.value;
                atualizarInterface();
            }
        });
    });

    prioridades.forEach(opcao => {
        opcao.addEventListener("change", () => {
            if (opcao.checked) {
                estado.prioridade = opcao.value;
                atualizarInterface();
            }
        });
    });

    ordenacao.addEventListener("change", () => {
        estado.ordenacao = ordenacao.value;
        atualizarInterface();
    });

    limpar.addEventListener("click", () => {
        estado.busca = "";
        estado.status = "todos";
        estado.prioridade = "todas";
        estado.ordenacao = "prazo-asc";

        busca.value = "";

        document.querySelector("#status-todos").checked = true;
        document.querySelector("#prioridade-todas").checked = true;

        ordenacao.value = "prazo-asc";

        atualizarInterface();
    });
}

export async function iniciar() {
    configurarControles();

    atualizarInterface();

    try {
        const tarefas = await carregarTarefas();

        estado.tarefas = tarefas;
        estado.carregamento = "sucesso";

    } catch (erro) {
        estado.carregamento = "erro";
        estado.erro = erro;
    }

    atualizarInterface();
}

iniciar();
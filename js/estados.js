import { renderizarTarefas } from "./renderizacao.js";

export function renderizarEstado(estado, dados) {
    const quadro = document.querySelector(".quadro-tarefas");
    const regiaoStatus = document.querySelector("[data-estado]");

    if (estado === "carregando") {
        regiaoStatus.textContent = "Carregando tarefas...";
        return;
    }

    if (estado === "sucesso") {
        regiaoStatus.textContent = `${dados.length} tarefas carregadas.`;
        renderizarTarefas(dados, quadro);
        return;
    }

    if (estado === "vazio") {
        regiaoStatus.textContent = "Não há tarefas cadastradas.";
        return;
    }

    if (estado === "erro") {
        regiaoStatus.textContent = dados;
    }
}
export function renderizarEstado(estado, mensagem) {
    const regiaoStatus = document.querySelector("[data-estado]");

    if (estado === "carregando") {
        regiaoStatus.textContent = "Carregando tarefas...";
        return;
    }

    if (estado === "erro") {
        regiaoStatus.textContent = mensagem;
        return;
    }

    if (estado === "vazio") {
        regiaoStatus.textContent = "Não há tarefas cadastradas.";
        return;
    }

    regiaoStatus.textContent = mensagem;
}
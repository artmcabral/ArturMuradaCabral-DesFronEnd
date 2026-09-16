export function renderizarTarefas(tarefas) {
    const listas = document.querySelectorAll("[data-lista]");

    listas.forEach(lista => {
        lista.innerHTML = "";
    });

    tarefas.forEach(tarefa => {
        const lista = document.querySelector(
            `[data-lista="${tarefa.status}"]`
        );

        if (!lista) {
            return;
        }

        const item = document.createElement("li");

        item.innerHTML = `
            <article>
                <h4>${tarefa.titulo}</h4>
                <p>Prioridade: ${tarefa.prioridade}</p>
                <p>Prazo: ${tarefa.prazo}</p>
            </article>
        `;

        lista.appendChild(item);
    });
}
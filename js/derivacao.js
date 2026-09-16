export function derivarTarefas(estado) {
    let tarefas = [...estado.tarefas];

    if (estado.busca.trim() !== "") {
        const termo = estado.busca.trim().toLowerCase();

        tarefas = tarefas.filter(tarefa =>
            tarefa.titulo.toLowerCase().includes(termo)
        );
    }

    if (estado.status !== "todos") {
        tarefas = tarefas.filter(tarefa =>
            tarefa.status === estado.status
        );
    }

    if (estado.prioridade !== "todas") {
        tarefas = tarefas.filter(tarefa =>
            tarefa.prioridade === estado.prioridade
        );
    }

    if (estado.ordenacao === "prazo-asc") {
        tarefas.sort((a, b) => {
            const dataA = a.prazo.split("/").reverse().join("-");
            const dataB = b.prazo.split("/").reverse().join("-");

            return dataA.localeCompare(dataB);
        });
    }

    if (estado.ordenacao === "prazo-desc") {
        tarefas.sort((a, b) => {
            const dataA = a.prazo.split("/").reverse().join("-");
            const dataB = b.prazo.split("/").reverse().join("-");

            return dataB.localeCompare(dataA);
        });
    }

    return tarefas;
}
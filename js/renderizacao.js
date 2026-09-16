function converterData(data) {

    const partes = data.split("/");

    if (partes.length !== 3) {
        return null;
    }

    return new Date(
        Number(partes[2]),
        Number(partes[1]) - 1,
        Number(partes[0])
    );
}


function tarefaEstaAtrasada(tarefa) {

    /*
     * Tarefas concluídas nunca são consideradas atrasadas.
     */

    if (tarefa.status === "concluida") {
        return false;
    }


    const prazo = converterData(tarefa.prazo);


    if (!prazo) {
        return false;
    }


    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    prazo.setHours(0, 0, 0, 0);


    return prazo < hoje;
}


function textoPrioridade(prioridade) {

    const prioridades = {

        alta: "Alta",

        media: "Média",

        baixa: "Baixa"

    };


    return prioridades[prioridade] || prioridade;
}


function textoStatus(status) {

    const statusTexto = {

        a_fazer: "A fazer",

        em_andamento: "Em andamento",

        em_revisao: "Em revisão",

        concluida: "Concluída"

    };


    return statusTexto[status] || status;
}


export function renderizarTarefas(tarefas) {

    const listas =
        document.querySelectorAll("[data-lista]");


    /*
     * Limpa todas as colunas antes de renderizar novamente.
     */

    listas.forEach(lista => {

        lista.innerHTML = "";

    });


    /*
     * Renderiza cada tarefa.
     */

    tarefas.forEach(tarefa => {


        const lista =
            document.querySelector(
                `[data-lista="${tarefa.status}"]`
            );


        if (!lista) {
            return;
        }


        const item =
            document.createElement("li");


        const atrasada =
            tarefaEstaAtrasada(tarefa);


        const prioridadeClasse =
            `prioridade-${tarefa.prioridade}`;


        /*
         * Adiciona uma classe ao item caso esteja atrasado.
         */

        if (atrasada) {

            item.classList.add(
                "item-atrasado"
            );

        }


        item.innerHTML = `

            <article
                class="
                    cartao-tarefa
                    ${atrasada ? "tarefa-atrasada" : ""}
                    ${prioridadeClasse}
                "
            >

                <div class="cartao-decoracao">
                    ${atrasada ? "⚠" : "✦"}
                </div>


                <h4>
                    ${tarefa.titulo}
                </h4>


                <div class="informacoes-tarefa">

                    <p>

                        <span>
                            Prioridade
                        </span>

                        <strong>
                            ${textoPrioridade(tarefa.prioridade)}
                        </strong>

                    </p>


                    <p>

                        <span>
                            Status
                        </span>

                        <strong>
                            ${textoStatus(tarefa.status)}
                        </strong>

                    </p>


                    <p>

                        <span>
                            Prazo
                        </span>

                        <strong>
                            ${tarefa.prazo}
                        </strong>

                    </p>

                </div>


                ${
                    atrasada

                    ?

                    `
                    <span class="badge-atrasada">
                        ⚠ TAREFA ATRASADA
                    </span>
                    `

                    :

                    `
                    <span class="badge-em-dia">
                        ✓ EM DIA
                    </span>
                    `
                }

            </article>

        `;


        lista.appendChild(item);

    });
}
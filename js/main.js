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


/* =====================================================
   SISTEMA DO MASCOTE
   ===================================================== */

function converterData(data) {
    const partes = data.split("/");

    if (partes.length !== 3) {
        return null;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    return new Date(ano, mes, dia);
}


function calcularTarefasAtrasadas(tarefas) {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    return tarefas.filter(tarefa => {

        // Tarefas concluídas não são consideradas atrasadas
        if (tarefa.status === "concluida") {
            return false;
        }

        const prazo = converterData(tarefa.prazo);

        if (!prazo) {
            return false;
        }

        prazo.setHours(0, 0, 0, 0);

        return prazo < hoje;
    });
}


function atualizarMascote(tarefas) {

    const personagens = document.querySelector("#personagens");
    const bill = document.querySelector("#bill");

    const mensagem = document.querySelector("#mensagem-mascote");
    const nivel = document.querySelector("#nivel-mascote");
    const contador = document.querySelector("#contador-atrasadas");

    if (!personagens || !bill) {
        return;
    }

    const atrasadas = calcularTarefasAtrasadas(tarefas);
    const quantidade = atrasadas.length;

    contador.textContent = quantidade;

    /*
        Progressão:

        0       → Normal
        1-2     → Preocupados
        3-4     → Cansados
        5-6     → Muito cansados
        7       → Bill aparece
        8+      → Bill domina
    */

    let imagem;
    let titulo;
    let texto;
    let classe;

    if (quantidade === 0) {

        imagem = "./imagens/personagens_normal.png";

        titulo = "TUDO EM DIA";

        texto =
            "Tudo em dia! Dipper e Mabel estão animados. " +
            "Continue assim!";

        classe = "estado-normal";

        bill.classList.remove(
            "bill-aparecendo",
            "bill-dominando"
        );

    } else if (quantidade <= 2) {

        imagem = "./imagens/personagens_1_2.png";

        titulo = "1–2 ATRASADAS";

        texto =
            "Dipper e Mabel estão começando a ficar preocupados... " +
            "Ainda dá tempo de colocar tudo em ordem.";

        classe = "estado-preocupado";

        bill.classList.remove(
            "bill-aparecendo",
            "bill-dominando"
        );

    } else if (quantidade <= 4) {

        imagem = "./imagens/personagens_3_4.png";

        titulo = "3–4 ATRASADAS";

        texto =
            "As tarefas estão se acumulando! " +
            "Dipper e Mabel já estão ficando cansados.";

        classe = "estado-cansado";

        bill.classList.remove(
            "bill-aparecendo",
            "bill-dominando"
        );

    } else if (quantidade <= 6) {

        imagem = "./imagens/personagens_5_plus.png";

        titulo = "5–6 ATRASADAS";

        texto =
            "Dipper e Mabel estão no limite. " +
            "Você precisa recuperar o controle da situação!";

        classe = "estado-estressado";

        bill.classList.remove(
            "bill-aparecendo",
            "bill-dominando"
        );

    } else if (quantidade === 7) {

        imagem = "./imagens/personagens_bill.png";

        titulo = "BILL APARECEU";

        texto =
            "Uh-oh... Bill Cipher está começando a aparecer. " +
            "O caos está se aproximando.";

        classe = "estado-bill";

        bill.classList.add("bill-aparecendo");
        bill.classList.remove("bill-dominando");

    } else {

        imagem = "./imagens/personagens_dominados.png";

        titulo = "MUITAS ATRASADAS";

        texto =
            "Você deixou o caos tomar conta. " +
            "Bill Cipher assumiu o controle!";

        classe = "estado-dominado";

        bill.classList.add("bill-dominando");
    }

    personagens.src = imagem;

    nivel.textContent = titulo;

    mensagem.textContent = texto;

    const mascote = document.querySelector(".mascote");

    mascote.classList.remove(
        "estado-normal",
        "estado-preocupado",
        "estado-cansado",
        "estado-estressado",
        "estado-bill",
        "estado-dominado"
    );

    mascote.classList.add(classe);
}


/* =====================================================
   ATUALIZAÇÃO DA INTERFACE
   ===================================================== */

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

        atualizarMascote([]);

        return;
    }

    renderizarTarefas(tarefasVisiveis);

    atualizarMascote(estado.tarefas);

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


/* =====================================================
   CONTROLES
   ===================================================== */

function configurarControles() {

    const busca = document.querySelector("#busca");

    const status =
        document.querySelectorAll('input[name="status"]');

    const prioridades =
        document.querySelectorAll('input[name="prioridade"]');

    const ordenacao =
        document.querySelector("#ordenacao");

    const limpar =
        document.querySelector("#limpar-filtros");


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


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

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
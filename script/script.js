const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function loadItens() {
    itens = getItensBD()
    tbody.innerHTML = ''
    itens.forEach((item, index) => {
        insertItem(item, index)
    });
} // executada assim que a tela fo carregada; pega os itens do banco e faz um for em cada dado pra que seja criado em cada linha atravez do insertItem

function insertItem(item, index) {
    let tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.funcao}</td>
        <td>${item.salario}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class="bx bx-trash"></i></button>
        </td>
    `
    tbody.appendChild(tr)
}

function editItem(index) {
    openModal(true, index)
}

function deleteItem(index) {
    if (window.confirm('Você está prestes a apagar estes dados. Essa ação é irreversível. Tem certeza? ')) {
        itens.splice(index, 1) //splice removendo 1 item
        setItensBD() //atualiza o banco com o array atualizado
        loadItens() //carrega novamente os dados em tela 
    }
}

function deleteAll() {
    if (window.confirm('Você está prestes a deletar TODOS os dados. Essa ação é irreversível. Tem certeza?')) {
        deleteBD()
        loadItens() //carrega novamente os dados em tela 
    }
}

function openModal(edit = false, index = 0) {
    modal.classList.add('active') //modal fica visível

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
        }
    } // clique fora da modal, remove o active e fecha

    if (edit) {  //item de edição carrega com os valores ja existentes do funcionario
        sNome.value = itens[index].nome
        sFuncao.value = itens[index].funcao
        sSalario.value = itens[index].salario
        id = index
    } else { //caso nao seja edição, carrega vazio para adiconar os dados
        sNome.value = ''
        sFuncao.value = ''
        sSalario.value = ''
    }
}

btnSalvar.onclick = e => {
    if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
        return
    } //validação caso campo esteja vazio

    e.preventDefault()

    if (id !== undefined) {  // diferente de undefined = vir de uma edição
        //atualiza valores da tela no id selecionado
        itens[id].nome = sNome.value
        itens[id].funcao = sFuncao.value
        itens[id].salario = sSalario.value
    } else { //caso contrário, dará um push incluindo um novo item no banco
        itens.push({ 'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value })
    }

    setItensBD() // apos isso, atualiza o banco, seja edição ou inclusao

    modal.classList.remove('active') // fecha modal
    loadItens() //atualiza a tela com os novos dados
    id = undefined // seta id como undefined
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [] //pega itens do banco com getItem do banco dbfunc, caso não tiver nada, retorna um array vazio
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens)) // essa função seta os itens da variavel 'itens' pra dentro do banco selecionado (dbfunc)
const deleteBD = () => localStorage.removeItem('dbfunc') //exclui a key selecionada

loadItens()
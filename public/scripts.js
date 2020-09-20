const currentPage = window.location.pathname                    /* Pega a posição atual da página */
const menuItems = document.querySelectorAll("header .links a")  /*Pega cada item do menu */

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

/* O INCLUDE verifica se algum termo de uma String existe e retorna True or False
    Ex: "instructors/2".include("instructors") = True
        "instructors/2".include("2") = True
        "instructors/2".include("k") = False
*/


// FUNÇÃO PARA CRIAR A LÓGICA DA PAGINAÇÃO
function paginate(selectedPage, totalPages){
    
    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++){

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pageAfterSelectedPage = currentPage <= selectedPage + 2
        const pageBeforeSelectedPage = currentPage >= selectedPage - 2

        if(firstAndLastPage || pageAfterSelectedPage && pageBeforeSelectedPage){

            if(oldPage && currentPage - oldPage > 2){
                pages.push('...')
            }

            if(oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)
            oldPage = currentPage
        }
        
    }

    return pages
}

// FUNÇÃO PARA MOSTRAR A PAGINAÇÃO EM TELA
function createPagination(pagination){
    const filter = pagination.dataset.filter    // Estamos acessando o data-filter do FrontEnd e pegando as info do req.query
    const page = +pagination.dataset.page       // Esse + é uma conversão para Number
    const total = +pagination.dataset.total 
    const pages = paginate(page, total)         
    
    let elements = ""
    
        for (let page of pages){
    
            if(String(page).includes('...')){
                elements += `<span>${page}</span>`
            }else{
                if(filter){
                    elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
                }else{
                    elements += `<a href="?page=${page}">${page}</a>`
                }
    
            }
    
        }
    
    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")    // Estamos acessando a div Pagination

if(pagination){
    createPagination(pagination)
}
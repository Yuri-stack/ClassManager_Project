const currentPage = window.location.pathname                    /* Pega a posição atual da página */
const menuItems = document.querySelectorAll("header .links a")  /*Pega cada item do menu */
console.log(currentPage)

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
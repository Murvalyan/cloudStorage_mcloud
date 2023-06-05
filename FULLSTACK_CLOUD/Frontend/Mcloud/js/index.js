const burger = document.querySelector('.burger')
const menu = document.querySelector('.menu')
const header = document.querySelector('.header')
const body = document.querySelector('body')

burger.addEventListener('click', (e) => {
    burger.classList.toggle('_active')
    menu.classList.toggle('_active')
    body.classList.toggle('_lock')
    header.classList.toggle('_nt')
})
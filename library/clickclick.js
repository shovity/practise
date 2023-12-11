document.addEventListener('DOMContentLoaded', () => {
    const add = () => {
        const char = document.createElement('div')
        const top = util.random(100, window.innerHeight - 150)
        const left = util.random(100, window.innerWidth - 150)
        const opacity = util.random(0.3, 1)
        const size = util.random(20, 200)
        char.style = `top: ${top}px; left: ${left}px; opacity: ${opacity}; width: ${size}px; height: ${size}px`
        
        window.container.appendChild(char)
    }

    window.addEventListener('click', ({ target }) => {
        if (target.tagName === 'DIV') {
            store.score++
            window.container.removeChild(target)
            add()
        } else {
            store.score--
        }
    })

    store.score = 0
    
    for (let i = 0; i < (+window.query.n || 1); i++) {
        add()
    }
})
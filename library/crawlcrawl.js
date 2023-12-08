document.addEventListener('DOMContentLoaded', () => {
    const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
    const map = {}

    const add = () => {
        const char = document.createElement('div')
        const top = util.random(100, window.innerHeight - 150)
        const left = util.random(100, window.innerWidth - 150)
        const opacity = util.random(0.5, 1)
        const size = util.random(64, 128)

        char.className = 'char'
        char.style = `top: ${top}px; left: ${left}px; opacity: ${opacity}; font-size: ${size}px`
        
        let content = keys.sample()
        
        while (map[content]) {
            content = keys.sample()
        }
        
        char.innerText = content
        map[content] = char

        window.container.appendChild(char)
    }

    const start = async () => {
        store.score = 0

        for (let i = 0; i < 3; i++) {
            add()
        }
    }

    window.addEventListener('keydown', ({ key }) => {
        key = key.toUpperCase()
        
        if (map[key]) {
            window.container.removeChild(map[key])
            map[key] = null
            store.score++
            add()
        } else if (keys.includes(key)) {
            store.score--
        }
    })

    start()
})
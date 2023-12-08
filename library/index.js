/**
 * Util
 */
window.util = {}

util.sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

util.random = (start, end) => {
    return Math.random() * (end - start) + start
}

util.debounce = (wait = 200) => {
    const instance = {
        timeout: null,
    }

    instance.execute = (handle, ...args) => {
        clearTimeout(instance.timeout)
        instance.timeout = setTimeout(handle, wait, ...args)
    }

    return instance
}

/**
 * Event
 */
window.event = {
    pool: {},
}

event.emit = (name, ...payload) => {
    for (const handle of event.pool[name] ?? []) {
        handle(...payload)
    }
}

event.on = (name, handle) => {
    event.pool[name]?.push(handle) || (event.pool[name] = [handle])
}

window.store = new Proxy(
    {
        state: Object.create(null),

        init() {
            for (const name of ['change', 'keyup']) {
                window.addEventListener(name, ({ target }) => {
                    const key = target.getAttribute('store-bind')
    
                    if (!key) {
                        return
                    }
    
                    if (target.type === 'checkbox') {
                        window.store[key] = target.checked
                    } else if (target.type === 'radio') {
                        window.store[key] = target.name
                    } else {
                        window.store[key] = target.value
                    }
                })
            }
        }
    },
    {
        get(target, key) {
            return key === 'origin' ? target : target.state[key]
        },

        set(target, key, value) {
            for (const dom of document.querySelectorAll(`[store-bind="${key}"]`)) {
                switch (dom.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                    case 'SELECT':
                        if (dom.type === 'checkbox' || dom.type === 'radio') {
                            dom.checked = value
                            break
                        }

                        dom.value = value
                        break
                
                    default:
                        dom.innerHTML = value
                }
            }
        
            target.state[key] = value
            return true
        }
    },
)

/**
 * Prototy
 */
Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)]
}

store.origin.init()

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

        watch() {
            
        }
    },
    {
        get(target, key) {
            return key === 'origin' ? target : target.state[key]
        },

        set(target, key, value) {
            for (const dom of document.querySelectorAll(`[store-bind="${key}"]`)) {
                const tagName = dom.tagName
        
                if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(tagName) !== -1) {
                    if (dom.type === 'checkbox' || dom.type === 'radio') {
                        dom.checked = value
                    } else {
                        dom.value = value
                    }
                } else if (tagName === 'IMG') {
                    dom.src = value
                } else {
                    dom.innerHTML = value
                }
            }
        
            const oldValue = target.state[key]
            target.state[key] = value
            event.emit('store_setted', { key, value, oldValue })
        
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

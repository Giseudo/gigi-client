const typewriteAnimation = (el, binding) => {
  const { value } = binding
  const { complete, text } = value

  el.innerHTML = ''

  let i = 0

  const animate = () => {
    if (i >= text.length)
      return complete()

    el.innerHTML += text.charAt(i)
    el.timer = setTimeout(animate, 50)

    i++
  }

  animate()
}

export const typewrite = {
  mounted (el, binding) {
    typewriteAnimation(el, binding)
  },

  updated (el, binding) {
    const { value, oldValue } = binding
    const { complete, skip, text } = value

    if (skip) {
      el.innerHTML = text
      clearTimeout(el.timer)

      return complete()
    }

    if (text !== oldValue.text)
      return typewriteAnimation(el, binding)
  },
}

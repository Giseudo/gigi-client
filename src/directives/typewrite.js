const typewriteAnimation = (el, binding) => {
  const { value } = binding
  const { complete, text } = value
  const t = el

  var HTML = text

  t.innerHTML = ""

  var cursorPosition = 0,
    tag = "",
    tagEl = "",
    writingTag = false,
    tagOpen = false,
    typeSpeed = 30,
    tempTypeSpeed = 0

  const animate = function() {
    if (writingTag === true) {
      tag += HTML[cursorPosition]
    }

    if (HTML[cursorPosition] === "<") {
      tempTypeSpeed = 0
      if (tagOpen) {
        tagOpen = false
        writingTag = true
      } else {
        const [ first ] = HTML.substr(cursorPosition + 1).split('>')

        tag = ""
        tagEl = first?.replace('/', '').replace(' ', '') || 'span'
        tagOpen = true
        writingTag = true
        tag += HTML[cursorPosition]
      }
    }

    if (!writingTag && tagOpen) {
      tag.innerHTML += HTML[cursorPosition]
    }

    if (!writingTag && !tagOpen) {
      if (HTML[cursorPosition] === " ") {
        tempTypeSpeed = 0
      }
      else {
        tempTypeSpeed = (Math.random() * typeSpeed) + 50
      }
      t.innerHTML += HTML[cursorPosition]
    }

    if (writingTag === true && HTML[cursorPosition] === ">") {
      tempTypeSpeed = (Math.random() * typeSpeed) + 50
      writingTag = false

      if (tagOpen) {
        var newSpan = document.createElement(tagEl)
        t.appendChild(newSpan)
        tag = newSpan

        if (tagEl === 'br')
          tagOpen = false
      }
    }

    cursorPosition += 1

    if (cursorPosition < HTML.length - 1) {
      el.timer = setTimeout(animate, tempTypeSpeed)
      return
    }

    complete()
  }

  animate()
}




/*const typewriteAnimation = (el, binding) => {
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
*/

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

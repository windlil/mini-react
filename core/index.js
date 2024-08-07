export const createTextNode = (text) => {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export const createElement = (type, props, ...children) => {  
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    }
  }
}

export const render = (el, container) => {
  const dom = el.type === 'TEXT_NODE' ? document.createTextNode("") : document.createElement(el.type)
  
  const a = []
  
  Object.keys(dom).forEach((key) => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })
  
  const children = el.props.children
  
  children.forEach((child) => {
    render(child, dom)
  })
  
  container.append(dom)
}

const React = {
  createRoot(container) {
    return {
      render(App) {
        render(App, container)
      }
    }
  }
}

export default React
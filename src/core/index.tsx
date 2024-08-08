interface Node {
  type: string,
  props: {
    children: Node[]
    [k: string]: any
  }
}

export const render = (node: Node, container: Element | Text) => {
  const el = node.type === 'TEXT_NODE' ? document.createTextNode(node.props.nodeValue) : document.createElement(node.type)

  Object.keys(node.props).forEach(key => {
    if (key !== 'children') {
      (el as any)[key] = node.props[key]
    }
  })

  if (typeof node.props.children !== 'string') {
    if (Array.isArray(node.props.children)) {
      node.props.children.forEach(child => render(child, el)) 
    } else {
      render(node.props.children, el)
    }
  } else {
    el.textContent = node.props.children
  }
  
  container.appendChild(el)
}

const React =  {
  createRoot(container: Element | null) {
    if (!container) return
    return {
      render(app: any) {
        render(app, container)
      }
    }
  }
}

export default React
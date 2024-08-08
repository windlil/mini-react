const enum NODE_TYPE {
  TEXT_NODE = "TEXT_NODE"
}

let nextWorkOfUnit: any = null
export const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop);

export const render = (el: any, container: Element | Text) => {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
}

const createDom = (work: any) => {
  return work.type === NODE_TYPE["TEXT_NODE"] ? document.createTextNode(work?.props?.children) : document.createElement(work.type)
}

const updateProps = (dom: any, props: any) => {
  if (!props) return
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

export const initChildren = (work: any) => {
  if (work.type === NODE_TYPE["TEXT_NODE"]) return

  const children = Array.isArray(work?.props?.children) ? work?.props?.children : [work?.props?.children]
  let prevChild: any = null

  const childrenIsString = typeof work?.props?.children === 'string'

  children.forEach((child: any, index: number) => {
    const network = {
      type: child?.type ?? NODE_TYPE["TEXT_NODE"],
      props: childrenIsString ? work.props: child.props,
      child: null,
      dom: null,
      parent: work,
      sibling: null
    }
    if (index === 0) {
      work.child = network
    } else {
      prevChild.sibling = network
    }
    prevChild = network
  })
}

const performWorkOfUnit = (work: any) => {
  if (!work.dom) {
    // 创建真实DOM并挂载
    const dom: any = (work.dom = createDom(work))
    work.parent.dom.appendChild(dom)

    // 处理props
    const props = work.props
    updateProps(dom, props)
  }

  // 将树结构转换为链表
  initChildren(work)
  if (work?.child) {
    return work.child
  } else if (work?.sibling) {
    return work.sibling
  }
  return getParentSibling(work)
}

const getParentSibling = (work: any) => {
  let current = work.parent
  while (current) {
    const sibling = current?.sibling
    if (sibling) {
      return sibling
    } else {
      current = current?.parent
    }
  }
  return null
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
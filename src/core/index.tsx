const enum NODE_TYPE {
  TEXT_NODE = "TEXT_NODE"
}

let nextWorkOfUnit: any = null

export const commitWork = (fiber: any) => {
  if (!fiber) return
  const parent = getParent(fiber)
  console.log(parent)
  parent.dom.append(fiber.dom)

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export const commitRoot = (fiber: any) => {
  commitWork(fiber)

  root = null
}

export const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && root) {
    commitRoot(root.child)
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

  root = nextWorkOfUnit
}

let root: any  = null

const createDom = (fiber: any) => {
  return fiber.type === NODE_TYPE["TEXT_NODE"] ? document.createTextNode(fiber?.props?.children) : document.createElement(fiber.type)
}

const updateProps = (dom: any, props: any) => {
  if (!props) return
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

export const getParent = (fiber: any) => {
  let parent = fiber?.parent

  while (!parent?.dom) {
    parent = parent?.parent
  }

  return parent
}

export const initChildren = (fiber: any, children: any[], isFunctionComponent: boolean) => {
  if (fiber.type === NODE_TYPE["TEXT_NODE"]) return

  let prevChild: any = null

  const childrenIsString = typeof fiber?.props?.children === 'string'

  children.forEach((child: any, index: number) => {

    const network = {
      type: child?.type ?? NODE_TYPE["TEXT_NODE"],
      props: childrenIsString ? fiber?.props: child?.props,
      child: null,
      dom: null,
      parent: fiber,
      sibling: null,
    }
    if (index === 0) {
      fiber.child = network
    } else {
      prevChild.sibling = network
    }
    prevChild = network
  })
}

export const isFunction = (value: unknown) => typeof value === 'function'

const performWorkOfUnit = (fiber: any) => {
  const isFunctionComponent = isFunction(fiber?.type)

  if (!fiber.dom && !isFunctionComponent) {
    // 创建真实DOM并挂载
    const dom: any = (fiber.dom = createDom(fiber))
    // fiber.parent.dom.appendChild(dom)

    // 处理props
    const props = fiber.props
    updateProps(dom, props)
  }
  // 将树结构转换为链表
  const children = isFunctionComponent ? [fiber.type()] : (Array.isArray(fiber.props.children) ? fiber.props.children : [fiber.props.children])

  initChildren(fiber, children, isFunctionComponent)
  

  if (fiber?.child) {
    return fiber.child
  } else if (fiber?.sibling) {
    return fiber.sibling
  }
  return getParentSibling(fiber)
}

const getParentSibling = (fiber: any) => {
  let current = fiber.parent
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
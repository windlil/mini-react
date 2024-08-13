const enum NODE_TYPE {
  TEXT_NODE = "TEXT_NODE"
}

let nextWorkOfUnit: any = null
let delects: any[] = []

export const createElement = (type: any, props: any, ...children: any) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child: any) => {
        const isTextNode =
        typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      })
    }
  }
}

export const createTextNode = (text: string | number, ...children: any) => {
  return {
    type: "TEXT_NODE",
    props: {
      nodeValue: text,
      children,
    },
  }
}

function commitDeletion(fiber: any) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

export const commitWork = (fiber: any) => {
  if (!fiber) return
  const parent = getParent(fiber)
  if (fiber?.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber?.alternate?.props)
  } else {
    parent.dom.append(fiber.dom ?? '')
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export const commitRoot = () => {
  delects.forEach(commitDeletion)
  commitWork(root.child)
  currentFiber = root
  delects = []
  root = null
}

export const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    if (root?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined
    }

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && root) {
    commitRoot()
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

export const update = () => {
  return () => {
    root = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = root
  }
}

let currentFiber: any = null
let root: any  = null

const createDom = (fiber: any) => {
  return fiber.type === NODE_TYPE["TEXT_NODE"] ? document.createTextNode('') : document.createElement(fiber.type)
}

const updateProps = (dom: any, netxProps: any, prevProps: any) => {
  Object.keys(prevProps).forEach((key: any) => {
    if (key !== 'children') {
      if (!(key in netxProps)) {
        (dom as HTMLElement).removeAttribute(key)
      }
    }
  })

  Object.keys(netxProps).forEach((key) => {
    if (key !== 'children') {
      if (netxProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLocaleLowerCase()
          dom.removeEventListener(eventName, prevProps[key])
          dom.addEventListener(eventName, netxProps[key])
        } else {
          if (key === 'nodeValue') {
            dom.textContent = netxProps[key]
            return
          } else {
            dom[key] = netxProps[key]    
          }
        }
      }
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

export const initChildren = (fiber: any, children: any[]) => {
  let oldFiber = fiber?.alternate?.child

  let prevChild: any = null

  children.forEach((child: any, index: number) => {

    const isSameType = oldFiber && oldFiber?.type === child?.type
    let newFiber: any

    if (isSameType) {
      newFiber = {
        type: child?.type,
        props: child.props,
        child: null,
        dom: oldFiber.dom,
        parent: fiber,
        sibling: null,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      if (child) {
        newFiber = {
          type: child?.type,
          props: child.props,
          child: null,
          dom: null,
          parent: fiber,
          sibling: null,
        }
      }
      if (oldFiber) {
        delects.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })

  while(oldFiber) {
    console.log(oldFiber)
    delects.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
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
    updateProps(dom, props, {})
  }
  // 将树结构转换为链表
  const children = isFunctionComponent ? [fiber.type(fiber?.props)] : fiber?.props?.children

  initChildren(fiber, children)
  

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
  },
  createElement,
  createTextNode,
  update
}

export default React
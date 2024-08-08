export const render = (app: any, container: Element) => {

}

const React =  {
  createRoot(container: Element) {
    return {
      render(app: any) {
        render(app, container)
      }
    }
  }
}

export default React
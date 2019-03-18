/**
 * not support trasition yet
 */
export default {
  bind (el, { value }, vnode) {
    const originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : (el.style.display || '')
    el.setStyle('display', value ? originalDisplay : 'none')
  },

  update (el, { value, oldValue }, vnode) {
    if (value === oldValue) return
    el.setStyle('display', value ? el.__vOriginalDisplay : 'none')
  },

  unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.setStyle('display', el.__vOriginalDisplay)
    }
  }
}

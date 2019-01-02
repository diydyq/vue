/* @flow */

import { isDef, isUndef, extend, toNumber } from 'shared/util'

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  let key, cur
  const elm = vnode.elm
  const oldProps = oldVnode.data.domProps || {}
  let props = vnode.data.domProps || {}
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props)
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm._attr[key] = ''
    }
  }
  for (key in props) {
    cur = props[key]

    if (key === 'value') {
      const strCur = isUndef(cur) ? '' : String(cur)
      elm._attr[key] = strCur
    } else {
      elm._attr[key] = cur
    }
  }
}

export default {
  create: updateDOMProps,
  update: updateDOMProps
}

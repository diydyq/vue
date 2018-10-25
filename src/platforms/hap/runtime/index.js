/* @flow */

import Vue from 'core/index'
import { patch } from 'hap/runtime/patch'
import { mountComponent } from 'core/instance/lifecycle'
import platformDirectives from 'hap/runtime/directives/index'
import platformComponents from 'hap/runtime/components/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isRuntimeComponent,
  isUnknownElement
} from 'hap/util/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isRuntimeComponent = isRuntimeComponent
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives and components
Vue.options.directives = platformDirectives
Vue.options.components = platformComponents

// install platform patch function
Vue.prototype.__patch__ = patch

// wrap mount
Vue.prototype.$mount = function (
  el?: any,
  hydrating?: boolean
): Component {
  const options = this.$options
  const { type = 'component' } = options
  const component = mountComponent(
    this,
    el && query(el, this.$document),
    hydrating
  )
  // 将页面与根VM链接
  if (type === 'page') {
    this.$connectVm2Page && this.$connectVm2Page()
    this.$registerPageLifecycle && this.$registerPageLifecycle()
  }

  return component
}

const _init = Vue.prototype._init

Vue.prototype._init = function (options) {
  const vm = this
  const $options = vm.constructor.options
  if ($options.type === 'page') {
    this.$connectLifecycle && this.$connectLifecycle($options)
  }
  _init.call(this, options)
}

Vue.prototype.$connectLifecycle = function (options) {
  // onReady 放到 Vue mounted钩子中执行
  const pageReadyHook = () => {
    this._ready = true
    const readyHook = options.onReady
    if (readyHook && typeof readyHook === 'function') {
      readyHook.call(this)
    }
  }
  options.mounted = options.mounted || []
  options.mounted = Array.isArray(options.mounted) ? options.mounted : [options.mounted]
  options.mounted.push(pageReadyHook)

  // onInit 放到 Vue 的beforeCreate钩子中执行
  const pageInitHook = () => {
    const initHook = options.onInit
    if (initHook && typeof initHook === 'function') {
      initHook.call(this)
    }
  }
  options.beforeCreate = options.beforeCreate || []
  options.beforeCreate = Array.isArray(options.beforeCreate) ? options.beforeCreate : [options.beforeCreate]
  options.beforeCreate.push(pageInitHook)

  // onDestroy 放到 Vue 的beforeDestroy钩子中执行
  const pageDestroyHook = () => {
    const destroyHook = options.onDestroy
    if (destroyHook && typeof destroyHook === 'function') {
      destroyHook.call(this)
    }
  }
  options.beforeDestroy = options.beforeDestroy || []
  options.beforeDestroy = Array.isArray(options.beforeDestroy) ? options.beforeDestroy : [options.beforeDestroy]
  options.beforeDestroy.push(pageDestroyHook)
}

export default Vue

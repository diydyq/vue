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

export default Vue

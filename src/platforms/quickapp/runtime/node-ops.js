/* globals document */
// document is injected by weex factory wrapper

export const namespaceMap = {}

export function createElement (tagName) {
  return document.createElement(tagName)
}

export function createElementNS (namespace, tagName) {
  return document.createElement(namespace + ':' + tagName)
}

export function createTextNode (text) {
  return document.createTextNode(text)
}

export function createComment (text) {
  return document.createComment(text)
}

export function insertBefore (node, target, before) {
  node.insertBefore(target, before)
}

// TODO 如果是文本的话，清空text的value
export function removeChild (node, child) {
  node.removeChild(child)
}

export function appendChild (node, child) {
  node.appendChild(child)
}

export function parentNode (node) {
  return node.parentNode
}

export function nextSibling (node) {
  return node.nextSibling
}

export function tagName (node) {
  return node.tagName
}

export function setTextContent (node, text) {
  node.parentNode.setAttr('value', text)
}

export function setAttribute (node, key, val) {
  node.setAttr(key, val)
}

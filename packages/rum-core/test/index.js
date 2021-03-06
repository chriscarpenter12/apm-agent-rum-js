/**
 * MIT License
 *
 * Copyright (c) 2017-present, Elasticsearch BV
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import { createServiceFactory as originalFactory } from '../src'

import { scheduleMacroTask } from '../src/common/utils'

export function createServiceFactory() {
  var serviceFactory = originalFactory()
  if (window.globalConfigs && window.globalConfigs.useMocks) {
    var apmServer = serviceFactory.getService('ApmServer')
    apmServer._makeHttpRequest = function() {
      return Promise.resolve()
    }
  }
  return serviceFactory
}

export function scheduleTaskCycles(callback, cycles = 0) {
  if (cycles > 0) {
    scheduleMacroTask(scheduleTaskCycles.bind(this, callback, cycles - 1))
  } else {
    callback()
  }
}

/**
 * Polyfilling the CustomEvent since they are available as objects
 * in IE 9-11
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
export function createCustomEvent(
  event,
  params = { bubbles: false, cancelable: false, detail: null }
) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(event, params)
  }

  const evt = document.createEvent('CustomEvent')
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
  return evt
}

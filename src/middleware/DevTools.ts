/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux, FluxAction} from 'arkhamjs';

export class DevTools {
  name: string = 'arkhamDevTools';
  mode: string = 'development';

  constructor(options) {
    // Methods
    this.postDispatch = this.postDispatch.bind(this);
    this.setMode = this.setMode.bind(this);

    // Set initial mode
    const {mode = 'development'} = options;
    this.setMode(mode);
  }

  get isActive(): boolean {
    return this.mode === 'development';
  }

  setMode(mode: string = 'development'): void {
    this.mode = mode;

    if(mode === 'development') {
      window.addEventListener('message', this.sendMethod);
    } else {
      window.removeEventListener('message', this.sendMethod);
    }
  }

  sendMethod(event): void {
    const {_arkhamMethod, _arkhamArgs} = event.data || {_arkhamMethod: '', _arkhamArgs: []};
    console.log('middleware::_arkhamMethod', _arkhamMethod);

    if(_arkhamMethod !== '') {
      Flux[_arkhamMethod](..._arkhamArgs);
    }
  }

  postDispatch(action, nextState): Promise<FluxAction> {
    if(!this.isActive) {
      window.postMessage({_arkhamAction: action, _arkhamState: nextState}, '*');
    }

    return Promise.resolve(action);
  }
}

import { subscribeKey as subKey } from 'valtio/utils'
import { proxy } from 'valtio/vanilla'
import type { CaipNetwork, Connector, WcWallet } from '../utils/TypeUtil.js'

// -- Types --------------------------------------------- //
export interface RouterControllerState {
  view:
    | 'Account'
    | 'Connect'
    | 'ConnectingExternal'
    | 'ConnectingWalletConnect'
    | 'ConnectingSiwe'
    | 'Networks'
    | 'SwitchNetwork'
    | 'AllWallets'
    | 'WhatIsAWallet'
    | 'WhatIsANetwork'
    | 'GetWallet'
    | 'Downloads'
  history: RouterControllerState['view'][]
  data?: {
    connector?: Connector
    wallet?: WcWallet
    network?: CaipNetwork
  }
}

// -- State --------------------------------------------- //
const state = proxy<RouterControllerState>({
  view: 'Connect',
  history: ['Connect']
})

type StateKey = keyof RouterControllerState

// -- Controller ---------------------------------------- //
export const RouterController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: RouterControllerState[K]) => void) {
    return subKey(state, key, callback)
  },

  push(view: RouterControllerState['view'], data?: RouterControllerState['data']) {
    if (view !== state.view) {
      state.view = view
      state.history.push(view)
      state.data = data
    }
  },

  reset(view: RouterControllerState['view']) {
    state.view = view
    state.history = [view]
  },

  replace(view: RouterControllerState['view']) {
    if (state.history.length > 1 && state.history.at(-1) !== view) {
      state.view = view
      state.history[state.history.length - 1] = view
    }
  },

  goBack() {
    if (state.history.length > 1) {
      state.history.pop()
      const [last] = state.history.slice(-1)
      if (last) {
        state.view = last
      }
    }
  }
}

/**
 * Created by championswimmer on 20/07/17.
 */
import { Store } from 'vuex'
import Vuex = require('vuex')
import Vue = require('vue')
import VuexPersistence, { MockStorage } from '../dist'
import { assert, expect, should } from 'chai'

Vue.use(Vuex)
const mockStorage = new MockStorage()
const vuexPersist = new VuexPersistence<any, any>({
  storage: mockStorage,
  reducer: (state) => ({ dog: state.dog }),
  filter: (mutation) => (mutation.type === 'dogBark')
})

const store = new Store<any>({
  state: {
    dog: {
      barks: 0
    },
    cat: {
      mews: 0
    }
  },
  mutations: {
    dogBark(state) {
      state.dog.barks++
    },
    catMew(state) {
      state.cat.mews++
    }
  },
  plugins: [vuexPersist.plugin]
})
const getSavedStore = () => JSON.parse(mockStorage.getItem('vuex'))

describe('Storage: MockStorage, Test: reducer, filter', () => {
  it('should persist reduced state', () => {
    store.commit('dogBark')
    expect(getSavedStore().dog.barks).to.equal(1)
  })
  it('should not persist non reduced state', () => {
    store.commit('catMew')
    //noinspection TsLint
    expect(getSavedStore().cat).to.be.undefined
  })
})

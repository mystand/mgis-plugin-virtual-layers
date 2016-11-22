import { takeEvery } from 'redux-saga'
import { select } from 'redux-saga/effects'

import { getMap } from 'core/frontend/plugin/api'
import { MAP_LOADED } from 'core/frontend/client/map/map-actions'
import * as MapHelper from 'core/frontend/helpers/map-helper'

// import { CARTOGRAM_SET, CARTOGRAM_CLEAR } from './actions'
import { buildCartogramLayerId, buildMapboxLayers } from './utils'
// import Popup from './components/popup/Popup'

const MAP_MODE_CARTOGRAMS = 'cartograms'
const POPUP_KEY = 'cartograms'

// function* cartogramSet(action) {
//   const map = getMap()
//   const { index } = action
//   const currentCartogramIndex = yield select(state => state.plugins.cartograms.enabledCartogramIndex)
//
//   map.pushMode(MAP_MODE_CARTOGRAMS)
//   if (currentCartogramIndex) map.setLayoutProperty(buildCartogramLayerId(currentCartogramIndex), 'visibility', 'none')
//   map.setLayoutProperty(buildCartogramLayerId(index), 'visibility', 'visible')
// }
//
// function* cartogramClear() {
//   const map = getMap()
//   const config = yield select(state => state.pluginConfigs.cartograms)
//
//   map.popMode(MAP_MODE_CARTOGRAMS)
//   map.removePopup(POPUP_KEY)
//   for (let i = 0; i < config.items.length; i += 1) {
//     map.setLayoutProperty(buildCartogramLayerId(i), 'visibility', 'none')
//   }
// }
//
// function onMapClick(e) {
//   const map = e.target
//   if (map.getMode() !== MAP_MODE_CARTOGRAMS) return
//
//   map.removePopup(POPUP_KEY)
//   const featureIds = MapHelper.queryRenderedFeatureIds(map, e.point)
//   if (featureIds.length > 0) map.addPopup(POPUP_KEY, e.lngLat, Popup, { featureIds })
// }

function* initializeLayers() {
  const map = getMap()
  const { layers, config } = yield select(state => ({
    layers: state.layers,
    config: state.pluginConfigs.virtualLayers
  }))

  buildMapboxLayers(layers, config).forEach(layer => console.log(layer) || map.addLayer(layer))
}

export default function* saga() {
  yield [
    takeEvery(MAP_LOADED, initializeLayers)
  ]
}

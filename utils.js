import R from 'ramda'

import { buildLayers } from 'core/shared/utils/map-style-utils'
import Feature from 'core/shared/models/feature'

const VIRTUAL_LAYER_ID_PREFIX = 'vl'

export function buildLayerId(sourceLayerId, index) {
  return `${VIRTUAL_LAYER_ID_PREFIX}-${index}-${sourceLayerId}`
}

export function buildMapboxLayers(layers, config) {
  return R.chainWithIndex((item, index) => {
    const sourceLayer = layers[item.sourceLayerKey]
    const mapboxFilters = item.filters.map(filter => [
      filter.operator,
      filter.property,
      Feature.castPropertyType(sourceLayer.attributes[filter.property], filter.value)
    ])

    return buildLayers(sourceLayer).map(mapboxLayer => R.dissoc('oid', {
      ...mapboxLayer,
      id: buildLayerId(mapboxLayer.id, index),
      layout: {
        visibility: 'none'
      },
      // filter: ['all', ...mapboxFilters]
    }))
  }, config.items)
}

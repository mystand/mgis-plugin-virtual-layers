import R from 'ramda'

export function isVirtualFeature(feature) {
  return feature.id.startsWith('vl-')
}

export function buildVirtualFeature(sourceFeature, item, index) {
  const id = buildVirtualFeatureId(index, sourceFeature.id)
  return {
    ...sourceFeature,
    id,
    properties: {
      ...sourceFeature.properties,
      layer_key: item.targetLayerKey
    }
  }
}

function buildVirtualFeatureId(index, sourceId) {
  return `vl-${index}-${sourceId}`
}

export function getAttributesFromBuildOptions(options) {
  const { values, fieldPath, directories: { layers } } = options
  const sourceLayerKeyFieldPath = [fieldPath[0], fieldPath[1], 'sourceLayerKey']
  const sourceLayerKeyValue = R.path(sourceLayerKeyFieldPath, values)

  if (R.isNil(sourceLayerKeyValue)) return []

  return R.find(x => x.key === sourceLayerKeyValue, layers).attributes
}

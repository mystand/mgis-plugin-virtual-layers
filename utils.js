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
      layer_key: buildVirtualLayerKey(index, item.sourceLayerKey)
    }
  }
}

function buildVirtualFeatureId(index, sourceId) {
  return `vl-${index}-${sourceId}`
}

export function buildVirtualLayerKey(index, sourceKey) {
  return `vl-${index}-${sourceKey}`
}

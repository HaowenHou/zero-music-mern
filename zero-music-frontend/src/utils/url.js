function formatImageUrl(asset) {
  if (asset.startsWith('http://') || asset.startsWith('https://') || asset.startsWith('data:')) {
    return asset;
  }
  return `${import.meta.env.VITE_SERVER_URL}${asset}`;
}

export { formatImageUrl };
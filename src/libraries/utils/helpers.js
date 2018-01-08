const humanFileSize = (bytes) => {
  if (!bytes) return null;

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${((bytes / (1024 ** i)).toFixed(2) * 1)} ${['B', 'kB', 'MB', 'GB', 'TB', 'PB'][i]}`;
};

const BToMB = (bytes) => {
  if (!bytes) return null;

  return (bytes / 1024 / 1024).toFixed(2);
};

const MBToB = (bytes) => {
  if (!bytes) return null;

  return (bytes * 1024 * 1024);
};

export {
  BToMB,
  MBToB,
  humanFileSize
};

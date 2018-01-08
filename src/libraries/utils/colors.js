import {
  FREEZING,
  FROZEN,
  SHUTTING_DOWN,
  STOPPED,
  STOPPING,
  UNFREEZING,
  transitioning
} from './states';

const colorClassNameModifiers = {
  dark: 'darken-4',
  base: 'darken-2',
  mediumLight: 'lighten-1',
  light: 'lighten-2',
  extraLight: 'lighten-4'
};

const colors = {
  info: 'blue',
  success: 'light-green',
  warning: 'orange',
  danger: 'red'
};

const buildColorClassNames = color => Object.keys(colorClassNameModifiers).reduce((acc, key) => {
  acc[key] = `${color} ${colorClassNameModifiers[key]}`;
  return acc;
}, {});

export const info = buildColorClassNames(colors.info);
export const success = buildColorClassNames(colors.success);
export const warning = buildColorClassNames(colors.warning);
export const danger = buildColorClassNames(colors.danger);

export const getResourcesStatusColorClassName = (value, theme = 'base') => {
  if (!isNaN(value)) {
    if (value >= 90) {
      return danger[theme];
    } else if (value >= 75) {
      return warning[theme];
    }
  }

  return success[theme];
};

export const getBackgroundStateStatusColor = (state) => {
  if (state === STOPPED || state === STOPPING || state === SHUTTING_DOWN) {
    return danger.extraLight;
  } else if (state === FROZEN || state === FREEZING || state === UNFREEZING) {
    return info.extraLight;
  }

  return success.extraLight;
};

export const getStateStatusColor = (state) => {
  if (state === STOPPED || state === STOPPING || state === SHUTTING_DOWN) {
    return colors.danger;
  } else if (state === FROZEN || state === FREEZING || state === UNFREEZING) {
    return colors.info;
  }

  return colors.success;
};

export const getStateStatusColorsClassnames = (state) => {
  const stateStatusColor = getStateStatusColor(state);
  const transitioningClassName = transitioning(state) ? 'state--transitioning' : '';
  const textColor = `${stateStatusColor}--text text--darken-2`;

  return {
    backgroundColor: `${transitioningClassName} ${getBackgroundStateStatusColor(state)}`,
    textColor,
    labelColor: `${stateStatusColor} ${stateStatusColor}--darken-2 ${textColor}`
  };
};

export default colors;

// Export all image assets as modules
// This allows Metro bundler to properly resolve assets when installed as an npm module
// Paths must be relative from this file location (bot-sdk/assets/)

// Images folder - using relative paths from this file's location
export const images = {
  article: require('./images/article.png'),
  back: require('./images/back.png'),
  blur: require('./images/blur.png'),
  close: require('./images/close.png'),
  decrease10Seconds: require('./images/decrease10Seconds.png'),
  dot: require('./images/dot.png'),
  error: require('./images/error.png'),
  exitFullScreen: require('./images/exitFullScreen.png'),
  expand: require('./images/expand.png'),
  eye: require('./images/eye.png'),
  fullScreen: require('./images/fullScreen.png'),
  fullSound: require('./images/fullSound.png'),
  ic_automation_ai: require('./images/ic_automation_ai.png'),
  increase10Seconds: require('./images/increase10Seconds.png'),
  muteSound: require('./images/muteSound.png'),
  pause: require('./images/pause.png'),
  play: require('./images/play.png'),
  playlist: require('./images/playlist.png'),
  quality: require('./images/quality.png'),
  settings: require('./images/settings.png'),
  soundMixer: require('./images/soundMixer.png'),
  speed: require('./images/speed.png'),
};

// Placeholder folder - using relative paths from this file's location  
export const placeholder = {
  default_bot_icon: require('./placeholder/default_bot_icon.png'),
  digitalForm: require('./placeholder/digitalForm.png'),
  download: require('./placeholder/download.png'),
  image: require('./placeholder/image.png'),
  mobile: require('./placeholder/mobile.png'),
  pdf: require('./placeholder/pdf.png'),
};

// Re-export for backward compatibility
export const placehoder = placeholder;

// Default export with all assets
export default {
  images,
  placeholder,
  placehoder: placeholder, // Keep the typo for backward compatibility
};


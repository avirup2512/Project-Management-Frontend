export const polyfill = {
  deepCopy: function (data) {
    if (data == null) return data;
    if (typeof data != "object") return data;
    let clone = Array.isArray(data) ? [] : {};
    for (let x in data) {
      const value = data[x];
      clone[x] = this.deepCopy(value);
    }
    return clone;
  },
  isColorLight: function (hex) {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness (luminance)
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Threshold
    return brightness >= 128; // true = light, false = dark
  },
};

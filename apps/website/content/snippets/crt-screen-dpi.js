const syncDevicePixelRatio = () => {
  document.documentElement.style.setProperty(
    '--dpr',
    String(window.devicePixelRatio || 1),
  );
};

syncDevicePixelRatio();
window.addEventListener('resize', syncDevicePixelRatio);

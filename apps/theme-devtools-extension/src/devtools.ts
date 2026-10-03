chrome.devtools.panels.create('Theme', '', 'panel.html');
chrome.devtools.panels.elements.createSidebarPane('Theme', (pane) => {
  pane.setPage('sidebar.html');
});

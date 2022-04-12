let screenMinimized;
let sidebarCollapsed = true;
const extendedSize = 250;
const collapsedSize = 0;

function initSidebar() {
  function onScreenMediaChanged(x) {
    if (x.matches) {
      screenMinimized = true;
      sidebarCollapsed = true;
      collapseSidebar();
    } else {
      screenMinimized = false;

      if (sidebarCollapsed) {
        expandSidebar();
      } else {
        hideOverlay();
      }
    }
  }

  let screenMedia = window.matchMedia('(max-width: 800px)');
  onScreenMediaChanged(screenMedia);
  screenMedia.addListener(onScreenMediaChanged);
}

function toggleSidebar() {
  sidebarCollapsed ? expandSidebar() : collapseSidebar();
}

function expandSidebar() {
  document.getElementById('main-sidebar').style.width = extendedSize + 'px';
  // document.getElementById('sidebar-right-content').style.marginLeft = extendedSize + 'px';
  screenMinimized ? showOverlay() : hideOverlay();
  sidebarCollapsed = false;
}

function collapseSidebar() {
  document.getElementById('main-sidebar').style.width = collapsedSize + 'px';
  // document.getElementById('sidebar-right-content').style.marginLeft = collapsedSize + 'px';
  hideOverlay();
  sidebarCollapsed = true;
}

function showOverlay() {
  document.getElementById('overlay').style.display = 'block';
}

function hideOverlay() {
  document.getElementById('overlay').style.display = 'none';
}

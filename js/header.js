
init();

function init() {
    const headerNavLink = document.querySelectorAll('.header-link');
    
    headerNavLink.forEach((targetLink) => {
      if (targetLink.href === location.href) {
        targetLink.parentElement.classList.add('header-selected');
      }
    });
}

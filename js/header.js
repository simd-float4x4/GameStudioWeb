// TODO: カレント表示のマークアップ

// $(function () {
//     $(".header .wrapper nav ul li a").on("click",  function() {
//         console.log('detected');
//         if( $("[href^='#']") ){
//             $("header-item").removeClass('header-selected');
//             $(this).parent().addClass('header-selected');
//             return false;
//         }
//      });
// });
   
const headerNavLink = document.querySelectorAll('.header-link');

headerNavLink.forEach((targetLink) => {
  if (targetLink.href === location.href) {
    targetLink.parentElement.classList.add('header-selected');
  }
});
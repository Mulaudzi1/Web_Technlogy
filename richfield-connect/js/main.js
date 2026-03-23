(function ($) {
  $(function () {
    const $navToggle = $('.nav-toggle');
    const $navLinks = $('.nav-links');

    // Toggle the mobile navigation tray.
    $navToggle.on('click', function () {
      $navLinks.toggleClass('nav-open');
    });

    // Add a jQuery-powered hover animation to navigation links.
    $('.nav-link').hover(
      function () {
        $(this).stop(true, true).animate({ opacity: 0.82, paddingLeft: '1.12rem' }, 160);
        $(this).addClass('nav-animated');
      },
      function () {
        $(this).stop(true, true).animate({ opacity: 1, paddingLeft: '1rem' }, 160);
        $(this).removeClass('nav-animated');
      }
    );
  });
})(jQuery);

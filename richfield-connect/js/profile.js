(function ($) {
  const storageKey = 'rc_user';

  function createInterestTags(interests) {
    return interests.map((interest) => `<span class="tag">${interest}</span>`).join('');
  }

  $(function () {
    const userData = localStorage.getItem(storageKey);
    const $emptyState = $('#profile-empty-state');
    const $profileContent = $('#profile-content');

    if (!userData) {
      $emptyState.removeClass('hidden');
      return;
    }

    try {
      const user = JSON.parse(userData);
      $('#profile-name').text(user.fullName);
      $('#profile-email').text(user.email);
      $('#profile-student-number').text(user.studentNumber);
      $('#profile-campus').text(user.campus);
      $('#profile-bio').text(user.bio);
      $('#profile-interests').html(createInterestTags(user.interests || []));

      $profileContent.removeClass('hidden');

      // Collapse and expand profile sections using jQuery slideToggle.
      $('.toggle-button').on('click', function () {
        const target = $(this).data('target');
        $(target).stop(true, true).slideToggle(250);
      });
    } catch (error) {
      console.warn('Unable to load profile data.', error);
      $emptyState.removeClass('hidden');
    }
  });
})(jQuery);

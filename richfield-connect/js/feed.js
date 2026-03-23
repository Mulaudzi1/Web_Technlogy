(function ($) {
  const userStorageKey = 'rc_user';
  const postsStorageKey = 'rc_posts';

  function readPosts() {
    const savedPosts = localStorage.getItem(postsStorageKey);
    return savedPosts ? JSON.parse(savedPosts) : [];
  }

  function savePosts(posts) {
    localStorage.setItem(postsStorageKey, JSON.stringify(posts));
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function getCurrentUser() {
    const storedUser = localStorage.getItem(userStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  function renderEmptyState(posts) {
    $('#feed-empty-state').toggleClass('hidden', posts.length > 0);
  }

  function createPostCard(post) {
    const $postCard = $(`
      <article class="card post-card" data-post-id="${post.id}">
        <div class="post-header">
          <div>
            <h2 class="post-author">${post.userName}</h2>
            <p class="meta-text">${formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
        <p class="post-content"></p>
        <div class="post-actions">
          <button type="button" class="action-button like-button ${post.liked ? 'liked' : ''}">
            <span>👍 Like</span>
            <span class="like-count">${post.likes}</span>
          </button>
          <button type="button" class="action-button delete-button">🗑 Delete</button>
        </div>
      </article>
    `);

    $postCard.find('.post-content').text(post.content);
    return $postCard;
  }

  function updatePost(postId, updater) {
    const posts = readPosts();
    const updatedPosts = posts.map((post) => (post.id === postId ? updater(post) : post));
    savePosts(updatedPosts);
    return updatedPosts;
  }

  function removePost(postId) {
    const remainingPosts = readPosts().filter((post) => post.id !== postId);
    savePosts(remainingPosts);
    renderEmptyState(remainingPosts);
  }

  function attachPostActions($postCard) {
    $postCard.find('.like-button').on('click', function () {
      const $button = $(this);
      const postId = $postCard.data('post-id');
      const updatedPosts = updatePost(postId, (post) => ({
        ...post,
        likes: post.likes + 1,
        liked: !post.liked,
      }));
      const currentPost = updatedPosts.find((post) => post.id === postId);
      $button.toggleClass('liked', currentPost.liked);
      $button.find('.like-count').text(currentPost.likes);
    });

    $postCard.find('.delete-button').on('click', function () {
      const shouldDelete = window.confirm('Are you sure you want to delete this post?');
      if (!shouldDelete) {
        return;
      }

      const postId = $postCard.data('post-id');
      $postCard.slideUp(200, function () {
        $postCard.remove();
        removePost(postId);
      });
    });
  }

  function renderPosts(posts) {
    const $postList = $('#post-list');
    $postList.empty();
    renderEmptyState(posts);

    posts.forEach((post) => {
      const $postCard = createPostCard(post);
      attachPostActions($postCard);
      $postList.append($postCard);
      $postCard.fadeIn(300);
    });
  }

  $(function () {
    const currentUser = getCurrentUser();
    const $feedMessage = $('#feed-user-message');
    const $postForm = $('#post-form');
    const $postContent = $('#postContent');
    const $postError = $('#post-error');

    if (!currentUser) {
      $feedMessage
        .removeClass('hidden')
        .text('Sign up first to personalize the feed with your name before posting.');
    } else {
      $feedMessage
        .removeClass('hidden')
        .text(`Posting as ${currentUser.fullName} from ${currentUser.campus}.`);
    }

    renderPosts(readPosts());

    // Create a new post, store it in localStorage, and prepend it without refreshing the page.
    $postForm.on('submit', function (event) {
      event.preventDefault();

      const content = $postContent.val().trim();
      if (!content) {
        $postError.text('Please enter post content before publishing.');
        $postContent.addClass('is-invalid').removeClass('is-valid');
        return;
      }

      $postError.text('');
      $postContent.addClass('is-valid').removeClass('is-invalid');

      const user = getCurrentUser();
      const post = {
        id: Date.now(),
        userName: user ? user.fullName : 'Guest Student',
        userStudentNumber: user ? user.studentNumber : 'guest',
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false,
      };

      const posts = readPosts();
      posts.unshift(post);
      savePosts(posts);
      renderEmptyState(posts);

      const $newPostCard = createPostCard(post);
      attachPostActions($newPostCard);
      $('#post-list').prepend($newPostCard);
      $newPostCard.hide().fadeIn(600);

      $postForm.trigger('reset');
      $postContent.removeClass('is-valid');
    });

    $postContent.on('input', function () {
      if ($(this).val().trim()) {
        $postError.text('');
        $(this).addClass('is-valid').removeClass('is-invalid');
      }
    });
  });
})(jQuery);

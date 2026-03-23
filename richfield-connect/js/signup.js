(function ($) {
  const storageKey = 'rc_user';
  const formFields = [
    'fullName',
    'studentNumber',
    'campus',
    'email',
    'password',
    'confirmPassword',
    'interests',
    'bio',
  ];

  function parseInterests(value) {
    return value
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean);
  }

  function saveUserToStorage(userData) {
    localStorage.setItem(storageKey, JSON.stringify(userData));
  }

  function setFieldState(fieldId, isValid, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    input.classList.remove('is-valid', 'is-invalid');
    input.classList.add(isValid ? 'is-valid' : 'is-invalid');
    errorElement.textContent = message;
  }

  function validateField(fieldId) {
    const value = document.getElementById(fieldId).value.trim();

    switch (fieldId) {
      case 'fullName':
        if (!value) {
          setFieldState(fieldId, false, 'Full name is required.');
          return false;
        }
        break;
      case 'studentNumber':
        if (!value) {
          setFieldState(fieldId, false, 'Student number is required.');
          return false;
        }
        if (!/^\d+$/.test(value)) {
          setFieldState(fieldId, false, 'Student number must contain digits only.');
          return false;
        }
        break;
      case 'campus':
        if (!value) {
          setFieldState(fieldId, false, 'Please select a campus or learning mode.');
          return false;
        }
        break;
      case 'email':
        if (!value) {
          setFieldState(fieldId, false, 'Email address is required.');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setFieldState(fieldId, false, 'Enter a valid email address.');
          return false;
        }
        break;
      case 'password':
        if (!value) {
          setFieldState(fieldId, false, 'Password is required.');
          return false;
        }
        if (value.length < 8) {
          setFieldState(fieldId, false, 'Password must be at least 8 characters long.');
          return false;
        }
        break;
      case 'confirmPassword': {
        const passwordValue = document.getElementById('password').value;
        if (!value) {
          setFieldState(fieldId, false, 'Please confirm your password.');
          return false;
        }
        if (value !== passwordValue) {
          setFieldState(fieldId, false, 'Passwords do not match.');
          return false;
        }
        break;
      }
      case 'interests':
        if (parseInterests(value).length === 0) {
          setFieldState(fieldId, false, 'Please enter at least one interest.');
          return false;
        }
        break;
      case 'bio':
        if (!value) {
          setFieldState(fieldId, false, 'Short bio is required.');
          return false;
        }
        break;
      default:
        break;
    }

    setFieldState(fieldId, true, '');
    return true;
  }

  function updatePreview() {
    const fullName = $('#fullName').val().trim();
    const campus = $('#campus').val().trim();
    const bio = $('#bio').val().trim();
    const interests = parseInterests($('#interests').val().trim());

    $('#preview-name').text(fullName || 'Your Name');
    $('#preview-campus').text(campus || 'Campus / DL');
    $('#preview-bio').text(bio || 'Your bio will appear here as you type.');

    const $previewInterests = $('#preview-interests');
    $previewInterests.empty();

    if (interests.length === 0) {
      $previewInterests.append('<span class="tag muted">Interests will appear here</span>');
      return;
    }

    interests.forEach((interest) => {
      $previewInterests.append(`<span class="tag">${interest}</span>`);
    });
  }

  $(function () {
    const $form = $('#signup-form');

    // Restore existing user information into the form when available.
    const savedUser = localStorage.getItem(storageKey);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        formFields.forEach((fieldId) => {
          if (fieldId === 'confirmPassword') {
            return;
          }

          const fieldValue = fieldId === 'interests' ? parsedUser.interests.join(', ') : parsedUser[fieldId];
          if (fieldValue) {
            document.getElementById(fieldId).value = fieldValue;
          }
        });
        updatePreview();
      } catch (error) {
        console.warn('Unable to parse saved user data.', error);
      }
    }

    // Validate each field live as the user types or changes the selection.
    formFields.forEach((fieldId) => {
      $(`#${fieldId}`).on('input change', function () {
        validateField(fieldId);
        if (fieldId === 'password') {
          validateField('confirmPassword');
        }
      });
    });

    // Update the preview panel in real time with jQuery input listeners.
    $('#fullName, #campus, #bio, #interests').on('input change', updatePreview);

    $form.on('submit', function (event) {
      event.preventDefault();

      const isFormValid = formFields.every((fieldId) => validateField(fieldId));
      if (!isFormValid) {
        return;
      }

      const userData = {
        fullName: $('#fullName').val().trim(),
        studentNumber: $('#studentNumber').val().trim(),
        campus: $('#campus').val().trim(),
        email: $('#email').val().trim(),
        password: $('#password').val(),
        interests: parseInterests($('#interests').val().trim()),
        bio: $('#bio').val().trim(),
      };

      saveUserToStorage(userData);
      window.location.href = 'profile.html';
    });
  });
})(jQuery);

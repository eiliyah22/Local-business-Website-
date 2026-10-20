const MIN = 1;
const MAX = 200;

document.querySelectorAll('.qty').forEach(wrapper => {
  const input = wrapper.querySelector('.qty-input');
  const minusBtn = wrapper.querySelector('[data-step="-1"]');
  const plusBtn = wrapper.querySelector('[data-step="1"]');

  // Clamp a value into the allowed range (falls back to MIN if not a number)
  const clamp = value => {
    const n = parseInt(value, 10);
    if (isNaN(n)) return MIN;
    return Math.min(MAX, Math.max(MIN, n));
  };

  // Disable +/- when at the limits
  const refreshButtons = () => {
    const current = parseInt(input.value, 10) || MIN;
    minusBtn.disabled = current <= MIN;
    plusBtn.disabled = current >= MAX;
  };

  const setValue = value => {
    input.value = clamp(value);
    refreshButtons();
  };

  // +/- buttons
  [minusBtn, plusBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      setValue((parseInt(input.value, 10) || MIN) + Number(btn.dataset.step));
    });
  });

  // Only allow digits while typing or pasting
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
    if (input.value !== '' && Number(input.value) > MAX) {
      input.value = MAX;
    }
    refreshButtons();
  });

  // Block keys that can produce invalid numbers
  input.addEventListener('keydown', e => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      setValue(input.value);
      input.blur();
    }
  });

  // Enforce the minimum when the user leaves the field
  input.addEventListener('blur', () => setValue(input.value));

  refreshButtons();
});

let timer;

export const startAutoLogout = (dispatch, expiryTime) => {
  const currentTime = Date.now();
  const timeLeft = expiryTime - currentTime;

  if (timer) clearTimeout(timer);

  if (timeLeft > 0) {
    timer = setTimeout(() => {
      dispatch({ type: 'auth/logout/trigger' });
    }, timeLeft);
  } else {
    dispatch({ type: 'auth/logout/trigger' });
  }
};

export const clearAutoLogout = () => {
  if (timer) clearTimeout(timer);
};

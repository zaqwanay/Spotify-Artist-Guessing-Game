const DECREMENT_LIVES = "DECREMENT_LIVES";
const RESET_LIVES = "RESET_LIVES";

const livesReducer = (state = 3, action) => {
  switch (action.type) {
    case DECREMENT_LIVES:
      return state - 1;
    case RESET_LIVES:
      return 3;
    default:
      return state;
  }
};

export const decrementLives = () => ({
  type: DECREMENT_LIVES,
});

export const resetLives = () => ({
  type: RESET_LIVES,
});

export default livesReducer;

const INCREMENT_SCORE = "INCREMENT_SCORE";
const RESET_SCORE = "RESET_SCORE";

const scoreReducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT_SCORE:
      return state + 1;
    case RESET_SCORE:
      return 0;
    default:
      return state;
  }
};

export const incrementScore = () => ({
  type: INCREMENT_SCORE,
});

export const resetScore = () => ({
  type: RESET_SCORE,
});

export default scoreReducer;

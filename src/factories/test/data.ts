export const getLogicalQuestionsTestData = [
  {
    allResults: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
      {
        id: 2,
        statement_one: 'All birds can fly.',
        statement_two: 'Penguins are birds.',
        conclusion: 'Penguin can fly.',
        is_conclusion_correct: 0,
      },
    ],
    expected: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
      {
        id: 2,
        statement_one: 'All birds can fly.',
        statement_two: 'Penguins are birds.',
        conclusion: 'Penguin can fly.',
        is_conclusion_correct: 0,
      },
    ],
  },
  {
    allResults: [],
    expected: null,
  },
];

export const getGameQuestionTestData = [
  {
    questionOrder: 1,
    allResults: {
      id: 1,
      order: 1,
      question: {
        id: 101,
        text: 'What is 2+2?',
      },
    },
    expected: {
      id: 1,
      order: 1,
      question: {
        id: 101,
        text: 'What is 2+2?',
      },
    },
  },
  {
    questionOrder: 2,
    allResults: null, // Simulate no result found
    expected: null,
  },
  {
    questionOrder: null,
    allResults: null, // Simulating invalid input handling
    expected: null,
  },
  {
    questionOrder: 99999,
    allResults: null, // No result for a large questionOrder
    expected: null,
  },
];

export const getRandomQuestionsTestData = [
  {
    allResults: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      is_conclusion_correct: i % 2 === 0,
    })),
    expected: {
      total: 20,
      true: 10,
      false: 10,
    },
  },
  {
    allResults: [],
    expected: {
      total: 0,
      true: 0,
      false: 0,
    },
  },
];

export const playLogicalQuestionsGameData = [
  {
    description: 'Successful game setup',
    gameId: 1,
    assessmentId: 100,
    candidateId: 200,
    randomQuestionsList: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
      {
        id: 2,
        statement_one: 'All birds can fly.',
        statement_two: 'Penguins are birds.',
        conclusion: 'Penguin can fly.',
        is_conclusion_correct: 0,
      },
    ],
    questionsList: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
    ],
    expected: {
      candidateId: 200,
      assessmentId: 100,
      gameStartedTimer: expect.any(Date),
      firstQuestion: {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
    },
  },
  {
    description: 'Validation failure during game start',
    gameId: 1,
    assessmentId: 100,
    candidateId: 200,
    randomQuestionsList: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
    ],
    questionsList: [],
    startGameError: new Error('Game start error'),
    expectedError: new Error('Game start error'),
  },
  {
    description: 'Empty random questions list',
    gameId: 1,
    assessmentId: 100,
    candidateId: 200,
    randomQuestionsList: [],
    questionsList: [],
    expected: {
      candidateId: 200,
      assessmentId: 100,
      gameStartedTimer: expect.any(Date),
      firstQuestion: undefined,
    },
  },
  {
    description: 'Error during question saving',
    gameId: 1,
    assessmentId: 100,
    candidateId: 200,
    randomQuestionsList: [
      {
        id: 1,
        statement_one: 'All liquids are wet.',
        statement_two: 'Oil is a liquid.',
        conclusion: 'Oil is wet.',
        is_conclusion_correct: 1,
      },
    ],
    saveError: new Error('Question saving error'),
    expectedError: new Error('Question saving error'),
  },
];

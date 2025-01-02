document.addEventListener('DOMContentLoaded', function() {
  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const submitButton = document.getElementById('submit');

  let questions = [];
  let userAnswers = [];

  // 加载题目
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questions = getRandomQuestions(data, 10);
      displayQuestions(questions);
    });

  // 随机选择题目
  function getRandomQuestions(allQuestions, count) {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 显示题目
  function displayQuestions(questions) {
    let output = '';
    questions.forEach((question, index) => {
      output += `
        <div class="question">
          <p>${index + 1}. ${question.question}</p>
          <div class="options">
            ${question.options.map((option, i) => `
              <label class="option">
                <input type="radio" name="question${index}" value="${i}">
                ${option}
              </label>
            `).join('')}
          </div>
        </div>
      `;
    });
    quizContainer.innerHTML = output;
  }

  // 处理提交
  submitButton.addEventListener('click', showResults);

  function showResults() {
    userAnswers = [];
    let score = 0;

    questions.forEach((question, index) => {
      const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
      const isCorrect = selectedOption && selectedOption.value == question.answer;
      userAnswers.push({
        question: question.question,
        selected: selectedOption ? selectedOption.value : null,
        correct: question.answer,
        isCorrect: isCorrect,
        explanation: question.explanation
      });
      if (isCorrect) score++;
    });

    displayResults(userAnswers, score);
  }

  // 显示结果
  function displayResults(answers, score) {
    let output = '';
    answers.forEach((answer, index) => {
      output += `
        <div class="result-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
          <p>${index + 1}. ${answer.question}</p>
          <p>你的答案：${answer.selected !== null ? questions[index].options[answer.selected] : '未作答'}</p>
          <p>正确答案：${questions[index].options[answer.correct]}</p>
          <p class="explanation">解析：${answer.explanation}</p>
        </div>
      `;
    });

    output += `<div class="score">你的得分：${score}/${questions.length}</div>`;
    resultsContainer.innerHTML = output;
  }
});

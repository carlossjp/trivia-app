// Consulta al endpoint
const generateQuestions = () => {
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;
  
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`
    )
      .then((response) => response.json())
      .then((data) => {
        showQuestions(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  // Mostrar preguntas
  const showQuestions = (questions) => {
    const triviaContainer = document.getElementById("trivia");
    const questionsContainer = document.getElementById("questions");
    const messageElement = document.getElementById("message");
  
    questionsContainer.innerHTML = "";
  
    if (questions.length === 0) {
      messageElement.textContent = "No hay preguntas en esta categoría.";
      triviaContainer.style.display = "none";
      return;
    } else {
      triviaContainer.style.display = "block";
      messageElement.textContent = "";
  
      questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.classList.add("question_item");
  
        // Mezclar las respuestas, incluyendo la respuesta correcta
        const answers = question.incorrect_answers.concat(question.correct_answer);
        shuffleArray(answers);
  
        questionElement.innerHTML = `
          <p>${index + 1}. ${question.question}</p>
          ${answers
            .map(
              (answer, answerIndex) => `
            <label>
              <input type="radio" name="question${index}" value="${answer}">
              ${answer}
            </label>
          `
            )
            .join("")}
        `;
        questionsContainer.appendChild(questionElement);
  
        // Agregar evento al radio button para establecer el atributo checked
        const radioButtons = questionElement.querySelectorAll(
          'input[type="radio"]'
        );
        radioButtons.forEach((radio) => {
          radio.addEventListener("change", () => {
            radioButtons.forEach((r) => {
              r.checked = false; // Quitar la marca de verificación
            });
            radio.checked = true; // Establecer la marca de verificación en el radio button seleccionado
          });
        });
  
        // Establecer respuesta correcta en el atributo data
        questionElement.dataset.correctAnswer = question.correct_answer;
      });
    }
  };
  
  // Función para mezclar un array usando el algoritmo de Fisher-Yates
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  // Calcular resultados
  const calculateResult = () => {
    const triviaContainer = document.getElementById("trivia");
    const questions = triviaContainer.querySelectorAll(".question_item");
    let score = 0;
  
    questions.forEach((question) => {
      const selectedAnswer = question.querySelector(
        'input[type="radio"]:checked'
      );
      const correctAnswer = question.dataset.correctAnswer;
  
      if (selectedAnswer) {
        if (selectedAnswer.value === correctAnswer) {
          selectedAnswer.parentNode.classList.add("correct");
          score += 100;
        } else {
          selectedAnswer.parentNode.classList.add("incorrect");
        }
      }
    });
  
    document.getElementById("score").textContent = `Puntaje final: ${score}`;
  };
  
  // Volver a cargar las preguntas
  const resetQuestions = () => {
    document.getElementById("trivia").style.display = "none";
    document.getElementById("score").textContent = "";
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        const categorySelect = document.getElementById("category");
  
        data.trivia_categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });
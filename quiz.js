

const QUESTION_BANK = [
  {
    question: "¿Cuál es la distancia mínima de seguridad recomendada entre vehículos en carretera?",
    choices: ["1 segundo", "2 segundos", "3 segundos", "5 segundos"],
    correct: 2
  },
  {
    question: "¿Cada cuántas horas debe hacer una pausa obligatoria un conductor de larga distancia?",
    choices: ["Cada hora", "Cada 2 horas", "Cada 3 horas", "Cada 4 horas"],
    correct: 1
  },
  {
    question: "¿Qué significa PESV?",
    choices: ["Plan Estratégico de Seguridad Vial", "Programa Especial de Seguridad Vehicular", "Plan de Emergencia y Seguridad Vial", "Protocolo Estratégico de Supervisión Vial"],
    correct: 0
  },
  {
    question: "La tasa máxima de alcohol permitida para conductores profesionales en Colombia es:",
    choices: ["0 grados", "0.2 grados", "0.4 grados", "1.0 grado"],
    correct: 0
  },
  {
    question: "¿Qué documento regula el PESV en Colombia actualmente?",
    choices: ["Ley 1503 de 2011", "Resolución 1565 de 2014", "Resolución 40595 de 2022", "Decreto 2851 de 2013"],
    correct: 2
  },
  {
    question: "¿Cuál es uno de los factores de riesgo más críticos en conducción de larga distancia?",
    choices: ["Uso de aire acondicionado", "Fatiga y somnolencia", "Escuchar música", "Conversar con pasajeros"],
    correct: 1
  },
  {
    question: "Según las normas de seguridad vial, ¿qué debe hacer un conductor si se siente fatigado?",
    choices: ["Tomar café y continuar", "Bajar la ventana para aire fresco", "Detenerse y descansar", "Conducir más rápido para llegar pronto"],
    correct: 2
  },
  {
    question: "¿Cuál es la velocidad máxima permitida en autopistas en Colombia?",
    choices: ["80 km/h", "100 km/h", "120 km/h", "140 km/h"],
    correct: 1
  },
  {
    question: "¿Qué significa la metodología PASO 8 en el contexto del PESV?",
    choices: ["8 pasos para aprobar examen de conducción", "8 programas para gestionar riesgos críticos", "8 tipos de vehículos autorizados", "8 niveles de capacitación"],
    correct: 1
  },
  {
    question: "¿Con qué frecuencia deben realizarse los mantenimientos preventivos de vehículos de carga?",
    choices: ["Cada mes", "Cada 5,000 km o según fabricante", "Cada año", "Solo cuando falle"],
    correct: 1
  },
  {
    question: "¿Qué debe contener un botiquín de primeros auxilios en un vehículo de transporte?",
    choices: ["Solo vendas", "Gasas, vendas, antisépticos y guantes", "Medicamentos para dolor", "No es obligatorio"],
    correct: 1
  },
  {
    question: "En caso de accidente, lo primero que debe hacer el conductor es:",
    choices: ["Llamar al seguro", "Señalizar la zona y proteger a los heridos", "Mover el vehículo", "Tomar fotos"],
    correct: 1
  },
  {
    question: "¿Qué porcentaje de accidentes viales está relacionado con el factor humano?",
    choices: ["30%", "50%", "70%", "90%"],
    correct: 3
  },
  {
    question: "¿Cuál es el principal objetivo del PESV?",
    choices: ["Aumentar las ganancias", "Reducir la accidentalidad vial", "Mejorar la velocidad de entrega", "Reducir costos operativos"],
    correct: 1
  },
  {
    question: "El uso del cinturón de seguridad reduce el riesgo de muerte en un accidente en:",
    choices: ["20%", "40%", "60%", "Más del 50%"],
    correct: 3
  },
  {
    question: "¿Qué es un indicador KPI en el contexto del PESV?",
    choices: ["Kilometraje promedio por incidente", "Indicador clave de desempeño para medir objetivos", "Kilómetros permitidos por intervalo", "Ninguna de las anteriores"],
    correct: 1
  },
  {
    question: "¿Cuándo debe reportarse un incidente vial según el PESV?",
    choices: ["Solo si hay heridos", "Solo si hay daños materiales mayores", "Inmediatamente, sin importar la gravedad", "Al final del mes"],
    correct: 2
  },
  {
    question: "¿Qué elementos debe revisar un conductor en la inspección preoperacional?",
    choices: ["Solo el motor", "Frenos, luces, llantas, niveles de fluidos", "Solo la carrocería", "No es necesaria la inspección"],
    correct: 1
  },
  {
    question: "La auditoría interna del PESV debe realizarse:",
    choices: ["Cada 5 años", "Anualmente", "Solo cuando hay accidentes", "No es obligatoria"],
    correct: 1
  },
  {
    question: "¿Qué debe incluir una campaña de seguridad vial efectiva?",
    choices: ["Solo carteles", "Capacitación, sensibilización y seguimiento", "Solo correos electrónicos", "No son necesarias"],
    correct: 1
  }
];

let selectedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

function selectRandomQuestions() {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}

function startQuiz() {
  const playerName = document.getElementById('playerName').value.trim();
  
  if (!playerName) {
    alert('⚠️ Por favor ingresa tu nombre completo');
    return;
  }

  selectedQuestions = selectRandomQuestions();
  currentQuestionIndex = 0;
  userAnswers = [];

  document.getElementById('startQuiz').disabled = true;
  document.getElementById('submitQuiz').disabled = false;
  document.getElementById('quizResult').innerHTML = '';

  showQuestion();
}

function showQuestion() {
  const container = document.getElementById('quizContainer');
  
  if (currentQuestionIndex >= selectedQuestions.length) {
    container.innerHTML = '<p class="intro-text">✅ Has respondido todas las preguntas. Haz clic en "Enviar Respuestas".</p>';
    return;
  }

  const q = selectedQuestions[currentQuestionIndex];
  
  let html = `
    <div class="question-card">
      <div class="question-text">
        <strong>Pregunta ${currentQuestionIndex + 1} de ${selectedQuestions.length}:</strong><br>
        ${q.question}
      </div>
      <div id="quizChoices">
  `;

  q.choices.forEach((choice, index) => {
    const isSelected = userAnswers[currentQuestionIndex] === index;
    html += `
      <button 
        onclick="selectAnswer(${index})" 
        class="${isSelected ? 'selected' : ''}"
        id="choice-${index}">
        ${String.fromCharCode(65 + index)}. ${choice}
      </button>
    `;
  });

  html += `</div>`;
  
  if (currentQuestionIndex > 0) {
    html += `<button onclick="previousQuestion()" class="btn-secondary" style="margin-top:16px">⬅️ Anterior</button>`;
  }
  
  if (userAnswers[currentQuestionIndex] !== undefined) {
    html += `<button onclick="nextQuestion()" class="btn-primary" style="margin-top:16px; margin-left:8px">Siguiente ➡️</button>`;
  }

  html += `</div>`;
  
  container.innerHTML = html;
}

function selectAnswer(choiceIndex) {
  userAnswers[currentQuestionIndex] = choiceIndex;
  showQuestion();
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < selectedQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

function submitQuiz() {
  if (userAnswers.length < selectedQuestions.length) {
    alert('⚠️ Por favor responde todas las preguntas antes de enviar.');
    return;
  }

  let correctCount = 0;
  selectedQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / selectedQuestions.length) * 100);
  const passed = score >= 70;

  const playerName = document.getElementById('playerName').value.trim();
  const playerDoc = document.getElementById('playerDoc').value.trim();
  
  saveToRanking({
    name: playerName,
    doc: playerDoc,
    type: 'Quiz',
    score: score,
    date: new Date().toISOString()
  });

  const resultDiv = document.getElementById('quizResult');
  resultDiv.innerHTML = `
    <div class="result-box ${passed ? 'result-pass' : 'result-fail'}">
      ${passed ? '✅ ¡APROBADO!' : '❌ No Aprobado'}
      <br><br>
      <strong>Puntuación: ${score}%</strong><br>
      Respuestas correctas: ${correctCount} de ${selectedQuestions.length}
      <br><br>
      ${passed ? '🎉 ¡Felicitaciones! Has demostrado conocimiento en seguridad vial.' : '📚 Te recomendamos revisar el material y volver a intentarlo.'}
    </div>
  `;

  document.getElementById('startQuiz').disabled = false;
  document.getElementById('submitQuiz').disabled = true;
  document.getElementById('quizContainer').innerHTML = '';

  if (typeof loadRank === 'function') {
    loadRank();
  }
}

function saveToRanking(entry) {
  let rank = JSON.parse(localStorage.getItem('boshRank') || '[]');
  rank.push(entry);
  localStorage.setItem('boshRank', JSON.stringify(rank));
}

document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startQuiz');
  const submitBtn = document.getElementById('submitQuiz');

  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', submitQuiz);
  }
});
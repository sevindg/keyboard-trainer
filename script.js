const targetText = "Помогите спасти Реботику!";
let pos = 0;
let startTime = null;

const inputArea = document.getElementById("inputArea");
const nextCharSpan = document.querySelector("#nextChar span");
const resultDiv = document.getElementById("result");
const cpmDisplay = document.getElementById("cpmDisplay");
const resetButton = document.getElementById("resetButton");

function initializeKeyboard() {
  if (typeof SimpleKeyboard === "undefined") {
    console.error("SimpleKeyboard не загружен. Проверьте подключение библиотеки.");
    return;
  }

  const keyboard = new SimpleKeyboard({
    onKeyPress: (button) => handleVirtualKey(button),
    layout: {
      default: [
        "ё 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
        "й ц у к е н г ш щ з х ъ \\",
        "ф ы в а п р о л д ж э",
        "я ч с м и т ь б ю . ,",
        "{space}"
      ]
    },
    display: {
      "{bksp}": "⌫",
      "{space}": "␣"
    }
  });
}

function updateNextChar() {
  nextCharSpan.textContent = targetText[pos] || "—";
}

function handleVirtualKey(key) {
  const char = key === "{space}" ? " " : key === "{bksp}" ? "BACKSPACE" : key;

  if (char === "BACKSPACE") {
    if (pos > 0) {
      inputArea.value = inputArea.value.slice(0, -1);
      pos--;
      resultDiv.textContent = "";
    }
  } else if (char.length === 1) {
    handleCharacterInput(char);
  }

  updateNextChar();
}

function handlePhysicalKey(key) {
  if (key === "Backspace") {
    if (pos > 0) {
      inputArea.value = inputArea.value.slice(0, -1);
      pos--;
      resultDiv.textContent = "";
    }
  } else if (key.length === 1) {
    handleCharacterInput(key);
  }

  updateNextChar();
}

function handleCharacterInput(char) {
  if (!startTime) startTime = new Date();

  if (char === targetText[pos]) {
    inputArea.value += char;
    pos++;
    resultDiv.textContent = "";

    if (pos === targetText.length) {
      const endTime = new Date();
      const cpm = calculateCPM(startTime, endTime, targetText.length);
      resultDiv.textContent = "✅ Отлично! Вы завершили.";
      resultDiv.style.color = "green";
      inputArea.disabled = true;
      cpmDisplay.textContent = `Символов в минуту: ${cpm}`;
      resetButton.style.display = "block";
    }
  } else {
    resultDiv.textContent = `❗ Ошибка: ожидалось "${targetText[pos]}"`;
    resultDiv.style.color = "red";
  }
}

function calculateCPM(start, end, chars) {
  const timeMinutes = (end - start) / 60000;
  return Math.round(chars / timeMinutes);
}

function resetTrainer() {
  pos = 0;
  startTime = null;
  inputArea.value = "";
  inputArea.disabled = false;
  resultDiv.textContent = "";
  cpmDisplay.textContent = "Символов в минуту: 0";
  resetButton.style.display = "none";
  updateNextChar();
}

// Поддержка ввода с физической клавиатуры
inputArea.addEventListener("keydown", (e) => {
  e.preventDefault();
  handlePhysicalKey(e.key);
});

// Обработчик кнопки сброса
resetButton.addEventListener("click", resetTrainer);

// Инициализация клавиатуры после загрузки страницы
document.addEventListener("DOMContentLoaded", initializeKeyboard);

updateNextChar();
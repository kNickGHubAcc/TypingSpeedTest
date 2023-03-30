const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector("button");

let timer;
let charIndex = mistakes = isTyping = 0;
let maxTime = 60;
let timeLeft = maxTime;


/*Παράγεται ένας τυχαίος αριθμός από 0 έως και 4. Έπειτα, έχοντας αρχικά άδειο το p tag, επιλέγεται μια τυχαία παράγραφος, σπάει σε χαρακτήρες
και κάθε χαρακτήρας τοποθετείται εντός ενός span tag. Στη συνέχεια αυτό το span tag τοποθετείται εντός του p tag.*/
function randomParagraph() {
  let randIndex = Math.floor(Math.random() * paragraphs.length);

  typingText.innerHTML = "";
  paragraphs[randIndex].split("").forEach(char => {
    let spanTag = `<span>${char}</span>`;
    typingText.innerHTML += spanTag;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");  //Animation για το πρώτο γράμμα της παραγράφου (πριν ξεκινήσω να γράφω)
  document.addEventListener("keydown", () => inpField.focus());  //Με το πάτημα ενός οποιουδήποτε κουμπιού γίνεται focus στο input πεδίο (hidden λόγω CSS)
  typingText.addEventListener("click", () => inpField.focus());  //Με το κλικ εντός της παραγράφου γίνεται focus στο input πεδίο (hidden λόγω CSS)
}


function initTyping() {
  const characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];     //Ο τελευταίος χαρακτήρας που γράφω εντός του input πεδίου

  if (charIndex < characters.length - 1 && timeLeft > 0)   //Αν υπάρχει ακόμα κείμενο για να γράψω και ο χρόνος δεν έχει τελειώσει
  {
    if (!isTyping) {     //Στο isTyping εχει οριστεί τιμή 0. Tο !isTyping επιστρέφει true για κάθε 'falsy' τιμ΄ή (0,null,false κ.λ.π).
      timer = setInterval(initTimer, 1000);    //Κάθε δευτερόλεπτο καλείται η initTimer(). H setInterval επιστρέφει ένα id.
      isTyping = true;
    }
    if (typedChar == null) {   //Αν πατήσω backspace
      charIndex--;
      if (characters[charIndex].classList.contains("incorrect")) {   //Αν ήταν λάθος ο χαρακτήρας που μόλις έσβησα
        mistakes--;
      }
      characters[charIndex].classList.remove("correct", "incorrect");   //Ο χαρακτήρας που πρόκειται να γράψω δεν θα έχει ακόμα χρώμα (red,green)
    } else {
      if (characters[charIndex].innerText === typedChar) {   //Αν έχω γράψει τον σωστό χαρακτήρα
        characters[charIndex].classList.add("correct");      //Αυτός θα πρασινίζει, λόγω correct class στην CSS
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }
    characters.forEach(span => span.classList.remove("active"));  //Αφαίρεση του animation από όλους τους χαρακτήρες πλην..
    characters[charIndex].classList.add("active");  //του χαρακτήρα που πρόκειται να γράψουμε

    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;   //Αν το wpm είναι ίσο με 0, άδειο ή άπειρο, τότε βάλε ως τιμή του το 0

    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
  }
  else {
    clearInterval(timer);   //Ο χρόνος σταματάει
    inpField.value = "";    //Δεν μπορώ να συνεχίσω να γράφω
  }
}


//Καλείται κάθε δευτερόλεπτο (λόγω setInterval) και πραγματοποιεί αντίστροφη μέτρηση από το 60 έως και το 0
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  randomParagraph();
  inpField.value = "";
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerText = timeLeft;
  mistakeTag.innerText = mistakes;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
}

randomParagraph();
inpField.addEventListener("input", initTyping);  //Κάθε φορά που γράφω εντός του input θα καλείται η initTyping()
tryAgainBtn.addEventListener("click", resetGame);  //Μόλις πατήσω το κουμπί "Προσπαθήστε ξανά", καλείται η resetGame

document.addEventListener('DOMContentLoaded', function() {
    // Exam questions
    const questions = [
        {
            question: "မြန်မာနိုင်ငံ၏ မြို့တော်မှာ မည်သည့်မြို့ဖြစ်သနည်း?",
            options: ["ရန်ကုန်", "မန္တလေး", "နေပြည်တော်", "ပဲခူး"],
            answer: 2
        },
        {
            question: "အောက်ပါတို့အနက် မည်သည့်အရာသည် သဘာဝသယံဇာတမဟုတ်သနည်း?",
            options: ["ကျောက်မီးသွေး", "ရေနံ", "သံဖြူ", "ပလတ်စတစ်"],
            answer: 3
        },
        {
            question: "မြန်မာ့သမိုင်းတွင် ပထမဆုံးသော မြန်မာဘုရင်မှာ မည်သူနည်း?",
            options: ["အနော်ရထာ", "ကျန်စစ်သား", "အလောင်းဘုရား", "သီပေါမင်း"],
            answer: 0
        },
        {
            question: "အောက်ပါတို့အနက် မည်သည့်အရာသည် ကာဗွန်ဒိုင်အောက်ဆိုဒ်၏ ဓာတုသင်္ကေတဖြစ်သနည်း?",
            options: ["CO", "CO2", "O2", "H2O"],
            answer: 1
        },
        {
            question: "အောက်ပါတို့အနက် မည်သည့်အရာသည် အပူကိုအကောင်းဆုံးလျှပ်ကူးနိုင်သနည်း?",
            options: ["သစ်သား", "ဖန်", "သံ", "ပလတ်စတစ်"],
            answer: 2
        }
    ];

    // DOM elements
    const questionContainer = document.getElementById('question-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const timeDisplay = document.getElementById('time');
    const totalQuestionsDisplay = document.getElementById('total-questions');
    const resultModal = document.getElementById('result-modal');
    const resultContent = document.getElementById('result-content');
    const closeBtn = document.querySelector('.close-btn');

    // Exam variables
    let currentQuestion = 0;
    let answers = Array(questions.length).fill(null);
    let timeLeft = 30 * 60; // 30 minutes in seconds
    let timer;

    // Initialize exam
    function initExam() {
        totalQuestionsDisplay.textContent = questions.length;
        loadQuestion();
        startTimer();
    }

    // Load question
    function loadQuestion() {
        questionContainer.innerHTML = '';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question active';
        
        const questionText = document.createElement('h3');
        questionText.textContent = `မေးခွန်း ${currentQuestion + 1}: ${questions[currentQuestion].question}`;
        questionDiv.appendChild(questionText);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        questions[currentQuestion].options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.id = `option-${index}`;
            input.value = index;
            
            // Check if this option was previously selected
            if (answers[currentQuestion] === index) {
                input.checked = true;
            }
            
            input.addEventListener('change', function() {
                answers[currentQuestion] = parseInt(this.value);
            });
            
            const label = document.createElement('label');
            label.htmlFor = `option-${index}`;
            label.textContent = option;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            optionsDiv.appendChild(optionDiv);
        });
        
        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);
        
        // Update button states
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = currentQuestion === questions.length - 1;
    }

    // Timer function
    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitExam();
            }
        }, 1000);
    }

    // Navigation functions
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    });

    // Submit exam
    submitBtn.addEventListener('click', function() {
        if (confirm('သင်စာမေးပွဲဖြေဆိုပြီးပါပြီ။ ရလဒ်ကိုကြည့်လိုပါသလား?')) {
            submitExam();
        }
    });

    function submitExam() {
        clearInterval(timer);
        calculateResults();
        resultModal.style.display = 'block';
    }

    // Calculate results
    function calculateResults() {
        let score = 0;
        let resultsHTML = `
            <p><strong>အမည်:</strong> ${document.getElementById('name').value || 'မဖြည့်ရသေးပါ'}</p>
            <p><strong>ကျောင်းသားအမှတ်:</strong> ${document.getElementById('id').value || 'မဖြည့်ရသေးပါ'}</p>
            <p><strong>စုစုပေါင်းမေးခွန်း:</strong> ${questions.length}</p>
            <p><strong>ဖြေဆိုခဲ့သောမေးခွန်း:</strong> ${answers.filter(a => a !== null).length}</p>
        `;
        
        // Calculate score
        for (let i = 0; i < questions.length; i++) {
            if (answers[i] === questions[i].answer) {
                score++;
            }
        }
        
        resultsHTML += `
            <p><strong>ရမှတ်:</strong> ${score}/${questions.length}</p>
            <p><strong>ရာခိုင်နှုန်း:</strong> ${Math.round((score / questions.length) * 100)}%</p>
        `;
        
        // Detailed results
        resultsHTML += '<h3>အသေးစိတ်ရလဒ်</h3><ol>';
        
        for (let i = 0; i < questions.length; i++) {
            const userAnswer = answers[i] !== null ? questions[i].options[answers[i]] : 'မဖြေဆိုပါ';
            const correctAnswer = questions[i].options[questions[i].answer];
            const isCorrect = answers[i] === questions[i].answer;
            
            resultsHTML += `
                <li>
                    <p><strong>မေးခွန်း:</strong> ${questions[i].question}</p>
                    <p class="${isCorrect ? 'correct' : 'incorrect'}"><strong>သင့်အဖြေ:</strong> ${userAnswer}</p>
                    ${!isCorrect ? `<p class="correct"><strong>မှန်ကန်သောအဖြေ:</strong> ${correctAnswer}</p>` : ''}
                </li>
            `;
        }
        
        resultsHTML += '</ol>';
        resultContent.innerHTML = resultsHTML;
    }

    // Close modal
    closeBtn.addEventListener('click', function() {
        resultModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === resultModal) {
            resultModal.style.display = 'none';
        }
    });

    // Start the exam
    initExam();
});

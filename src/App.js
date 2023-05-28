import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import {decode} from 'html-entities';
import Question from './Question';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);



  useEffect(() => {
    fetchQuestions();
  }, []);

  const startGame = () => {
    setStarted(prevState => !prevState)
  }

const fetchQuestions = async () => {
  try {
    const response = await axios.get(
      'https://opentdb.com/api.php?amount=5&type=multiple'
    );
    const data = response.data.results;
    const formattedQuestions = formatQuestions(data);
    setQuestions(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

const formatQuestions = (data) => {
  return data.map((question) => {
    let allAnswers = [...question.incorrect_answers, question.correct_answer];
    allAnswers = allAnswers.map((answer) => {
      return {
        answer: answer,
        id: nanoid(),
      };
    });
    
    const shuffledAnswers = shuffleArray(allAnswers);
    const formattedQuestion = decodeText(question.question);
    const formattedAnswers = shuffledAnswers.map((answer) =>
      ({...answer, answer: decodeText(answer.answer)})
    );
    return {
      question: formattedQuestion,
      answers: formattedAnswers,
      correctAnswer: decodeText(question.correct_answer),
      selectedAnswer: selectedAnswer,
      id: nanoid()
    };
  });
};

const decodeText = (text) => {
  try {
    return decode(text);
  } catch (error) {
    console.error('Error decoding text:', error);
    return text;
  }
};

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleClick = (id, optionId) => {
    setQuestions(prevQuestions => {
      return prevQuestions.map(question => {
        if (question.id === id) {
          return {
            ...question,
            selectedAnswer: optionId
          };
        }
        return question;
      });
    });
  };

  const checkAnswers = () => {
    setSubmitted(prevState => !prevState);
    if (submitted) {
      setStarted(prevState => !prevState);
      setCorrectAnswers(0);
      setSelectedAnswer(null);
      fetchQuestions();
    }
    else {
      setQuestions((prevQuestions) => {
        return prevQuestions.map((question) => {
          const chosenAnswer = question.answers.find(
            (answer) => answer.id === question.selectedAnswer
          );
  
          const isCorrect = (chosenAnswer ? chosenAnswer.answer : '') === question.correctAnswer;
          if (isCorrect) {
            setCorrectAnswers(presCorrectAnswers => presCorrectAnswers + 1);
          }
          return {
            ...question,
            isCorrect: isCorrect,
          };
        });
      });
    }
  };

  
  return (
    <main>
      <img className="top-shape" src="./assets/images/shape-1.png" alt="top-shape" />
      {started ?
        <div className='not-started questions-box'>
          {questions.map(question => (
            <Question
              id={question.id}
              key={question.id}
              question={question.question}
              selectedAnswer={question.selectedAnswer}
              answers={question.answers} 
              handleClick={handleClick}
              submitted={submitted}
              isCorrect={question.isCorrect}
              theCorrectAnswer={question.correctAnswer}
          />
          ))}
          <button onClick={checkAnswers} className="start-btn check-answers">{ submitted ? 'New Game' : 'Check Answers' }</button>
          <span className='score'>{ submitted && `You scored ${correctAnswers} out of ${questions.length}` }</span>
        </div>
        :
        <div>
          <div>
            <div className="not-started">
              <h1>Quizzical</h1>
              <p>Some description if needed.</p>
              <button
                className="start-btn"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      }
      <img className="bottom-shape" src="./assets/images/shape-2.png" alt="bottom-shape" />
    </main>
  );
}

export default QuizApp;

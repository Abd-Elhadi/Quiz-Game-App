const Question = ({
    id,
    question,
    answers,
    selectedAnswer,
    handleClick,
    submitted,
    isCorrect,
    theCorrectAnswer
}) => {
    const handleAnswerClick = (questionId, answerId) => {
        if (!submitted) {
            handleClick(questionId, answerId);
        }
    };
    
    return (
        <div className="box">
            <h3 className="question">{question}</h3>
            <div className="answers">
                {answers.map((answer) => {
                    let className = answer.id === selectedAnswer ? 'selected' : '';
                    if (submitted) {
                        if (answer.id === selectedAnswer) {
                            className = isCorrect  ? 'correct' : 'incorrect';
                        }
                        else if (answer.answer === theCorrectAnswer) {
                            className = 'correct';
                        }
                    }
                    return (
                    <span
                            key={answer.id}
                            className={className}
                            onClick={() => handleAnswerClick(id, answer.id)}
                    >
                        {answer.answer}
                    </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Question;


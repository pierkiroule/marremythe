export default function ReflectionQuestions({ myth, answers, onAnswer }) {
  return (
    <section className="reflection" aria-labelledby="reflection-title">
      <h3 id="reflection-title">Et toi ?</h3>
      <p className="reflection-intro">
        Tu peux choisir une seule question. Pas besoin d’avoir une réponse à
        tout.
      </p>
      <ol className="reflection-questions">
        {myth.questions.map((question, index) => {
          const fieldId = `reflection-${myth.id}-${question.id}`;
          return (
            <li key={question.id}>
              <span className="question-number" aria-hidden="true">
                {index + 1}
              </span>
              <div className="question-content">
                <p id={`${fieldId}-prompt`}>{question.prompt}</p>
                <details className="reflection-writing">
                  <summary>Écrire ma réponse</summary>
                  <label className="sr-only" htmlFor={fieldId}>
                    {question.prompt}
                  </label>
                  <textarea
                    id={fieldId}
                    aria-describedby="reflection-privacy"
                    value={answers[question.id] || ""}
                    maxLength={2000}
                    rows={3}
                    placeholder="Ce qui me vient…"
                    onChange={(event) =>
                      onAnswer(question.id, event.target.value)
                    }
                  />
                </details>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="hint" id="reflection-privacy">
        Tes réponses restent dans cette page. Personne ne les reçoit. Elles
        s’effacent si tu recharges, recommences ou changes tes choix.
      </p>
    </section>
  );
}

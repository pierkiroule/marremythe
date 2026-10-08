export default function ReflectionQuestions({ myth, answers, onAnswer }) {
  return (
    <section className="reflection" aria-labelledby="reflection-title">
      <h3 id="reflection-title">À toi de faire le lien</h3>
      <p className="reflection-intro">
        Une question peut suffire. Prends celle qui te parle, à ton rythme.
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
                  <summary>Poser quelques mots</summary>
                  <label className="sr-only" htmlFor={fieldId}>
                    {question.prompt}
                  </label>
                  <textarea
                    id={fieldId}
                    aria-describedby="reflection-privacy"
                    value={answers[question.id] || ""}
                    maxLength={2000}
                    rows={3}
                    placeholder="Mes mots, mes pistes…"
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
        Ces mots sont pour toi : ils ne sont ni analysés, ni envoyés, ni
        enregistrés. Ils s’effacent si tu quittes ou recommences le parcours.
      </p>
    </section>
  );
}

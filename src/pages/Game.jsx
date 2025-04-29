import React, { useState, useEffect } from "react";
import { questions } from "../data/questions";
import QuestionCard from "../components/QuestionCard";
// import { db } from "../firebase/firebaseConfig";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Game = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!started) return; // No empezar timer si el juego no empezó

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleAnswer(null); // Si se acaba el tiempo, pasar a la siguiente
          return 15; // Reset para la próxima pregunta
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, started]);

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
  };

  const handleExit = () => {
    if (confirm("¿Estás seguro que quieres salir del juego?")) {
      setStarted(false);
      setCurrentQuestion(0);
      setScore(0);
      setTimeLeft(15);
    }
  };

  const handleAnswer = async (selected) => {
    const correct = questions[currentQuestion].correctAnswer;
    if (selected === correct) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(15); // Reset del timer para nueva pregunta
    } else {
      const finalScore = score + (selected === correct ? 1 : 0);
      alert(`¡Juego terminado! Tu puntuación: ${finalScore}`);
      /* try {
        await addDoc(collection(db, "scores"), {
          score: finalScore,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error guardando el puntaje:", error);
      } */
      setStarted(false); // Finalizar juego
    }
  };

  if (!started) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz de Reciclaje ♻️</h1>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600"
          onClick={handleStart}
        >
          Empezar juego
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-2xl font-semibold text-center">
        Tiempo restante: {timeLeft}s
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={handleExit}
      >
        Salir
      </button>
      <QuestionCard
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default Game;

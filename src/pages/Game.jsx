import { useState, useEffect } from "react";
import { questions } from "../data/questions";
import QuestionCard from "../components/QuestionCard";
import { addUser } from "../../userService";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Scoreboard } from "../components/Scoreboard";

const Game = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [email, setEmail] = useState("");
  const [scores, setScores] = useState([]);

  // Función para interpolar color de verde (#22c55e) a rojo (#ef4444)
  function getBarColor(timeLeft, totalTime = 15) {
    const percent = timeLeft / totalTime;
    // Verde:   rgb(34, 197, 94)
    // Rojo:    rgb(239, 68, 68)
    const r = Math.round(34 + (239 - 34) * (1 - percent));
    const g = Math.round(197 + (68 - 197) * (1 - percent));
    const b = Math.round(94 + (68 - 94) * (1 - percent));
    return `rgb(${r},${g},${b})`;
  }

  // Cargar puntajes al iniciar
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("score", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const scoresList = [];
        querySnapshot.forEach((doc) => {
          scoresList.push(doc.data());
        });
        setScores(scoresList);
      } catch (error) {
        console.error("Error obteniendo puntajes:", error);
      }
    };

    if (!started) fetchScores();
  }, [started]);

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
      try {
        await addUser(email, finalScore);
        console.log("Puntaje guardado exitosamente");
      } catch (error) {
        console.error("Error guardando el puntaje:", error);
      }
      setStarted(false); // Finalizar juego
    }
  };

  if (!started) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz de Reciclaje ♻️</h1>
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <InputGroup className="mb-3">
              <Form.Control
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="primary" onClick={handleStart} disabled={!email}>
                Empezar juego
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
        <Scoreboard scores={scores} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-2xl font-semibold text-center">
        Tiempo restante: {timeLeft}s
        <div
          style={{
            height: "10px",
            width: `${(timeLeft / 15) * 100}%`,
            backgroundColor: getBarColor(timeLeft, 15),
            transition: "width 1s linear, background-color 1s linear",
            borderRadius: "8px",
          }}
        ></div>
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

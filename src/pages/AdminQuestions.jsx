import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Cargar preguntas existentes
  useEffect(() => {
    if (!user) return;
    const fetchQuestions = async () => {
      const qCol = collection(db, "questions");
      const qSnap = await getDocs(qCol);
      const qList = [];
      qSnap.forEach((doc) => {
        qList.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(qList);
    };
    fetchQuestions();
  }, [user]);

  // Agregar nueva pregunta
  const handleAdd = async (e) => {
    e.preventDefault();
    if (
      !newQuestion ||
      newOptions.some((opt) => !opt) ||
      !correctAnswer ||
      !newOptions.includes(correctAnswer)
    ) {
      alert("Completa todos los campos y selecciona la respuesta correcta.");
      return;
    }
    await addDoc(collection(db, "questions"), {
      question: newQuestion,
      options: newOptions,
      correctAnswer
    });
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectAnswer("");
    // Recargar preguntas
    const qCol = collection(db, "questions");
    const qSnap = await getDocs(qCol);
    const qList = [];
    qSnap.forEach((doc) => {
      qList.push({ id: doc.id, ...doc.data() });
    });
    setQuestions(qList);
  };

  // Eliminar pregunta
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "questions", id));
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      setLoginError("Credenciales incorrectas");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin - Iniciar sesión</h1>
        <form onSubmit={handleLogin}>
          <input
            className="border p-2 w-full mb-2"
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            type="password"
            placeholder="Contraseña"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Ingresar
          </button>
          {loginError && <div className="text-red-600 mt-2">{loginError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administrar Preguntas</h1>
        <button
          className="text-blue-600 underline"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
      <form onSubmit={handleAdd} className="mb-8">
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Pregunta"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        {newOptions.map((opt, idx) => (
          <input
            key={idx}
            className="border p-2 w-full mb-2"
            type="text"
            placeholder={`Opción ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const arr = [...newOptions];
              arr[idx] = e.target.value;
              setNewOptions(arr);
            }}
          />
        ))}
        <select
          className="border p-2 w-full mb-2"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          <option value="">Selecciona la respuesta correcta</option>
          {newOptions.map(
            (opt, idx) =>
              opt && (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              )
          )}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar pregunta
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Preguntas existentes</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id} className="mb-4 border-b pb-2">
            <div className="font-bold">{q.question}</div>
            <ul className="list-disc ml-6">
              {q.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={
                    opt === q.correctAnswer ? "text-green-600 font-semibold" : ""
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 text-red-600 underline"
              onClick={() => handleDelete(q.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminQuestions;
import React from "react";

export const Scoreboard = ({scores}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Tabla de Puntajes</h2>
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Pos</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((user, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

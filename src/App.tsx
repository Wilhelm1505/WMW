import { useState } from "react";

// Definiere die Typen für das Kriterium und die Perspektive
type Criterion = {
  name: string;
  rating: number;
};

type Perspective = {
  title: string;
  criteria: Criterion[];
};

export default function App() {
  const [view, setView] = useState<"home" | "detail" | "summary">("home");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(true);
  const [mainTopic, setMainTopic] = useState("Strategie des Unternehmens");

  // Initialisiere Perspektiven mit einer korrekt typisierten Struktur
  const [perspectives, setPerspectives] = useState<Perspective[]>([
    { title: "Perspektive 1", criteria: [{ name: "", rating: 3 }] },
    { title: "Perspektive 2", criteria: [{ name: "", rating: 3 }] },
    { title: "Perspektive 3", criteria: [{ name: "", rating: 3 }] },
    { title: "Perspektive 4", criteria: [{ name: "", rating: 3 }] },
  ]);

  // Titel für Perspektiven ändern
  const updateTitle = (index: number, value: string) => {
    const updated = [...perspectives];
    updated[index].title = value;
    setPerspectives(updated);
  };

  // Kriterium hinzufügen
  const addCriterion = (index: number) => {
    const updated = [...perspectives];
    updated[index].criteria.push({ name: "", rating: 3 });
    setPerspectives(updated);
  };

  // Kriterium aktualisieren (Name oder Rating)
  const updateCriterion = (
    pIndex: number,
    cIndex: number,
    field: "name" | "rating",
    value: string
  ) => {
    const updated = [...perspectives];
    updated[pIndex].criteria[cIndex][field] =
      field === "rating" ? Number(value) : value;
    setPerspectives(updated);
  };

  // Durchschnittswerte berechnen
  const calculateAverages = () => {
    return perspectives.map((p) => {
      const ratings = p.criteria.map((c) => c.rating);
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : "-";
      return { title: p.title, average: avg };
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-center space-y-6 relative">
      <div className="flex justify-between items-center">
        <img src="/logo.png" alt="App Logo" className="h-16" />
        <button
          onClick={() => setEditMode(!editMode)}
          className="border rounded px-3 py-1 text-sm"
        >
          {editMode ? "Bearbeitungsmodus beenden" : "Bearbeiten aktivieren"}
        </button>
        <img src="/wmw-logo.jpeg" alt="WMW Logo" className="h-12" />
      </div>

      {view === "home" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Balanced Scorecard App</h1>
          <div className="grid grid-cols-3 grid-rows-3 gap-4 h-[500px]">
            <div></div>
            <Kachel
              value={perspectives[0].title}
              onClick={() => {
                setActiveIndex(0);
                setView("detail");
              }}
              onChange={(e) => updateTitle(0, e.target.value)}
              editMode={editMode}
            />
            <div></div>

            <Kachel
              value={perspectives[2].title}
              onClick={() => {
                setActiveIndex(2);
                setView("detail");
              }}
              onChange={(e) => updateTitle(2, e.target.value)}
              editMode={editMode}
            />

            <Kachel
              value={mainTopic}
              onClick={() => setView("summary")}
              onChange={(e) => setMainTopic(e.target.value)}
              editMode={editMode}
              center
            />

            <Kachel
              value={perspectives[3].title}
              onClick={() => {
                setActiveIndex(3);
                setView("detail");
              }}
              onChange={(e) => updateTitle(3, e.target.value)}
              editMode={editMode}
            />

            <div></div>
            <Kachel
              value={perspectives[1].title}
              onClick={() => {
                setActiveIndex(1);
                setView("detail");
              }}
              onChange={(e) => updateTitle(1, e.target.value)}
              editMode={editMode}
            />
            <div></div>
          </div>
        </>
      )}

      {view === "detail" && activeIndex !== null && (
        <div className="text-left">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {perspectives[activeIndex].title}
          </h2>
          <ul className="space-y-2 mb-4">
            {perspectives[activeIndex].criteria.map((c, cIndex) => (
              <li key={cIndex} className="flex items-center gap-2">
                {editMode ? (
                  <input
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Kriterium"
                    value={c.name}
                    onChange={(e) =>
                      updateCriterion(activeIndex, cIndex, "name", e.target.value)
                    }
                  />
                ) : (
                  <span className="flex-1">{c.name}</span>
                )}
                <select
                  className="border rounded px-2 py-1"
                  value={c.rating}
                  onChange={(e) =>
                    updateCriterion(activeIndex, cIndex, "rating", e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <button className="border rounded px-3 py-1" onClick={() => setView("home")}>
              Zurück
            </button>
            {editMode && (
              <button
                className="bg-blue-600 text-white rounded px-3 py-1"
                onClick={() => addCriterion(activeIndex)}
              >
                + Kriterium
              </button>
            )}
          </div>
        </div>
      )}

      {view === "summary" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{mainTopic}: Auswertung</h2>
          <ul className="space-y-4 text-left max-w-md mx-auto">
            {calculateAverages().map((p, idx) => (
              <li key={idx} className="flex justify-between border-b pb-1">
                <span>{p.title}</span>
                <span>Ø Bewertung: {p.average}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button className="border px-3 py-1 rounded" onClick={() => setView("home")}>
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type KachelProps = {
  value: string;
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  center?: boolean;
};

function Kachel({ value, onClick, onChange, editMode, center }: KachelProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center cursor-pointer border-2 p-2 ${
        center ? "font-semibold text-lg" : ""
      }`}
    >
      {editMode ? (
        <input
          className="text-center text-lg font-medium border-b w-full focus:outline-none"
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={onChange}
        />
      ) : (
        <span className="text-lg font-medium">{value}</span>
      )}
    </div>
  );
}
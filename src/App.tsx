import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale } from "chart.js";

// Chart.js Registrierung
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

type Criterion = {
  name: string;
  rating: number; // rating ist immer eine Zahl von 0 bis 100
};

type Perspective = {
  title: string;
  criteria: Criterion[]; // Kriterien sind ein Array von Criterion-Objekten
};

export default function App() {
  const [view, setView] = useState<"home" | "detail" | "summary">("home");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(true);
  const [mainTopic, setMainTopic] = useState("Platzhalter");

  // Perspektiven-Array mit Platzhaltern
  const [perspectives, setPerspectives] = useState<Perspective[]>([
    { title: "Perspektive 1", criteria: [{ name: "Platzhalter", rating: 50 }] },
    { title: "Perspektive 2", criteria: [{ name: "Platzhalter", rating: 60 }] },
    { title: "Perspektive 3", criteria: [{ name: "Platzhalter", rating: 70 }] },
    { title: "Perspektive 4", criteria: [{ name: "Platzhalter", rating: 80 }] },
  ]);

  // Funktion zum Aktualisieren des Titels einer Perspektive
  const updateTitle = (index: number, value: string) => {
    const updated = [...perspectives];
    updated[index].title = value;
    setPerspectives(updated);
  };

  // Funktion zum Hinzufügen eines Kriteriums zu einer Perspektive
  const addCriterion = (index: number) => {
    const updated = [...perspectives];
    updated[index].criteria.push({ name: "Platzhalter", rating: 50 });
    setPerspectives(updated);
  };

  // Funktion zum Aktualisieren der Kriterium-Daten
  const updateCriterion = (
    pIndex: number, 
    cIndex: number, 
    field: "name" | "rating", 
    value: string
  ) => {
    const updated = [...perspectives]; // Kopiere das Perspektiven-Array
    const criterion = updated[pIndex].criteria[cIndex];
    if (field === "rating") {
      criterion.rating = Number(value); // Wenn "rating", konvertiere in Zahl
    } else {
      criterion.name = value;
    }
    setPerspectives(updated); // Setze die aktualisierten Perspektiven
  };

  // Berechnung der Durchschnittsbewertung für jede Perspektive
  const calculateAverages = () => {
    return perspectives.map((p) => {
      const ratings = p.criteria.map((c) => c.rating); // Alle Bewertungen einer Perspektive
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : "0"; // Durchschnitt berechnen
      return { title: p.title, average: parseFloat(avg) };
    });
  };

  // Daten für das Kreisdiagramm (Doughnut Chart)
  const chartData = {
    labels: ["Durchschnittsbewertung"],
    datasets: [
      {
        label: "Bewertung",
        data: [calculateAverages().reduce((acc, p) => acc + p.average, 0) / perspectives.length],
        backgroundColor: ["#4caf50"], // Farbe des Kreises
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-center space-y-6 relative">
      <div className="flex justify-between items-center">
        {/* Logo oben rechts */}
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

            {/* Platzhalter-Kachel */}
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
                <input
                  className="border rounded px-2 py-1"
                  type="number"
                  min={0}
                  max={100}
                  value={c.rating}
                  onChange={(e) =>
                    updateCriterion(activeIndex, cIndex, "rating", e.target.value)
                  }
                />
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
          <div className="max-w-xs mx-auto">
            <Doughnut data={chartData} />
          </div>
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

// Kachel-Komponente für die einzelnen Perspektiven
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
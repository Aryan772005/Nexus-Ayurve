import React, { useState } from 'react';

interface BodyMapProps {
  onSymptomSelect: (symptoms: string[]) => void;
}

const BODY_REGIONS = [
  { id: 'head', name: 'Head/Brain', x: 150, y: 30, radius: 25, symptoms: ['headache', 'dizziness', 'insomnia', 'migraine', 'anxiety'] },
  { id: 'eyes', name: 'Eyes', x: 150, y: 55, radius: 10, symptoms: ['dry eyes', 'blurriness', 'eye strain'] },
  { id: 'throat', name: 'Throat/Neck', x: 150, y: 90, radius: 15, symptoms: ['cough', 'sore throat', 'thyroid issues'] },
  { id: 'chest', name: 'Chest/Lungs', x: 150, y: 130, radius: 25, symptoms: ['asthma', 'congestion', 'mucus'] },
  { id: 'heart', name: 'Heart', x: 165, y: 140, radius: 15, symptoms: ['palpitations', 'high BP', 'heartburn'] },
  { id: 'stomach', name: 'Stomach/Gut', x: 150, y: 190, radius: 25, symptoms: ['acidity', 'bloating', 'gas', 'nausea', 'constipation'] },
  { id: 'joints_l', name: 'Left Arm Joints', x: 100, y: 150, radius: 15, symptoms: ['joint pain', 'stiffness', 'arthritis'] },
  { id: 'joints_r', name: 'Right Arm Joints', x: 200, y: 150, radius: 15, symptoms: ['joint pain', 'stiffness', 'arthritis'] },
  { id: 'pelvis', name: 'Pelvis', x: 150, y: 250, radius: 25, symptoms: ['irregular periods', 'urinary issue'] },
  { id: 'knees_l', name: 'Left Knee', x: 125, y: 340, radius: 15, symptoms: ['joint pain', 'swelling'] },
  { id: 'knees_r', name: 'Right Knee', x: 175, y: 340, radius: 15, symptoms: ['joint pain', 'swelling'] },
  { id: 'skin', name: 'Skin (General)', x: 90, y: 200, radius: 20, symptoms: ['rash', 'dry skin', 'inflammation', 'sweat'] },
];

export default function BodyMap({ onSymptomSelect }: BodyMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());

  const handleRegionClick = (symptoms: string[]) => {
    const newSelected = new Set<string>(selectedSymptoms);
    let changed = false;
    symptoms.forEach(s => {
      if (!newSelected.has(s)) {
        newSelected.add(s);
        changed = true;
      }
    });

    if (changed) {
      setSelectedSymptoms(newSelected);
      onSymptomSelect(Array.from(newSelected));
    }
  };

  const removeSymptom = (s: string) => {
    const newSelected = new Set<string>(selectedSymptoms);
    newSelected.delete(s);
    setSelectedSymptoms(newSelected);
    onSymptomSelect(Array.from(newSelected));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
      {/* SVB Body Map */}
      <div className="relative w-full max-w-[300px] h-[500px] bg-forest/40 border border-white/5 rounded-3xl mx-auto flex items-center justify-center p-0 overflow-hidden relative">
        <svg viewBox="0 0 300 500" className="w-full h-full drop-shadow-2xl absolute inset-0 z-10">
          
          {/* Base Hologram AI Body */}
          <image 
            href="/hologram_body.png" 
            x="-50" 
            y="0" 
            width="400" 
            height="500" 
            preserveAspectRatio="xMidYMid slice" 
            className="opacity-90 mix-blend-screen pointer-events-none"
          />

          {/* Interactive Regions */}
          {BODY_REGIONS.map((region) => (
            <circle
              key={region.id}
              cx={region.x}
              cy={region.y}
              r={region.radius}
              fill={hoveredRegion === region.id ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.4)"}
              stroke="rgba(52, 211, 153, 1)"
              strokeWidth={hoveredRegion === region.id ? "4" : "2"}
              className="cursor-pointer transition-all duration-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region.symptoms)}
            />
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredRegion && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-forest/90 backdrop-blur-sm border border-emerald-accent text-cream px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap z-10 pointer-events-none">
            {BODY_REGIONS.find(r => r.id === hoveredRegion)?.name}
          </div>
        )}
      </div>

      {/* Selected Symptoms Chips */}
      <div className="w-full md:flex-1 bg-moss/20 p-6 rounded-3xl border border-white/5 h-full">
        <h3 className="text-xl font-display font-bold text-cream mb-4 flex items-center justify-between">
          <span>Detected Symptoms</span>
          <span className="text-sm font-sans bg-emerald-accent/20 text-emerald-accent px-2 py-1 rounded-full">{selectedSymptoms.size} Selected</span>
        </h3>
        
        {selectedSymptoms.size === 0 ? (
          <p className="text-emerald-accent/40 text-sm italic">Click on the body map regions to select symptoms, or use voice/text input.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Array.from<string>(selectedSymptoms).map((s) => (
              <span key={s} className="bg-emerald-accent/10 border border-emerald-accent/30 text-emerald-accent px-3 py-1.5 rounded-full text-sm flex items-center gap-2 group">
                {s}
                <button onClick={() => removeSymptom(s)} className="opacity-50 group-hover:opacity-100 hover:text-rose-400 transition-colors">
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

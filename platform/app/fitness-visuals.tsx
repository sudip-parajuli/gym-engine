// Original schematic illustrations. Coordinates describe a representative setup,
// not a measured range of motion or individualized form instruction.
type Pose = { head: [number, number]; body: string; arms: string[]; legs: string[]; chair?: boolean; prop?: string };
const seated: Pose = { head: [87, 27], body: "87,40 87,78", arms: ["87,47 106,64 121,60"], legs: ["87,78 118,78 125,116", "87,78 110,86 110,116"], chair: true };
const standing: Pose = { head: [100, 23], body: "100,36 100,76", arms: ["100,44 84,62 82,77", "100,44 116,61 120,77"], legs: ["100,76 86,100 83,120", "100,76 114,100 120,120"] };
const poses: Record<string, Pose> = {
  squat: { head: [108, 30], body: "106,43 84,78", arms: ["103,48 125,57 146,57"], legs: ["84,78 120,82 120,119", "84,78 105,90 105,119"], chair: true },
  push: { head: [127, 38], body: "117,48 84,80", arms: ["115,51 134,73 155,73"], legs: ["84,80 60,102 42,120"], prop: "M155 73 H185 M165 73 V121" },
  bridge: { head: [46, 105], body: "60,105 100,75", arms: ["64,103 88,115"], legs: ["100,75 130,69 155,114"], prop: "M28 123 H177" },
  bird: { head: [135, 59], body: "123,67 83,67", arms: ["121,68 150,64 177,62", "119,68 120,116"], legs: ["83,67 55,64 25,63", "83,67 84,100 65,116"], prop: "M20 123 H183" },
  walk: { ...standing, arms: ["100,44 123,57 135,45", "100,44 81,59 68,77"], legs: ["100,76 122,96 136,119", "100,76 81,91 68,116"] },
  row: { ...seated, arms: ["87,46 107,66 110,56"], prop: "M110 56 L177 81 M174 62 V116" },
  press: { ...seated, arms: ["87,46 117,47 141,47"], prop: "M144 33 V66 M67 40 V102 H103" },
  leg: { head: [61, 56], body: "67,68 88,91", arms: ["70,71 66,93"], legs: ["88,91 119,64 146,49", "88,91 115,72 147,60"], prop: "M49 64 L78 108 H106 M141 36 L160 68 M153 62 L177 105" },
  "calf-raise": { ...standing, legs: ["100,76 92,100 93,113 83,120", "100,76 109,100 112,113 104,120"], arms: ["100,44 124,58 145,52"], prop: "M145 52 H175 M154 52 V121" },
  "side-leg": { ...standing, arms: ["100,44 79,55 63,49"], legs: ["100,76 98,119", "100,76 128,97 151,107"], prop: "M35 50 H63 M45 50 V121" },
  curl: { ...seated, arms: ["87,46 107,68 119,45"], prop: "M110 42 L127 48 M110 36 V46 M127 43 V53" },
  "seated-march": { ...seated, legs: ["87,78 112,65 133,91", "87,78 105,85 105,117"] },
  ankle: { ...seated, legs: ["87,78 113,78 121,109 139,103", "87,78 103,87 103,119 121,119"] },
  "seated-twist": { ...seated, body: "94,40 87,78", head: [94, 27], arms: ["94,47 72,59 103,60", "94,47 116,58 86,59"] },
  "neck-turn": { ...seated, head: [94, 27], prop: "M101 26 L108 28 M76 18 Q67 28 76 37 M73 32 L76 37 L69 36" },
  "chest-stretch": { ...seated, arms: ["87,47 62,61 47,55", "87,47 111,61 130,55"] },
  "shoulder-press": { ...seated, arms: ["87,46 66,34 66,12", "87,46 110,34 110,12"], prop: "M57 11 H75 M101 11 H119" },
  "lateral-raise": { ...standing, arms: ["100,44 67,48 41,51", "100,44 132,48 159,51"], prop: "M35 44 V58 M165 44 V58" },
  triceps: { ...standing, arms: ["100,44 116,66 116,89"], prop: "M116 89 H132 M124 89 V14 H173 V116" },
  "hip-hinge": { ...standing, head: [132, 49], body: "120,58 85,77", arms: ["119,59 122,89 121,101"], legs: ["85,77 100,96 100,120", "85,77 82,99 79,120"] },
  "step-up": { ...standing, legs: ["100,76 127,77 127,101", "100,76 86,100 86,120"], arms: ["100,44 120,57 151,51"], prop: "M117 102 H148 V121 H117 Z M151 51 H179 M163 51 V121" },
  "dead-bug": { head: [42, 108], body: "57,108 104,108", arms: ["63,106 67,76 67,51"], legs: ["104,108 107,77 138,78", "104,108 137,107 166,117"], prop: "M25 124 H181" },
  cycle: { ...seated, head: [104, 30], body: "100,43 85,76", arms: ["99,48 122,61 144,53"], legs: ["85,76 115,83 108,111", "85,76 102,65 129,88"], prop: "M69 80 H92 M79 80 V120 M144 53 L135 120 M66 120 H161 M112 108 L128 88" },
  rower: { ...seated, arms: ["87,46 109,61 125,59"], legs: ["87,78 122,91 151,113"], prop: "M70 91 H101 M78 91 V120 H180 M125 59 L172 103" },
};

export function MovementVisual({ slug, name }: { slug: string; name: string }) {
  const p = poses[slug];
  if (!p) return null;
  return <figure className="movement-visual">
    <svg viewBox="0 0 200 142" role="img" aria-label={`${name}: illustrated exercise setup`}>
      <ellipse cx="100" cy="127" rx="80" ry="5" fill="#dce5d6" />
      <g fill="none" stroke="#9ba993" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {p.chair && <path d="M66 60 V88 H105 M71 88 V119 M99 88 V119" />}
        {p.prop && <path d={p.prop} />}
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={p.body} stroke="#416d54" strokeWidth="15" />
        {p.legs.map((line, i) => <polyline key={i} points={line} stroke="#263f36" strokeWidth="8" />)}
        {p.arms.map((line, i) => <polyline key={i} points={line} stroke="#c38b62" strokeWidth="7" />)}
      </g>
      <circle cx={p.head[0]} cy={p.head[1]} r="10" fill="#c38b62" />
    </svg>
    <figcaption>Illustrated setup · read the movement cues</figcaption>
  </figure>;
}

export function FoodVisual({ food, name }: { food: string; name: string }) {
  return <svg viewBox="0 0 180 130" role="img" aria-label={`${name} illustration`} className="food-illustration">
    <ellipse cx="90" cy="113" rx="64" ry="7" fill="#dce5d6" />
    <ellipse cx="90" cy="81" rx="68" ry="35" fill="#fffdf4" stroke="#bccbb4" strokeWidth="3" />
    {["rice", "oats", "dal", "chana", "yogurt"].includes(food) ? <>
      <path d="M44 72 Q47 114 90 113 Q133 114 136 72" fill="#c77d53" />
      <ellipse cx="90" cy="72" rx="46" ry="21" fill={food === "dal" ? "#d6a438" : food === "yogurt" ? "#fffdf3" : "#e8d4a7"} />
      {Array.from({length: 18}, (_, i) => <ellipse key={i} cx={59 + (i * 19 % 63)} cy={61 + (i * 11 % 23)} rx={food === "chana" ? 5 : 3} ry={food === "chana" ? 4 : 1.5} fill={food === "dal" ? "#a37129" : food === "yogurt" ? "#e6eadc" : "#bb995d"} />)}
    </> : food === "roti" ? <>{[0,1,2].map(i => <g key={i}><ellipse cx={90+i*3} cy={84-i*9} rx="44" ry="21" fill="#d7ad69" stroke="#ae7e40" strokeWidth="2" /><path d={`M67 ${76-i*9} l8 4 m17 -5 l7 4 m9 2 l-6 4`} stroke="#aa7338" strokeWidth="3" /></g>)}</>
    : food === "egg" ? <>{[67,110].map(x => <g key={x}><ellipse cx={x} cy="76" rx="25" ry="30" fill="#fffaf0" stroke="#d6cbb0" /><circle cx={x} cy="83" r="13" fill="#e9b13c" /></g>)}</>
    : food === "tofu" ? <>{[0,1,2].map(i => <path key={i} d={`M${49+i*25} ${67+i%2*9} l22 -9 15 13 -22 10 Z m0 0 v22 l15 12 v-21 m-15 21 l-22 -12 v-22`} fill="#f1dfae" stroke="#c1a573" strokeWidth="2" />)}</>
    : food === "nuts" ? <>{Array.from({length: 11}, (_, i) => <ellipse key={i} cx={54+i*23%76} cy={58+i*17%40} rx="10" ry="6" transform={`rotate(${i*37} ${54+i*23%76} ${58+i*17%40})`} fill="#b9824d" stroke="#815b36" />)}</>
    : food === "chicken" ? <><path d="M58 88 Q40 63 67 51 Q92 41 108 62 L125 80 114 94 94 79 Q78 104 58 88" fill="#c67c47" stroke="#9c5935" strokeWidth="3" /><path d="M117 87 l19 12 m-3 -3 l8 -4 m-8 4 l2 9" stroke="#e4d7b9" strokeWidth="9" strokeLinecap="round" /></>
    : food === "fruit" ? <><circle cx="68" cy="78" r="25" fill="#e1a146" /><path d="M86 61 Q115 87 141 63 Q127 113 96 96 Q82 84 86 61" fill="#e7c758" /><path d="M68 51 Q76 35 86 43 Q82 53 68 51" fill="#577c49" /></>
    : <>{[0,1,2,3,4].map(i => <g key={i} transform={`translate(${49+i*18},${66+i%2*15}) rotate(${i*21-40})`}><path d="M0 22 Q-25 -7 0 -21 Q25 -7 0 22" fill={i%2 ? "#74934d" : "#416d54"} /><path d="M0 18 V-13" stroke="#b1c686" strokeWidth="2" /></g>)}<circle cx="127" cy="85" r="13" fill="#cd7250" /></>}
  </svg>;
}

const dietExamples: Record<string, [string, string][]> = {
  "balanced-eating": [["rice", "Rice"], ["dal", "Dal"], ["veg", "Vegetables"]],
  "plant-based": [["chana", "Chickpeas"], ["tofu", "Tofu"], ["veg", "Vegetables"]],
  ketogenic: [["egg", "Eggs"], ["nuts", "Nuts"], ["veg", "Vegetables"]],
  "meat-forward": [["chicken", "Chicken"], ["egg", "Eggs"], ["yogurt", "Yogurt"]],
  dash: [["fruit", "Fruit"], ["oats", "Oats"], ["veg", "Vegetables"]],
  "intermittent-fasting": [["rice", "Meals"], ["dal", "Food quality"], ["veg", "Still matters"]],
};
export function DietVisual({ slug }: { slug: string }) {
  const foods = dietExamples[slug];
  if (!foods) return <MovementVisual slug={slug === "accessible-movement" ? "seated-march" : "walk"} name={slug === "accessible-movement" ? "Seated movement" : "Walking"} />;
  return <figure className="diet-visual"><div>{foods.map(([id, name]) => <div key={id}><FoodVisual food={id} name={name} /><span>{name}</span></div>)}</div><figcaption>{slug === "intermittent-fasting" ? "Meal timing varies; no fasting schedule is prescribed." : "Example ingredients · not a complete meal or portion guide"}</figcaption></figure>;
}

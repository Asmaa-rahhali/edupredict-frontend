export default function ResultBox({ prediction, raw }) {
  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold">🧾 Résultat :</h3>
      <p className={`mt-2 text-xl ${raw === 1 ? 'text-red-600' : 'text-green-600'}`}>
        {prediction}
      </p>
      <p className="text-sm text-gray-500">Code brut : {raw}</p>
    </div>
  );
}

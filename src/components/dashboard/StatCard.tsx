type Props = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

export function StatCard({ icon, label, value }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="text-gray-400 text-sm">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon size={26} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </div>
  );
}
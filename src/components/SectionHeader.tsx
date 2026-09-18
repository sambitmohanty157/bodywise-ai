import React from "react";

type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function SectionHeader({
  icon,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-5 mb-8">
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white">
            {title}
          </h3>

          <p className="text-sm text-surface-gray-400">
            {subtitle}
          </p>
        </div>

      </div>
    </div>
  );
}
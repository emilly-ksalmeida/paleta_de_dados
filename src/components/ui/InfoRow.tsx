interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-row gap-5 items-center">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

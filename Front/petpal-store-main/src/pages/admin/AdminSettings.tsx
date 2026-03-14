import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/services/admin/settings";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return <p>Loading settings...</p>;

  const handleSave = async () => {
    await updateSettings(settings);
    alert("Settings saved");
  };

  return (
    <div className="max-w-lg">
      <form className="space-y-4">
        {Object.entries(settings).map(([key, value]: any) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>

            <input
              value={value}
              onChange={(e) =>
                setSettings({ ...settings, [key]: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
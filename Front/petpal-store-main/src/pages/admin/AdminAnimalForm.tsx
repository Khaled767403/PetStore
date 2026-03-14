import { useMemo, useState } from "react";
import { uploadImage } from "@/services/admin/uploads";
import defaultAnimalImage from "@/assets/pets/defult image.png";
import { resolveMediaUrl } from "@/lib/media";

type AdminAnimalFormValues = {
  name: string;
  slug: string;
  imageUrl: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

export default function AdminAnimalForm({
  onSubmit,
  onCancel,
  initialData,
  saving = false,
}: {
  onSubmit: (data: AdminAnimalFormValues) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<AdminAnimalFormValues>;
  saving?: boolean;
}) {
  const [form, setForm] = useState<AdminAnimalFormValues>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    imageUrl: initialData?.imageUrl ?? null,
  });

  const [uploading, setUploading] = useState(false);

  const previewImage = useMemo(() => {
    if (!form.imageUrl) return defaultAnimalImage;
    return resolveMediaUrl(form.imageUrl);
  }, [form.imageUrl]);

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImage(file);

      setForm((prev) => ({
        ...prev,
        imageUrl: res.url,
      }));
    } catch (error) {
      console.error("Failed to upload animal image", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Animal type name is required");
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      imageUrl: form.imageUrl || null,
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold">Create Animal Type</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: prev.slug ? prev.slug : slugify(e.target.value),
              }))
            }
            placeholder="Example: Dog"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <input
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                slug: e.target.value,
              }))
            }
            placeholder="example: dog"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Animal Image</label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <img
              src={previewImage}
              alt={form.name || "Animal preview"}
              className="h-28 w-28 rounded-xl border border-border object-cover bg-muted"
            />

            <div className="flex-1 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                className="block w-full text-sm"
              />

              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: null,
                    }))
                  }
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
                >
                  Use Default Image
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                If you do not upload an image, the default animal image will be used in the storefront.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Animal Type"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
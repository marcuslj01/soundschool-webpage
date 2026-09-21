export type AssetKind =
  | "pack-zip"
  | "pack-preview"
  | "pack-image"
  | "midi-file"
  | "midi-preview";

// Uploads a file straight to Firebase Storage via a server-issued signed URL
// and returns the resulting download URL.
export async function uploadAsset(
  kind: AssetKind,
  file: File,
  token: string
): Promise<string> {
  const urlResponse = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ kind, fileName: file.name, fileSize: file.size }),
  });

  if (!urlResponse.ok) {
    const errorData = await urlResponse.json().catch(() => ({}));
    throw new Error(errorData.error || "Could not get upload URL");
  }

  const { uploadUrl, contentType, file_url } = await urlResponse.json();

  const uploadResult = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!uploadResult.ok) {
    throw new Error("Could not upload file to storage");
  }

  return file_url;
}

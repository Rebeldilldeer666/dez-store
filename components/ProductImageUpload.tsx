'use client';
import { useState } from 'react';
import { ProductImageUpload } from '@/components/ProductImageUpload';

export default function NewProductPage() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Add Product</h1>

      <ProductImageUpload onUploaded={setImageUrl} />

      {imageUrl && (
        <div className="space-y-2">
          <p className="text-xs text-green-600 break-all">Saved: {imageUrl}</p>
          <img src={imageUrl} className="w-full rounded-xl" />
          {/* Save this imageUrl to your DB when you save the product */}
          <input type="hidden" value={imageUrl} name="image" />
        </div>
      )}

      <button
        onClick={() => console.log('Save product with image:', imageUrl)}
        className="bg-black text-white px-4 py-2 rounded-lg w-full"
      >
        Save Product
      </button>
    </div>
  );
}mkdir -p components
cat > components/ProductImageUpload.tsx <<'EOF'
'use client';
import { useState } from 'react';

export function ProductImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        onUploaded(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-zinc-50">
        <input type="file" accept="image/*" onChange={handleChange} disabled={uploading} className="hidden" />
        {preview? (
          <img src={preview} className="w-32 h-32 object-cover mx-auto rounded-lg" />
        ) : (
          <span className="text-sm">Click to upload product image</span>
        )}
        {uploading && <p className="text-xs mt-2 animate-pulse">Uploading to Vercel Blob...</p>}
      </label>
    </div>
  );
}
EOF

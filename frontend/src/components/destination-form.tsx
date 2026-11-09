'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { Destination } from '@/lib/types';

type DestinationInput = Omit<Destination, '_id'>;

function parseLines(value: string) {
  return value.trim()
    ? value.split(/\r?\n/).map((line) => line.trim())
    : [];
}

export default function DestinationForm({
  destination,
}: {
  destination?: Destination;
}) {
  const router = useRouter();
  const [name, setName] = useState(destination?.name ?? '');
  const [location, setLocation] = useState(destination?.location ?? '');
  const [summary, setSummary] = useState(destination?.summary ?? '');
  const [description, setDescription] = useState(destination?.description ?? '');
  const [notes, setNotes] = useState(destination?.notes ?? '');
  const [category, setCategory] = useState(destination?.category ?? '');
  const [latitude, setLatitude] = useState(destination?.latitude.toString() ?? '');
  const [longitude, setLongitude] = useState(destination?.longitude.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(destination?.imageUrl ?? '');
  const [images, setImages] = useState(destination?.images?.join('\n') ?? '');
  const [imageCredits, setImageCredits] = useState(destination?.imageCredits?.join('\n') ?? '');
  const [imageLicenses, setImageLicenses] = useState(destination?.imageLicenses?.join('\n') ?? '');
  const [imageSourceUrls, setImageSourceUrls] = useState(destination?.imageSourceUrls?.join('\n') ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const payload: DestinationInput = {
      name: name.trim(),
      location: location.trim(),
      summary: summary.trim(),
      description: description.trim(),
      notes: notes.trim(),
      category: category.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      imageUrl: imageUrl.trim(),
      images: parseLines(images).filter(Boolean),
      imageCredits: parseLines(imageCredits),
      imageLicenses: parseLines(imageLicenses),
      imageSourceUrls: parseLines(imageSourceUrls),
    };
    try {
      const saved = await apiRequest<Destination>(
        destination ? `/destinations/${destination._id}` : '/destinations',
        {
          method: destination ? 'PATCH' : 'POST',
          body: JSON.stringify(payload),
        },
      );
      router.push(`/admin/destinations/${saved._id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save destination.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form destination-editor" onSubmit={submit}>
      <label htmlFor="name">Destination name <span>Required</span></label>
      <input id="name" required minLength={1} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Ella" />
      <label htmlFor="location">Location <span>Optional</span></label>
      <input id="location" maxLength={160} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Badulla District, Uva Province" />
      <label htmlFor="summary">Card summary <span>Optional - up to 240 characters</span></label>
      <textarea id="summary" maxLength={240} rows={2} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="A short introduction for the destination card" />
      <label htmlFor="description">Full description <span>Required - shown on the destination page</span></label>
      <textarea id="description" required minLength={1} maxLength={2000} rows={8} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell visitors what makes this place special, what they can see and experience, and what to explore nearby." />
      <label htmlFor="notes">Visitor notes <span>Optional - up to 4,000 characters</span></label>
      <textarea id="notes" maxLength={4000} rows={6} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add more details, recommended activities, nearby sights, or helpful tips for visitors." />
      <label htmlFor="category">Category <span>Optional</span></label>
      <input id="category" maxLength={80} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Culture, Highlands, Coast" />
      <div className="form-grid">
        <div><label htmlFor="latitude">Latitude <span>−90 to 90</span></label><input id="latitude" type="number" step="any" min="-90" max="90" required value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="6.93548" /></div>
        <div><label htmlFor="longitude">Longitude <span>−180 to 180</span></label><input id="longitude" type="number" step="any" min="-180" max="180" required value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="79.84868" /></div>
      </div>
      <label htmlFor="imageUrl">Image URL <span>Optional</span></label>
      <input id="imageUrl" type="url" maxLength={2048} value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/image.jpg" />
      <label htmlFor="images">Additional image URLs <span>Optional - one per line, up to 20</span></label>
      <textarea id="images" maxLength={40960} rows={3} value={images} onChange={(event) => setImages(event.target.value)} placeholder="https://example.com/another-image.jpg" />
      <label htmlFor="imageCredits">Additional photo credits <span>One per image, same order</span></label>
      <textarea id="imageCredits" maxLength={3200} rows={3} value={imageCredits} onChange={(event) => setImageCredits(event.target.value)} placeholder="Photographer name" />
      <label htmlFor="imageLicenses">Additional photo licenses <span>One per image, same order</span></label>
      <textarea id="imageLicenses" maxLength={1600} rows={3} value={imageLicenses} onChange={(event) => setImageLicenses(event.target.value)} placeholder="CC BY-SA 4.0" />
      <label htmlFor="imageSourceUrls">Additional photo source links <span>One per image, same order</span></label>
      <textarea id="imageSourceUrls" maxLength={40960} rows={3} value={imageSourceUrls} onChange={(event) => setImageSourceUrls(event.target.value)} placeholder="https://commons.wikimedia.org/wiki/File:..." />
      <p className="form-hint">Leave blank to use the Sri Lanka Explorer placeholder image.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <Link className="button button-outline" href={destination ? `/admin/destinations/${destination._id}` : '/admin'}>Cancel</Link>
        <button className="button button-dark" type="submit" disabled={saving}>{saving ? 'Saving…' : destination ? 'Save changes' : 'Add destination'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}

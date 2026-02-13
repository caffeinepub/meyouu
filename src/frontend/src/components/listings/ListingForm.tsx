import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import type { PriceDetails } from '../../backend';
import { Currency } from '../../backend';

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  imageUrls: string;
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: {
    title: string;
    description: string;
    price: PriceDetails;
    imageUrls: string[];
  }) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function ListingForm({
  initialData,
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting,
}: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    imageUrls: initialData?.imageUrls || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ListingFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      const priceInE8s = Math.round(parseFloat(formData.price) * 100000000);
      const imageUrlsArray = formData.imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: {
          currencyType: Currency.icp,
          amount: BigInt(priceInE8s),
        },
        imageUrls: imageUrlsArray,
      });
    } catch (error: any) {
      setSubmitError(error.message || 'An error occurred while submitting the form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter listing title"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your item"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">
          Price (ICP) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="0.00"
          className={errors.price ? 'border-destructive' : ''}
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
        <Textarea
          id="imageUrls"
          value={formData.imageUrls}
          onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          rows={3}
        />
        <p className="text-sm text-muted-foreground">Enter one URL per line</p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}

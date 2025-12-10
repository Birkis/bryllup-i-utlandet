export type DestinationHighlight = {
  title: string;
  description?: string;
  icon?: string;
};

export type DestinationLocation = {
  country?: string;
  region?: string;
  city?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
};

export type DestinationCapacity = {
  min?: number;
  max?: number;
};

export type DestinationAverageCosts = {
  venue?: number;
  catering?: number;
  total?: number;
  currency?: string;
};

export type DestinationContactInfo = {
  email?: string;
  phone?: string;
  website?: string;
  bookingInfo?: string;
};

export type DestinationGalleryImage = {
  url?: string;
  alt?: string;
  caption?: string;
};

export type PortableTextSpan = {
  _key: string;
  _type: 'span';
  text: string;
  marks?: string[];
};

export type PortableTextMarkDef = {
  _key: string;
  _type: 'link';
  href?: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: 'block';
  style?: 'normal' | 'blockquote' | 'h2' | 'h3' | 'h4';
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  listItem?: 'bullet' | 'number';
  level?: number;
};

export type PortableTextImageBlock = {
  _key: string;
  _type: 'image';
  url?: string;
  alt?: string;
  caption?: string;
};

export type PortableTextContent = Array<PortableTextBlock | PortableTextImageBlock>;

// Embedded country reference (from query expansion)
export type DestinationCountryRef = {
  id: string;
  name: string;
  slug: string;
};

export type DestinationBase = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  highlights?: DestinationHighlight[];
  location?: DestinationLocation;
  venueTypes?: string[];
  bestTimeToVisit?: string[];
  capacity?: DestinationCapacity;
  averageCosts?: DestinationAverageCosts;
  contactInfo?: DestinationContactInfo;
  isFeatured?: boolean;
  country?: DestinationCountryRef | null;
};

export type DestinationListItem = DestinationBase & {
  imageUrl?: string;
  imageAlt?: string;
  imageGallery?: DestinationGalleryImage[];
};

export type DestinationDetail = DestinationBase & {
  heroImage?: DestinationGalleryImage | null;
  imageGallery?: DestinationGalleryImage[];
  fullDescription?: PortableTextContent;
  keywords?: string[];
  metaDescription?: string;
  isActive?: boolean;
  lastUpdated?: string;
};

// Country and City types (new schema)
export type Country = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  isFeatured?: boolean;
};

export type City = {
  id: string;
  name: string;
  slug: string;
  region?: string;
  imageUrl?: string;
  imageAlt?: string;
  shortDescription?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  isFeatured?: boolean;
  countryId: string;
  country?: Country;
};


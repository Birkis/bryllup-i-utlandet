export const destinationsQuery = `
  *[_type == "destination" && coalesce(isActive, true)] | order(isFeatured desc, name asc) {
    "id": _id,
    name,
    shortDescription,
    "slug": slug.current,
    "imageUrl": heroImage.asset->url,
    "imageAlt": heroImage.alt,
    highlights[] {
      title,
      description,
      icon
    },
    venueTypes,
    bestTimeToVisit,
    location,
    capacity,
    averageCosts,
    contactInfo,
    "imageGallery": imageGallery[]{
      "url": asset->url,
      alt,
      caption
    }
  }
`;

export const destinationBySlugQuery = `
  *[_type == "destination" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    shortDescription,
    fullDescription[] {
      ...,
      ...select(
        _type == "image" => {
          "url": asset->url,
          alt,
          caption
        }
      )
    },
    highlights[] {
      title,
      description,
      icon
    },
    location,
    venueTypes,
    bestTimeToVisit,
    capacity,
    averageCosts,
    contactInfo,
    heroImage {
      "url": asset->url,
      alt,
      caption
    },
    "imageGallery": imageGallery[]{
      "url": asset->url,
      alt,
      caption
    },
    keywords,
    metaDescription,
    isFeatured,
    isActive,
    lastUpdated
  }
`;


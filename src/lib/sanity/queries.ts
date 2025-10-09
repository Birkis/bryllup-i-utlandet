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
  *[_type == "destination" && (slug.current == $slug || slug.current == "/" + $slug)][0] {
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

export const blogPostsQuery = `
  *[_type == "blogPost" && isPublished == true] | order(publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    excerpt,
    tags,
    isPublished,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    }
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    excerpt,
    tags,
    isPublished,
    "featuredImage": {
      "url": featuredImage.asset->url,
      "alt": featuredImage.alt
    },
    content[] {
      ...,
      ...select(
        _type == "image" => {
          "url": asset->url,
          alt,
          caption
        }
      )
    }
  }
`;


export const CONTACT_SERVICE_OPTIONS = [
  'Komplett bryllupsplanlegging',
  'Bryllup i utlandet',
  'Catering',
  'Fotografering',
  'Transport',
  'Toastmaster',
  'Lokaler og venues',
  'Dekorasjon',
  'Musikk og underholdning',
  'Annet',
] as const;

export type ContactServiceOption = (typeof CONTACT_SERVICE_OPTIONS)[number];

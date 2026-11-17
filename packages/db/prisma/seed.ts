/* Seed Le Cercle — Phase 1 (socle)
 * Rôles, langues, devises, catégories, pays (Maroc actif), régions, villes,
 * quartiers (Maroc) + textes de marque traduits.
 * Idempotent : utilise upsert.
 */
import { PrismaClient, RoleSlug, CountryStatus, TransactionType, ListingStatus, ProfessionalStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const flagEmoji = (iso: string) =>
  iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));

const ROLES: { slug: RoleSlug; name: string; permissions: string[] }[] = [
  { slug: 'SUPER_ADMIN', name: 'Super Administrateur', permissions: ['*'] },
  { slug: 'ADMIN', name: 'Administrateur', permissions: ['admin:*'] },
  { slug: 'AGENCY', name: 'Agence', permissions: ['agency:*'] },
  { slug: 'AGENT', name: 'Agent', permissions: ['listing:*', 'lead:*', 'message:*'] },
  { slug: 'PROMOTER', name: 'Promoteur', permissions: ['project:*', 'listing:*'] },
  { slug: 'OWNER', name: 'Propriétaire', permissions: ['listing:*'] },
  { slug: 'USER', name: 'Utilisateur', permissions: [] },
  { slug: 'ASSISTANT', name: 'Assistant', permissions: ['listing:read', 'lead:*', 'message:*'] },
];

const LANGUAGES: { code: string; name: string; dir: string; enabled: boolean }[] = [
  { code: 'fr', name: 'Français', dir: 'ltr', enabled: true },
  { code: 'ar', name: 'العربية', dir: 'rtl', enabled: true },
  { code: 'en', name: 'English', dir: 'ltr', enabled: true },
  { code: 'es', name: 'Español', dir: 'ltr', enabled: true },
  { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ / Amazigh', dir: 'ltr', enabled: false },
  { code: 'pt', name: 'Português', dir: 'ltr', enabled: false },
  { code: 'de', name: 'Deutsch', dir: 'ltr', enabled: false },
  { code: 'it', name: 'Italiano', dir: 'ltr', enabled: false },
  { code: 'nl', name: 'Nederlands', dir: 'ltr', enabled: false },
  { code: 'ru', name: 'Русский', dir: 'ltr', enabled: false },
  { code: 'zh', name: '中文', dir: 'ltr', enabled: false },
  { code: 'tr', name: 'Türkçe', dir: 'ltr', enabled: false },
];

const CURRENCIES = [
  { code: 'MAD', name: 'Dirham marocain', symbol: 'DH' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'Dollar américain', symbol: '$' },
  { code: 'DZD', name: 'Dinar algérien', symbol: 'DA' },
  { code: 'TND', name: 'Dinar tunisien', symbol: 'DT' },
  { code: 'XOF', name: 'Franc CFA (UEMOA)', symbol: 'FCFA' },
  { code: 'XAF', name: 'Franc CFA (CEMAC)', symbol: 'FCFA' },
  { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£' },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R' },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£' },
  { code: 'AED', name: 'Dirham des Émirats', symbol: 'AED' },
  { code: 'SAR', name: 'Riyal saoudien', symbol: 'SAR' },
  { code: 'QAR', name: 'Riyal qatari', symbol: 'QAR' },
  { code: 'KWD', name: 'Dinar koweïtien', symbol: 'KWD' },
  { code: 'JOD', name: 'Dinar jordanien', symbol: 'JOD' },
];

const CATEGORIES = [
  'Appartement', 'Villa', 'Maison', 'Riad', 'Terrain', 'Commerce',
  'Bureau', 'Immeuble', 'Ferme', 'Hôtel', 'Projet immobilier', 'Autres',
];

// Pays : Maroc actif + Maghreb + Afrique (préchargés inactifs) — §9.1
type CountrySeed = { iso: string; name: string; dial: string; currency: string; locales: string };
const COUNTRIES: CountrySeed[] = [
  { iso: 'MA', name: 'Maroc', dial: '+212', currency: 'MAD', locales: 'fr,ar,en,es' },
  // Maghreb (inactifs)
  { iso: 'DZ', name: 'Algérie', dial: '+213', currency: 'DZD', locales: 'fr,ar' },
  { iso: 'TN', name: 'Tunisie', dial: '+216', currency: 'TND', locales: 'fr,ar' },
  { iso: 'LY', name: 'Libye', dial: '+218', currency: 'LYD', locales: 'ar' },
  { iso: 'MR', name: 'Mauritanie', dial: '+222', currency: 'MRU', locales: 'fr,ar' },
  // Afrique (inactifs)
  { iso: 'SN', name: 'Sénégal', dial: '+221', currency: 'XOF', locales: 'fr' },
  { iso: 'CI', name: "Côte d'Ivoire", dial: '+225', currency: 'XOF', locales: 'fr' },
  { iso: 'ML', name: 'Mali', dial: '+223', currency: 'XOF', locales: 'fr' },
  { iso: 'BF', name: 'Burkina Faso', dial: '+226', currency: 'XOF', locales: 'fr' },
  { iso: 'GN', name: 'Guinée', dial: '+224', currency: 'GNF', locales: 'fr' },
  { iso: 'BJ', name: 'Bénin', dial: '+229', currency: 'XOF', locales: 'fr' },
  { iso: 'TG', name: 'Togo', dial: '+228', currency: 'XOF', locales: 'fr' },
  { iso: 'NE', name: 'Niger', dial: '+227', currency: 'XOF', locales: 'fr' },
  { iso: 'CM', name: 'Cameroun', dial: '+237', currency: 'XAF', locales: 'fr,en' },
  { iso: 'GA', name: 'Gabon', dial: '+241', currency: 'XAF', locales: 'fr' },
  { iso: 'CG', name: 'Congo (Brazzaville)', dial: '+242', currency: 'XAF', locales: 'fr' },
  { iso: 'CD', name: 'RD Congo', dial: '+243', currency: 'CDF', locales: 'fr' },
  { iso: 'EG', name: 'Égypte', dial: '+20', currency: 'EGP', locales: 'ar' },
  { iso: 'NG', name: 'Nigéria', dial: '+234', currency: 'NGN', locales: 'en' },
  { iso: 'GH', name: 'Ghana', dial: '+233', currency: 'GHS', locales: 'en' },
  { iso: 'KE', name: 'Kenya', dial: '+254', currency: 'KES', locales: 'en' },
  { iso: 'ET', name: 'Éthiopie', dial: '+251', currency: 'ETB', locales: 'am' },
  { iso: 'TZ', name: 'Tanzanie', dial: '+255', currency: 'TZS', locales: 'sw,en' },
  { iso: 'RW', name: 'Rwanda', dial: '+250', currency: 'RWF', locales: 'en,fr' },
  { iso: 'ZA', name: 'Afrique du Sud', dial: '+27', currency: 'ZAR', locales: 'en' },
  { iso: 'AO', name: 'Angola', dial: '+244', currency: 'AOA', locales: 'pt' },
  { iso: 'TD', name: 'Tchad', dial: '+235', currency: 'XAF', locales: 'fr,ar' },
  { iso: 'MG', name: 'Madagascar', dial: '+261', currency: 'MGA', locales: 'fr,mg' },
  { iso: 'MU', name: 'Maurice', dial: '+230', currency: 'MUR', locales: 'fr,en' },
];

// Pays supplémentaires (Europe + Monde arabe) — §9.1 étendu
const EXTRA_COUNTRIES: CountrySeed[] = [
  { iso: 'FR', name: 'France', dial: '+33', currency: 'EUR', locales: 'fr' },
  { iso: 'ES', name: 'Espagne', dial: '+34', currency: 'EUR', locales: 'es' },
  { iso: 'CH', name: 'Suisse', dial: '+41', currency: 'CHF', locales: 'fr,de,it' },
  { iso: 'BE', name: 'Belgique', dial: '+32', currency: 'EUR', locales: 'fr,nl' },
  { iso: 'PT', name: 'Portugal', dial: '+351', currency: 'EUR', locales: 'pt' },
  { iso: 'IT', name: 'Italie', dial: '+39', currency: 'EUR', locales: 'it' },
  { iso: 'DE', name: 'Allemagne', dial: '+49', currency: 'EUR', locales: 'de' },
  { iso: 'GB', name: 'Royaume-Uni', dial: '+44', currency: 'GBP', locales: 'en' },
  { iso: 'AE', name: 'Émirats Arabes Unis', dial: '+971', currency: 'AED', locales: 'ar,en' },
  { iso: 'SA', name: 'Arabie Saoudite', dial: '+966', currency: 'SAR', locales: 'ar' },
  { iso: 'QA', name: 'Qatar', dial: '+974', currency: 'QAR', locales: 'ar,en' },
  { iso: 'KW', name: 'Koweït', dial: '+965', currency: 'KWD', locales: 'ar' },
  { iso: 'JO', name: 'Jordanie', dial: '+962', currency: 'JOD', locales: 'ar' },
];

// ISO des pays marqués ACTIFS (affichés dans la recherche)
const ACTIVE_ISOS = new Set(['MA', 'DZ', 'TN', 'FR', 'ES', 'CH', 'BE', 'PT', 'IT', 'DE', 'GB', 'AE', 'SA', 'QA', 'KW', 'JO', 'EG']);

// Villes par pays (hors Maroc, géré séparément)
const COUNTRY_CITIES: Record<string, string[]> = {
  DZ: ['Alger', 'Oran', 'Constantine', 'Annaba'],
  TN: ['Tunis', 'Sousse', 'Hammamet', 'Djerba'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux', 'Cannes'],
  ES: ['Madrid', 'Barcelone', 'Marbella', 'Malaga', 'Valence', 'Ibiza'],
  CH: ['Genève', 'Zurich', 'Lausanne', 'Bâle', 'Montreux'],
  BE: ['Bruxelles', 'Anvers'],
  PT: ['Lisbonne', 'Porto', 'Faro'],
  IT: ['Milan', 'Rome', 'Turin'],
  DE: ['Berlin', 'Munich', 'Francfort', 'Düsseldorf'],
  GB: ['Londres', 'Manchester'],
  AE: ['Dubaï', 'Abou Dabi', 'Charjah', 'Ajman'],
  SA: ['Riyad', 'Djeddah', 'La Mecque', 'Médine', 'Dammam'],
  QA: ['Doha'],
  KW: ['Koweït City'],
  JO: ['Amman'],
  EG: ['Le Caire', 'Alexandrie', 'Charm el-Cheikh', 'Hurghada'],
};

const REGIONS_MAROC = [
  'Tanger-Tétouan-Al Hoceïma', "L'Oriental", 'Fès-Meknès', 'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra', 'Casablanca-Settat', 'Marrakech-Safi', 'Drâa-Tafilalet',
  'Souss-Massa', 'Guelmim-Oued Noun', 'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab',
];

// Ville -> région (Maroc)
const CITIES_MAROC: [string, string][] = [
  ['Casablanca', 'Casablanca-Settat'], ['Rabat', 'Rabat-Salé-Kénitra'],
  ['Marrakech', 'Marrakech-Safi'], ['Fès', 'Fès-Meknès'],
  ['Tanger', 'Tanger-Tétouan-Al Hoceïma'], ['Agadir', 'Souss-Massa'],
  ['Meknès', 'Fès-Meknès'], ['Oujda', "L'Oriental"],
  ['Kénitra', 'Rabat-Salé-Kénitra'], ['Tétouan', 'Tanger-Tétouan-Al Hoceïma'],
  ['Salé', 'Rabat-Salé-Kénitra'], ['Témara', 'Rabat-Salé-Kénitra'],
  ['Mohammedia', 'Casablanca-Settat'], ['El Jadida', 'Casablanca-Settat'],
  ['Nador', "L'Oriental"], ['Béni Mellal', 'Béni Mellal-Khénifra'],
  ['Khouribga', 'Béni Mellal-Khénifra'], ['Settat', 'Casablanca-Settat'],
  ['Safi', 'Marrakech-Safi'], ['Essaouira', 'Marrakech-Safi'],
  ['Laâyoune', 'Laâyoune-Sakia El Hamra'], ['Dakhla', 'Dakhla-Oued Ed-Dahab'],
  ['Taroudant', 'Souss-Massa'], ['Ouarzazate', 'Drâa-Tafilalet'],
  ['Errachidia', 'Drâa-Tafilalet'], ['Larache', 'Tanger-Tétouan-Al Hoceïma'],
  ['Al Hoceïma', 'Tanger-Tétouan-Al Hoceïma'], ['Khémisset', 'Rabat-Salé-Kénitra'],
  ['Berkane', "L'Oriental"], ['Taza', 'Fès-Meknès'],
  ['Guelmim', 'Guelmim-Oued Noun'], ['Tiznit', 'Souss-Massa'],
  ['Chefchaouen', 'Tanger-Tétouan-Al Hoceïma'], ['Ifrane', 'Fès-Meknès'],
  ['Asilah', 'Tanger-Tétouan-Al Hoceïma'], ["M'diq", 'Tanger-Tétouan-Al Hoceïma'],
  ['Fnideq', 'Tanger-Tétouan-Al Hoceïma'], ['Martil', 'Tanger-Tétouan-Al Hoceïma'],
  ['Skhirat', 'Rabat-Salé-Kénitra'], ['Bouznika', 'Casablanca-Settat'],
  ['Dar Bouazza', 'Casablanca-Settat'], ['Berrechid', 'Casablanca-Settat'],
  ['Inezgane', 'Souss-Massa'], ['Aït Melloul', 'Souss-Massa'],
  ['Taghazout', 'Souss-Massa'], ['Tamraght', 'Souss-Massa'],
  ['Aourir', 'Souss-Massa'], ['Imintanout', 'Marrakech-Safi'],
  ['Midelt', 'Drâa-Tafilalet'], ['Azrou', 'Fès-Meknès'],
  ['Sidi Ifni', 'Guelmim-Oued Noun'], ['Tan-Tan', 'Guelmim-Oued Noun'],
  ['Smara', 'Laâyoune-Sakia El Hamra'],
];

// Quartiers détaillés (villes listées en 9.4) — les autres reçoivent « Centre-ville ».
const NEIGHBORHOODS: Record<string, string[]> = {
  Casablanca: ['Maârif', 'Anfa', 'Gauthier', 'Racine', 'Bourgogne', 'Ain Diab', 'Californie', 'Oasis', 'Habous', 'Derb Sultan', 'Ain Sebaâ', 'Hay Hassani', 'Sidi Maârouf', 'Bouskoura', 'CIL', 'Belvédère', 'Palmier', 'Longchamp', 'Roches Noires', 'Val Fleuri', 'Sidi Bernoussi', 'Casablanca Finance City'],
  Rabat: ['Agdal', 'Hay Riad', 'Souissi', 'Océan', 'Hassan', 'Orangers', 'Yacoub El Mansour', 'Aviation', 'Akkari', 'Médina', 'Takaddoum', 'Ambassadeurs'],
  Salé: ['Hay Salam', 'Tabriquet', 'Bettana', 'Massira', 'Sabah'],
  Témara: ['Harhoura'],
  Marrakech: ['Guéliz', 'Hivernage', 'Palmeraie', 'Médina', 'Agdal', 'Targa', 'Route de Fès', "Route d'Ouarzazate", "Route de l'Ourika", 'Sidi Ghanem', 'Semlalia', 'Daoudiate', 'Massira', 'Amerchich', 'Annakhil', 'Tamansourt'],
  Tanger: ['Malabata', 'Marshan', 'Achakar', 'Boubana', 'Iberia', 'Californie', 'Centre-ville', 'Médina', 'Branes', 'Mesnana', 'Val Fleuri', 'Playa', 'Charf', 'Souani'],
  Agadir: ['Founty', 'Haut Founty', 'Talborjt', 'Anza', 'Hay Mohammadi', 'Hay Salam', 'Charaf', 'Sonaba', 'Cité Dakhla', 'Les Dunes', 'Marina', 'Secteur Touristique', 'Tilila', 'Bensergao', 'Taddart', 'Al Houda', 'Tikiouine', 'Ihchach', 'Tassila'],
  Fès: ['Ville Nouvelle', 'Médina', 'Narjiss', "Route d'Imouzzer", 'Atlas', 'Saïss', 'Route de Sefrou', 'Montfleuri', 'Ain Chkef', 'Zouagha'],
  Meknès: ['Hamria', 'Marjane', 'Plaisance', 'Wislane', 'Toulal', 'Ville Nouvelle', 'Médina'],
  Oujda: ['Centre-ville', 'Al Qods', 'Hay Al Wifaq', 'Lazaret'],
};

// Textes de marque (sans mention de pays)
const BRAND_TRANSLATIONS: { ns: string; key: string; lang: string; value: string }[] = [
  { ns: 'brand', key: 'slogan.title', lang: 'fr', value: 'Entrez dans le cercle immobilier' },
  { ns: 'brand', key: 'slogan.subtitle', lang: 'fr', value: 'Acheter, vendre, louer en toute simplicité.' },
  { ns: 'brand', key: 'baseline', lang: 'fr', value: 'Plateforme internationale des opportunités immobilières' },
  { ns: 'brand', key: 'baseline', lang: 'en', value: 'International platform for real estate opportunities' },
  { ns: 'brand', key: 'baseline', lang: 'es', value: 'Plataforma internacional de oportunidades inmobiliarias' },
  { ns: 'brand', key: 'baseline', lang: 'ar', value: 'المنصة الدولية للفرص العقارية' },
];

async function main() {
  // Rôles
  for (const r of ROLES) {
    await prisma.role.upsert({ where: { slug: r.slug }, update: { name: r.name, permissions: r.permissions }, create: r });
  }
  // Langues
  for (const l of LANGUAGES) {
    await prisma.language.upsert({ where: { code: l.code }, update: l, create: l });
  }
  // Devises
  for (const c of CURRENCIES) {
    await prisma.currency.upsert({ where: { code: c.code }, update: c, create: c });
  }
  // Catégories (types de biens)
  for (let i = 0; i < CATEGORIES.length; i++) {
    const name = CATEGORIES[i];
    await prisma.category.upsert({ where: { slug: slugify(name) }, update: { name, sort: i }, create: { name, slug: slugify(name), sort: i } });
  }
  // Pays
  const morocco = await prisma.country.upsert({
    where: { isoCode: 'MA' },
    update: { status: CountryStatus.ACTIVE },
    create: { isoCode: 'MA', name: 'Maroc', slug: 'maroc', flagEmoji: '🇲🇦', dialCode: '+212', currencyCode: 'MAD', defaultLocale: 'fr', status: CountryStatus.ACTIVE },
  });
  for (const c of [...COUNTRIES, ...EXTRA_COUNTRIES]) {
    if (c.iso === 'MA') continue;
    const status = ACTIVE_ISOS.has(c.iso) ? CountryStatus.ACTIVE : CountryStatus.INACTIVE;
    await prisma.country.upsert({
      where: { isoCode: c.iso },
      update: { status, name: c.name, dialCode: c.dial, currencyCode: c.currency, defaultLocale: c.locales.split(',')[0], flagEmoji: flagEmoji(c.iso) },
      create: { isoCode: c.iso, name: c.name, slug: slugify(c.name), flagEmoji: flagEmoji(c.iso), dialCode: c.dial, currencyCode: c.currency, defaultLocale: c.locales.split(',')[0], status },
    });
  }
  // Régions + villes + quartiers (Maroc)
  const regionId = new Map<string, number>();
  for (const name of REGIONS_MAROC) {
    const r = await prisma.region.upsert({
      where: { countryId_slug: { countryId: morocco.id, slug: slugify(name) } },
      update: {},
      create: { countryId: morocco.id, name, slug: slugify(name) },
    });
    regionId.set(name, r.id);
  }
  const cityId = new Map<string, number>();
  for (const [city, region] of CITIES_MAROC) {
    const c = await prisma.city.upsert({
      where: { countryId_slug: { countryId: morocco.id, slug: slugify(city) } },
      update: { regionId: regionId.get(region) ?? 0 },
      create: { countryId: morocco.id, regionId: regionId.get(region) ?? 0, name: city, slug: slugify(city) },
    });
    cityId.set(city, c.id);
  }
  for (const [city, districts] of Object.entries(NEIGHBORHOODS)) {
    for (const d of districts) {
      await prisma.neighborhood.upsert({
        where: { cityId_slug: { cityId: cityId.get(city) ?? 0, slug: slugify(d) } },
        update: {},
        create: { cityId: cityId.get(city) ?? 0, name: d, slug: slugify(d) },
      });
    }
  }
  // « Centre-ville » par défaut pour les villes non détaillées
  for (const [city] of CITIES_MAROC) {
    if (NEIGHBORHOODS[city]) continue;
    await prisma.neighborhood.upsert({
      where: { cityId_slug: { cityId: cityId.get(city) ?? 0, slug: 'centre-ville' } },
      update: {},
      create: { cityId: cityId.get(city) ?? 0, name: 'Centre-ville', slug: 'centre-ville' },
    });
  }

  // Villes + quartiers des pays supplémentaires (Maghreb, Europe, monde arabe)
  for (const [iso, cities] of Object.entries(COUNTRY_CITIES)) {
    const country = await prisma.country.findUnique({ where: { isoCode: iso } });
    if (!country) continue;
    const region = await prisma.region.upsert({
      where: { countryId_slug: { countryId: country.id, slug: 'region-principale' } },
      update: {},
      create: { countryId: country.id, name: 'Région principale', slug: 'region-principale' },
    });
    for (const cityName of cities) {
      const city = await prisma.city.upsert({
        where: { countryId_slug: { countryId: country.id, slug: slugify(cityName) } },
        update: { regionId: region.id },
        create: { countryId: country.id, regionId: region.id, name: cityName, slug: slugify(cityName) },
      });
      await prisma.neighborhood.upsert({
        where: { cityId_slug: { cityId: city.id, slug: 'centre-ville' } },
        update: {},
        create: { cityId: city.id, name: 'Centre-ville', slug: 'centre-ville' },
      });
    }
  }

  // Traductions de marque
  for (const t of BRAND_TRANSLATIONS) {
    await prisma.translation.upsert({
      where: { lang_ns_key: { lang: t.lang, ns: t.ns, key: t.key } },
      update: { value: t.value },
      create: t,
    });
  }

  // ---- Démo : compte admin + annonces (marquées « démo », supprimables en un clic) ----
  const demoUser = await prisma.user.upsert({
    where: { email: 'admin@lecercle.test' },
    update: {},
    create: {
      email: 'admin@lecercle.test',
      passwordHash: await argon2.hash('demo1234'),
      firstName: 'Démo',
      lastName: 'Admin',
      locale: 'fr',
      status: 'ACTIVE',
      roleId: (await prisma.role.findUnique({ where: { slug: RoleSlug.ADMIN } }))!.id,
    },
  });

  const categoryId = async (slug: string) =>
    (await prisma.category.findUnique({ where: { slug } }))!.id;

  const demoListings: {
    ref: string;
    title: string;
    type: string;
    city: string;
    neighborhood?: string;
    price: number;
    surface?: number;
    landSurface?: number;
    bedrooms?: number;
    bathrooms?: number;
    transaction: TransactionType;
    featured?: boolean;
  }[] = [
    { ref: 'DEMO-001', title: 'Appartement moderne à Guéliz', type: 'appartement', city: 'Marrakech', neighborhood: 'Guéliz', price: 1250000, surface: 120, bedrooms: 3, bathrooms: 2, transaction: TransactionType.SALE, featured: true },
    { ref: 'DEMO-002', title: 'Villa avec piscine à Anfa', type: 'villa', city: 'Casablanca', neighborhood: 'Anfa', price: 4900000, surface: 320, bedrooms: 5, bathrooms: 4, transaction: TransactionType.SALE, featured: true },
    { ref: 'DEMO-003', title: 'Terrain à Palmeraie', type: 'terrain', city: 'Marrakech', neighborhood: 'Palmeraie', price: 850000, surface: 400, landSurface: 400, transaction: TransactionType.SALE },
    { ref: 'DEMO-004', title: 'Appartement à louer à Hay Riad', type: 'appartement', city: 'Rabat', neighborhood: 'Hay Riad', price: 12000, surface: 85, bedrooms: 2, bathrooms: 1, transaction: TransactionType.RENT },
    { ref: 'DEMO-005', title: 'Local commercial au centre-ville', type: 'commerce', city: 'Casablanca', neighborhood: 'Centre-ville', price: 2300000, surface: 150, transaction: TransactionType.SALE },
    { ref: 'DEMO-006', title: 'Riad traditionnel à la Médina', type: 'maison', city: 'Marrakech', neighborhood: 'Médina', price: 1950000, surface: 210, bedrooms: 4, bathrooms: 3, transaction: TransactionType.SALE, featured: true },
    { ref: 'DEMO-007', title: 'Riad de charme avec patio', type: 'riad', city: 'Marrakech', neighborhood: 'Médina', price: 2650000, surface: 260, bedrooms: 5, bathrooms: 4, transaction: TransactionType.SALE, featured: true },
    { ref: 'DEMO-008', title: 'Appartement standing à la Marina', type: 'appartement', city: 'Casablanca', neighborhood: 'Anfa', price: 1800000, surface: 140, bedrooms: 3, bathrooms: 2, transaction: TransactionType.SALE },
    { ref: 'DEMO-009', title: 'Bureau en location au centre', type: 'bureau', city: 'Casablanca', neighborhood: 'Centre-ville', price: 18000, surface: 90, transaction: TransactionType.RENT },
    { ref: 'DEMO-010', title: 'Villa moderne à Dar Bouazza', type: 'villa', city: 'Casablanca', neighborhood: 'Anfa', price: 3800000, surface: 280, bedrooms: 4, bathrooms: 3, transaction: TransactionType.SALE },
    { ref: 'DEMO-011', title: 'Appartement lumineux à Agdal', type: 'appartement', city: 'Rabat', neighborhood: 'Agdal', price: 1450000, surface: 110, bedrooms: 3, bathrooms: 2, transaction: TransactionType.SALE, featured: true },
    { ref: 'DEMO-012', title: 'Maison à louer à Malabata', type: 'maison', city: 'Tanger', neighborhood: 'Malabata', price: 15000, surface: 180, bedrooms: 3, bathrooms: 2, transaction: TransactionType.RENT },
  ];

  for (const d of demoListings) {
    const city = await prisma.city.findUnique({
      where: { countryId_slug: { countryId: morocco.id, slug: slugify(d.city) } },
    });
    if (!city) continue;
    const neighborhood = d.neighborhood
      ? await prisma.neighborhood.findFirst({ where: { cityId: city.id, name: d.neighborhood } })
      : null;

    await prisma.listing.upsert({
      where: { ref: d.ref },
      update: {
        title: d.title,
        typeId: await categoryId(d.type),
        transaction: d.transaction,
        price: d.price,
        surface: d.surface,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        featured: d.featured ?? false,
      },
      create: {
        ref: d.ref,
        title: d.title,
        description: 'Annonce de démonstration « le cercle » — données fictives supprimables en un clic.',
        transaction: d.transaction,
        price: d.price,
        typeId: await categoryId(d.type),
        countryId: morocco.id,
        regionId: city.regionId,
        cityId: city.id,
        neighborhoodId: neighborhood?.id,
        surface: d.surface,
        landSurface: d.landSurface,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        status: ListingStatus.PUBLISHED,
        featured: d.featured ?? false,
        authorId: demoUser.id,
        publishedAt: new Date(),
        images: {
          create: [1, 2, 3].map((i) => ({
            url: `https://picsum.photos/seed/${d.ref}-${i}/640/480`,
            sort: i,
            isPrimary: i === 1,
          })),
        },
      },
    });
  }

  // Coordonnées de démo (pour la carte)
  const demoCoords: Record<string, [number, number]> = {
    'DEMO-001': [31.633, -8.008],
    'DEMO-002': [33.595, -7.662],
    'DEMO-003': [31.68, -7.98],
    'DEMO-004': [33.95, -6.87],
    'DEMO-005': [33.59, -7.61],
    'DEMO-006': [31.63, -7.99],
    'DEMO-007': [31.628, -7.981],
    'DEMO-008': [33.606, -7.658],
    'DEMO-009': [33.593, -7.62],
    'DEMO-010': [33.55, -7.72],
    'DEMO-011': [33.986, -6.855],
    'DEMO-012': [35.78, -5.8],
  };
  for (const [ref, [lat, lng]] of Object.entries(demoCoords)) {
    await prisma.listing.update({ where: { ref }, data: { lat, lng } });
  }

  // Nettoyage : l'ancienne catégorie « Local commercial » a été renommée « Commerce ».
  await prisma.category.deleteMany({ where: { slug: 'local-commercial' } });

  // ---- Démo : agents / agences / promoteurs ----
  const roleId = async (slug: RoleSlug) => (await prisma.role.findUnique({ where: { slug } }))!.id;
  const agentRole = await roleId(RoleSlug.AGENT);
  const agencyRole = await roleId(RoleSlug.AGENCY);
  const devRole = await roleId(RoleSlug.PROMOTER);

  const demoAgents = [
    { email: 'yasmine@lecercle.test', first: 'Yasmine', last: 'El Amrani', city: 'Casablanca', phone: '+212 6 11 22 33 44', bio: 'Spécialiste du résidentiel à Casablanca.' },
    { email: 'karim@lecercle.test', first: 'Karim', last: 'Benali', city: 'Marrakech', phone: '+212 6 22 33 44 55', bio: 'Villas et riads à Marrakech.' },
    { email: 'salma@lecercle.test', first: 'Salma', last: 'Berrada', city: 'Rabat', phone: '+212 6 33 44 55 66', bio: 'Appartements et bureaux à Rabat.' },
    { email: 'omar@lecercle.test', first: 'Omar', last: 'Tazi', city: 'Tanger', phone: '+212 6 44 55 66 77', bio: 'Immobilier haut de gamme à Tanger.' },
    { email: 'nadia@lecercle.test', first: 'Nadia', last: 'Chraibi', city: 'Fès', phone: '+212 6 55 66 77 88', bio: 'Riads et maisons d’hôtes à Fès.' },
    { email: 'mehdi@lecercle.test', first: 'Mehdi', last: 'Alaoui', city: 'Casablanca', phone: '+212 6 66 77 88 99', bio: 'Investissement et rendement locatif.' },
    { email: 'amina@lecercle.test', first: 'Amina', last: 'Bennani', city: 'Marrakech', phone: '+212 6 77 88 99 00', bio: 'Conciergerie et biens de prestige.' },
    { email: 'youssef@lecercle.test', first: 'Youssef', last: 'Idrissi', city: 'Agadir', phone: '+212 6 88 99 00 11', bio: 'Bord de mer et résidences balnéaires.' },
  ];
  for (const a of demoAgents) {
    const city = await prisma.city.findUnique({ where: { countryId_slug: { countryId: morocco.id, slug: slugify(a.city) } } });
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { email: a.email, passwordHash: await argon2.hash('demo1234'), firstName: a.first, lastName: a.last, locale: 'fr', status: 'ACTIVE', roleId: agentRole },
    });
    await prisma.agent.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, phone: a.phone, whatsapp: a.phone, bio: a.bio, cityId: city?.id, status: ProfessionalStatus.ACTIVE },
    });
  }

  const demoAgencies = [
    { email: 'contact@atlasimmo.test', name: 'Atlas Immo', city: 'Casablanca', phone: '+212 5 22 11 22 33' },
    { email: 'contact@casacenter.test', name: 'Casa Center', city: 'Marrakech', phone: '+212 5 24 33 44 55' },
  ];
  for (const ag of demoAgencies) {
    const city = await prisma.city.findUnique({ where: { countryId_slug: { countryId: morocco.id, slug: slugify(ag.city) } } });
    const user = await prisma.user.upsert({
      where: { email: ag.email },
      update: {},
      create: { email: ag.email, passwordHash: await argon2.hash('demo1234'), firstName: ag.name, locale: 'fr', status: 'ACTIVE', roleId: agencyRole },
    });
    await prisma.agency.upsert({
      where: { slug: slugify(ag.name) },
      update: {},
      create: { ownerId: user.id, name: ag.name, slug: slugify(ag.name), email: ag.email, phone: ag.phone, cityId: city?.id, description: `Agence immobilière ${ag.name}.`, status: ProfessionalStatus.ACTIVE },
    });
  }

  const demoDevelopers = [
    { email: 'contact@alomranedemo.test', name: 'Al Omrane Démo', city: 'Rabat' },
    { email: 'contact@marrakechdev.test', name: 'Marrakech Développement', city: 'Marrakech' },
  ];
  for (const d of demoDevelopers) {
    const city = await prisma.city.findUnique({ where: { countryId_slug: { countryId: morocco.id, slug: slugify(d.city) } } });
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: { email: d.email, passwordHash: await argon2.hash('demo1234'), firstName: d.name, locale: 'fr', status: 'ACTIVE', roleId: devRole },
    });
    await prisma.developer.upsert({
      where: { slug: slugify(d.name) },
      update: {},
      create: { ownerId: user.id, name: d.name, slug: slugify(d.name), email: d.email, cityId: city?.id, description: `Promoteur immobilier ${d.name}.`, status: ProfessionalStatus.ACTIVE },
    });
  }

  // ---- Étiquettes (labels) ----
  const labelDefs = [
    { slug: 'sold', fr: 'Vendu', ar: 'مُباع', en: 'Sold', es: 'Vendido' },
    { slug: 'rented', fr: 'Loué', ar: 'مؤجَّر', en: 'Rented', es: 'Alquilado' },
    { slug: 'new', fr: 'Nouveau', ar: 'جديد', en: 'New', es: 'Nuevo' },
    { slug: 'exclusive', fr: 'Exclusivité', ar: 'حصري', en: 'Exclusive', es: 'Exclusivo' },
    { slug: 'reduced', fr: 'Prix réduit', ar: 'سعر مخفّض', en: 'Reduced price', es: 'Precio reducido' },
  ];
  const labelIds: Record<string, number> = {};
  for (const [i, ld] of labelDefs.entries()) {
    const label = await prisma.label.upsert({
      where: { slug: ld.slug },
      update: {},
      create: { slug: ld.slug, nameFr: ld.fr, nameAr: ld.ar, nameEn: ld.en, nameEs: ld.es, sort: i },
    });
    labelIds[ld.slug] = label.id;
  }

  const labelsByRef: Record<string, string[]> = {
    'DEMO-001': ['exclusive', 'new'],
    'DEMO-002': ['sold'],
    'DEMO-003': ['rented'],
    'DEMO-004': ['reduced'],
  };
  const allListings = await prisma.listing.findMany({ select: { id: true, ref: true } });
  for (const l of allListings) {
    for (const slug of labelsByRef[l.ref] ?? []) {
      await prisma.listingLabel.upsert({
        where: { listingId_labelId: { listingId: l.id, labelId: labelIds[slug] } },
        update: {},
        create: { listingId: l.id, labelId: labelIds[slug] },
      });
    }
  }

  const stats = {
    roles: await prisma.role.count(),
    languages: await prisma.language.count(),
    currencies: await prisma.currency.count(),
    categories: await prisma.category.count(),
    countries: await prisma.country.count(),
    regions: await prisma.region.count(),
    cities: await prisma.city.count(),
    neighborhoods: await prisma.neighborhood.count(),
  };
  console.log('✅ Seed terminé :', stats);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

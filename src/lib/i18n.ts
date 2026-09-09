export const LOCALES = ['en', 'hi', 'gu'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  gu: 'ગુજરાતી',
}

const translations = {
  en: {
    home: 'Home', about: 'About Us', villages: 'Our Villages', familyTree: 'Family Tree',
    events: 'Events', gallery: 'Gallery', committee: 'Committee', documents: 'Documents',
    contact: 'Contact Us', search: 'Search', language: 'Language', navigate: 'Navigate',
    community: 'Community', allRightsReserved: 'All rights reserved.', selectLanguage: 'Select language',
    exploreVillages: 'Explore Our Villages', ourHeritage: 'Our Heritage', ourHistory: 'Our History',
    villagesOfSayla: 'Villages of Sayla State', sharedHeritage: 'Nine villages, one shared heritage. Explore each village\'s story, people and family tree.',
    noVillages: 'Villages will appear here once the Super Admin adds them from the admin panel.',
    upcomingEvents: 'Upcoming Events', latestNews: 'Latest News', viewAll: 'View all',
    galleryHighlights: 'Gallery Highlights', viewGallery: 'View gallery', aboutContentPending: 'About Us content will appear here once the Super Admin fills it in from Website Settings in the admin panel.',
    noVillagesPublished: 'No villages published yet. The Super Admin can add all 9 Sayla State villages from the admin panel.',
    nineVillageSummary: 'Nine villages, each with its own profile, history and family tree.',
    committeeLeadership: 'Committee & Leadership', committeeIntro: 'The people who guide the Rana community forward.',
    committeePending: 'Committee members will appear here once added by the Super Admin.',
    documentsIntro: 'Community forms, notices, rules and reports.', documentsPending: 'No documents published yet. The Super Admin can upload forms, notices, rules and reports from the admin panel.',
    address: 'Address', phone: 'Phone', email: 'Email', contactPending: 'Contact details will appear here once the Super Admin adds them under Website Settings.',
    noResults: 'No results found for', people: 'People', searchPlaceholder: 'Search villages, people, events, announcements…',
    pastEvents: 'Past Events', noUpcomingEvents: 'No upcoming events yet.', noPastEvents: 'No past events yet.',
    noNews: 'No news or announcements published yet.', filterAll: 'All', communityAnnouncements: 'Community', villageSpecific: 'Village', importantNotice: 'Notice',
    noGallery: 'No gallery items published yet.', noMatches: 'No matches.', viewFamilyTree: 'View Family Tree', history: 'History',
  },
  hi: {
    home: 'होम', about: 'हमारे बारे में', villages: 'हमारे गांव', familyTree: 'वंश वृक्ष',
    events: 'कार्यक्रम', gallery: 'गैलरी', committee: 'समिति', documents: 'दस्तावेज़',
    contact: 'संपर्क करें', search: 'खोजें', language: 'भाषा', navigate: 'नेविगेशन',
    community: 'समुदाय', allRightsReserved: 'सर्वाधिकार सुरक्षित।', selectLanguage: 'भाषा चुनें',
    exploreVillages: 'हमारे गांव देखें', ourHeritage: 'हमारी विरासत', ourHistory: 'हमारा इतिहास',
    villagesOfSayla: 'सैला राज्य के गांव', sharedHeritage: 'नौ गांव, एक साझा विरासत। हर गांव की कहानी, लोगों और वंश वृक्ष को जानें।',
    noVillages: 'सुपर एडमिन द्वारा गांव जोड़ने के बाद वे यहां दिखाई देंगे।', noVillagesPublished: 'अभी कोई गांव प्रकाशित नहीं हुआ है।',
    upcomingEvents: 'आगामी कार्यक्रम', latestNews: 'नवीनतम समाचार', viewAll: 'सभी देखें', galleryHighlights: 'गैलरी मुख्य आकर्षण', viewGallery: 'गैलरी देखें',
    aboutContentPending: 'सुपर एडमिन द्वारा एडमिन पैनल में वेबसाइट सेटिंग्स से सामग्री जोड़ने के बाद हमारे बारे में जानकारी यहां दिखाई देगी।',
    nineVillageSummary: 'नौ गांव, प्रत्येक की अपनी प्रोफाइल, इतिहास और वंश वृक्ष है।', committeeLeadership: 'समिति और नेतृत्व', committeeIntro: 'राणा समुदाय को आगे बढ़ाने वाले लोग।', committeePending: 'सुपर एडमिन द्वारा जोड़ने के बाद समिति सदस्य यहां दिखाई देंगे।',
    documentsIntro: 'समुदाय के फॉर्म, सूचनाएं, नियम और रिपोर्ट।', documentsPending: 'अभी कोई दस्तावेज़ प्रकाशित नहीं हुआ है।', address: 'पता', phone: 'फोन', email: 'ईमेल', contactPending: 'सुपर एडमिन द्वारा वेबसाइट सेटिंग्स में संपर्क विवरण जोड़ने के बाद वे यहां दिखाई देंगे।',
    noResults: 'के लिए कोई परिणाम नहीं मिला', people: 'लोग', searchPlaceholder: 'गांव, लोग, कार्यक्रम, घोषणाएं खोजें…', pastEvents: 'पिछले कार्यक्रम', noUpcomingEvents: 'अभी कोई आगामी कार्यक्रम नहीं है।', noPastEvents: 'अभी कोई पिछला कार्यक्रम नहीं है।', noNews: 'अभी कोई समाचार या घोषणा प्रकाशित नहीं हुई है।', filterAll: 'सभी', communityAnnouncements: 'समुदाय', villageSpecific: 'गांव', importantNotice: 'सूचना', noGallery: 'अभी कोई गैलरी सामग्री प्रकाशित नहीं हुई है।', noMatches: 'कोई मिलान नहीं।', viewFamilyTree: 'वंश वृक्ष देखें', history: 'इतिहास',
  },
  gu: {
    home: 'હોમ', about: 'અમારા વિશે', villages: 'અમારા ગામો', familyTree: 'વંશ વૃક્ષ',
    events: 'કાર્યક્રમો', gallery: 'ગેલેરી', committee: 'સમિતિ', documents: 'દસ્તાવેજો',
    contact: 'સંપર્ક કરો', search: 'શોધો', language: 'ભાષા', navigate: 'નેવિગેશન',
    community: 'સમુદાય', allRightsReserved: 'સર્વાધિકાર સુરક્ષિત.', selectLanguage: 'ભાષા પસંદ કરો',
    exploreVillages: 'અમારા ગામો જુઓ', ourHeritage: 'આપણો વારસો', ourHistory: 'આપણો ઇતિહાસ', villagesOfSayla: 'સૈલા રાજ્યના ગામો', sharedHeritage: 'નવ ગામો, એક સહિયારો વારસો. દરેક ગામની વાર્તા, લોકો અને વંશ વૃક્ષ જાણો.', noVillages: 'સુપર એડમિન ગામો ઉમેરે પછી તે અહીં દેખાશે.', noVillagesPublished: 'હજુ સુધી કોઈ ગામ પ્રકાશિત થયું નથી.', upcomingEvents: 'આગામી કાર્યક્રમો', latestNews: 'તાજેતરના સમાચાર', viewAll: 'બધા જુઓ', galleryHighlights: 'ગેલેરીના મુખ્ય આકર્ષણો', viewGallery: 'ગેલેરી જુઓ', aboutContentPending: 'સુપર એડમિન એડમિન પેનલમાં વેબસાઇટ સેટિંગ્સમાંથી સામગ્રી ઉમેરે પછી અમારા વિશેની માહિતી અહીં દેખાશે.', nineVillageSummary: 'નવ ગામો, દરેકની પોતાની પ્રોફાઇલ, ઇતિહાસ અને વંશ વૃક્ષ છે.', committeeLeadership: 'સમિતિ અને નેતૃત્વ', committeeIntro: 'રાણા સમુદાયને આગળ વધારતા લોકો.', committeePending: 'સુપર એડમિન ઉમેરે પછી સમિતિના સભ્યો અહીં દેખાશે.', documentsIntro: 'સમુદાયના ફોર્મ, સૂચનાઓ, નિયમો અને અહેવાલો.', documentsPending: 'હજુ સુધી કોઈ દસ્તાવેજ પ્રકાશિત થયો નથી.', address: 'સરનામું', phone: 'ફોન', email: 'ઈમેલ', contactPending: 'સુપર એડમિન વેબસાઇટ સેટિંગ્સમાં સંપર્ક વિગતો ઉમેરે પછી તે અહીં દેખાશે.', noResults: 'માટે કોઈ પરિણામ મળ્યું નથી', people: 'લોકો', searchPlaceholder: 'ગામો, લોકો, કાર્યક્રમો, જાહેરાતો શોધો…', pastEvents: 'ભૂતકાળના કાર્યક્રમો', noUpcomingEvents: 'હજુ કોઈ આગામી કાર્યક્રમ નથી.', noPastEvents: 'હજુ કોઈ ભૂતકાળનો કાર્યક્રમ નથી.', noNews: 'હજુ સુધી કોઈ સમાચાર અથવા જાહેરાત પ્રકાશિત થઈ નથી.', filterAll: 'બધા', communityAnnouncements: 'સમુદાય', villageSpecific: 'ગામ', importantNotice: 'સૂચના', noGallery: 'હજુ સુધી કોઈ ગેલેરી સામગ્રી પ્રકાશિત થઈ નથી.', noMatches: 'કોઈ મેળ નથી.', viewFamilyTree: 'વંશ વૃક્ષ જુઓ', history: 'ઇતિહાસ',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && LOCALES.includes(value as Locale))
}

export function getTranslations(locale: Locale) {
  return translations[locale]
}

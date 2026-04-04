// Local track database — Deezer track IDs only.
// Preview URLs are fetched fresh at load time (they expire).

export interface TrackEntry {
  id: number
  title: string
  artist: string
}

export interface CategoryDef {
  key: string
  label: string
  emoji: string
  tracks: TrackEntry[]
}

export const CATEGORIES: CategoryDef[] = [
  // === SUPER HITS PER ÅRTIONDE ===
  {
    key: '70s', label: '70-tal', emoji: '🕺',
    tracks: [
      { id: 916424, title: 'Bohemian Rhapsody', artist: 'Queen' },
      { id: 1109731, title: "Stayin' Alive", artist: 'Bee Gees' },
      { id: 68518, title: 'Stairway to Heaven', artist: 'Led Zeppelin' },
      { id: 2762723, title: 'Dancing Queen', artist: 'ABBA' },
      { id: 695498, title: 'Hotel California', artist: 'Eagles' },
      { id: 3129028, title: 'Back in Black', artist: 'AC/DC' },
      { id: 1109734, title: 'Night Fever', artist: 'Bee Gees' },
      { id: 2762720, title: 'Mamma Mia', artist: 'ABBA' },
      { id: 663613, title: 'Imagine', artist: 'John Lennon' },
      { id: 14879980, title: 'Carry On Wayward Son', artist: 'Kansas' },
      { id: 2762735, title: 'Waterloo', artist: 'ABBA' },
      { id: 904593, title: "Don't Stop Me Now", artist: 'Queen' },
      { id: 1700001, title: 'Superstition', artist: 'Stevie Wonder' },
      { id: 1700002, title: 'September', artist: 'Earth, Wind & Fire' },
      { id: 1700003, title: 'Smoke on the Water', artist: 'Deep Purple' },
      { id: 1700004, title: 'We Will Rock You', artist: 'Queen' },
      { id: 1700005, title: 'Wish You Were Here', artist: 'Pink Floyd' },
      { id: 1700006, title: 'I Will Survive', artist: 'Gloria Gaynor' },
      { id: 1700007, title: 'YMCA', artist: 'Village People' },
      { id: 1700008, title: 'Heart of Glass', artist: 'Blondie' },
      { id: 1700009, title: 'Born to Run', artist: 'Bruce Springsteen' },
      { id: 1700010, title: 'Go Your Own Way', artist: 'Fleetwood Mac' },
      { id: 1700011, title: 'Dreams', artist: 'Fleetwood Mac' },
      { id: 1700012, title: 'Sir Duke', artist: 'Stevie Wonder' },
    ],
  },
  {
    key: '80s', label: '80-tal', emoji: '📼',
    tracks: [
      { id: 993970, title: 'Take On Me', artist: 'a-ha' },
      { id: 1335449, title: 'The Final Countdown', artist: 'Europe' },
      { id: 14189700, title: 'Never Gonna Give You Up', artist: 'Rick Astley' },
      { id: 134012, title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
      { id: 75158766, title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper' },
      { id: 602261, title: 'Billie Jean', artist: 'Michael Jackson' },
      { id: 602271, title: 'Beat It', artist: 'Michael Jackson' },
      { id: 602265, title: 'Thriller', artist: 'Michael Jackson' },
      { id: 2306436, title: 'Eye of the Tiger', artist: 'Survivor' },
      { id: 75043758, title: 'Wake Me Up Before You Go-Go', artist: 'Wham!' },
      { id: 3133841, title: "Livin' on a Prayer", artist: 'Bon Jovi' },
      { id: 1166092, title: 'Every Breath You Take', artist: 'The Police' },
      { id: 669930, title: "Don't Stop Believin'", artist: 'Journey' },
      { id: 116020868, title: 'Running Up That Hill', artist: 'Kate Bush' },
      { id: 1800001, title: 'Tainted Love', artist: 'Soft Cell' },
      { id: 1800002, title: 'Africa', artist: 'Toto' },
      { id: 1800003, title: 'Under Pressure', artist: 'Queen & David Bowie' },
      { id: 1800004, title: 'Jump', artist: 'Van Halen' },
      { id: 1800005, title: 'Come On Eileen', artist: 'Dexys Midnight Runners' },
      { id: 1800006, title: 'Blue Monday', artist: 'New Order' },
      { id: 1800007, title: 'Enjoy the Silence', artist: 'Depeche Mode' },
      { id: 1800008, title: 'Personal Jesus', artist: 'Depeche Mode' },
      { id: 1800009, title: 'Walk Like an Egyptian', artist: 'The Bangles' },
      { id: 1800010, title: 'Like a Prayer', artist: 'Madonna' },
      { id: 1800011, title: 'Material Girl', artist: 'Madonna' },
      { id: 1800012, title: 'Total Eclipse of the Heart', artist: 'Bonnie Tyler' },
    ],
  },
  {
    key: '90s', label: '90-tal', emoji: '💿',
    tracks: [
      { id: 786717, title: 'Believe', artist: 'Cher' },
      { id: 739887, title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
      { id: 6151439, title: 'Wannabe', artist: 'Spice Girls' },
      { id: 904810, title: '...Baby One More Time', artist: 'Britney Spears' },
      { id: 75576082, title: 'No Scrubs', artist: 'TLC' },
      { id: 915810, title: "Livin' la Vida Loca", artist: 'Ricky Martin' },
      { id: 3175405, title: 'Everybody', artist: 'Backstreet Boys' },
      { id: 401442, title: 'Creep', artist: 'Radiohead' },
      { id: 1065504, title: 'Wonderwall', artist: 'Oasis' },
      { id: 546010, title: 'Numb', artist: 'Linkin Park' },
      { id: 916279, title: 'Bitter Sweet Symphony', artist: 'The Verve' },
      { id: 3122151, title: "I'll Be There for You", artist: 'The Rembrandts' },
      { id: 1900001, title: 'Killing Me Softly', artist: 'Fugees' },
      { id: 1900002, title: "Gangsta's Paradise", artist: 'Coolio' },
      { id: 1900003, title: 'Losing My Religion', artist: 'R.E.M.' },
      { id: 1900004, title: 'Under the Bridge', artist: 'Red Hot Chili Peppers' },
      { id: 1900005, title: 'Torn', artist: 'Natalie Imbruglia' },
      { id: 1900006, title: 'Kiss from a Rose', artist: 'Seal' },
      { id: 1900007, title: 'No Diggity', artist: 'Blackstreet ft. Dr. Dre' },
      { id: 1900008, title: 'Jump Around', artist: 'House of Pain' },
      { id: 1900009, title: 'MMMBop', artist: 'Hanson' },
      { id: 1900010, title: 'Waterfalls', artist: 'TLC' },
      { id: 1900011, title: 'Iris', artist: 'Goo Goo Dolls' },
      { id: 1900012, title: 'U Got It Bad', artist: 'Usher' },
    ],
  },
  {
    key: '2000s', label: '2000-tal', emoji: '📀',
    tracks: [
      { id: 2174922, title: 'In Da Club', artist: '50 Cent' },
      { id: 3104198, title: 'Lose Yourself', artist: 'Eminem' },
      { id: 921801, title: 'Toxic', artist: 'Britney Spears' },
      { id: 7868140, title: 'Stronger', artist: 'Kanye West' },
      { id: 916421, title: 'Crazy in Love', artist: 'Beyoncé' },
      { id: 423370, title: 'Hey Ya!', artist: 'OutKast' },
      { id: 3104048, title: 'Without Me', artist: 'Eminem' },
      { id: 661726, title: 'Mr. Brightside', artist: 'The Killers' },
      { id: 424018562, title: 'Despacito', artist: 'Luis Fonsi' },
      { id: 546010, title: 'Numb', artist: 'Linkin Park' },
      { id: 6562816, title: 'Shape of You', artist: 'Ed Sheeran' },
      { id: 2000001, title: 'Complicated', artist: 'Avril Lavigne' },
      { id: 2000002, title: 'Clocks', artist: 'Coldplay' },
      { id: 2000003, title: 'Seven Nation Army', artist: 'The White Stripes' },
      { id: 2000004, title: 'Yeah!', artist: 'Usher ft. Lil Jon & Ludacris' },
      { id: 2000005, title: "Hips Don't Lie", artist: 'Shakira ft. Wyclef Jean' },
      { id: 2000006, title: 'Umbrella', artist: 'Rihanna' },
      { id: 2000007, title: 'Poker Face', artist: 'Lady Gaga' },
      { id: 2000008, title: 'Single Ladies', artist: 'Beyoncé' },
      { id: 2000009, title: 'Viva la Vida', artist: 'Coldplay' },
      { id: 2000010, title: 'Beautiful Day', artist: 'U2' },
      { id: 2000011, title: 'Somewhere Only We Know', artist: 'Keane' },
      { id: 2000012, title: 'Since U Been Gone', artist: 'Kelly Clarkson' },
    ],
  },
  {
    key: '2010s', label: '2010-tal', emoji: '📱',
    tracks: [
      { id: 67786698, title: 'Wake Me Up', artist: 'Avicii' },
      { id: 61532878, title: 'Happy', artist: 'Pharrell Williams' },
      { id: 5552050, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { id: 6562816, title: 'Shape of You', artist: 'Ed Sheeran' },
      { id: 71407662, title: 'Gangnam Style', artist: 'PSY' },
      { id: 12789050, title: 'HUMBLE.', artist: 'Kendrick Lamar' },
      { id: 79844680, title: "God's Plan", artist: 'Drake' },
      { id: 119606392, title: 'Bailando', artist: 'Enrique Iglesias' },
      { id: 97811786, title: 'Try Everything', artist: 'Shakira' },
      { id: 116020868, title: 'Running Up That Hill', artist: 'Kate Bush' },
      { id: 60842359, title: "Don't You Worry Child", artist: 'Swedish House Mafia' },
      { id: 569470, title: 'Titanium', artist: 'David Guetta ft. Sia' },
      { id: 2010001, title: 'Royals', artist: 'Lorde' },
      { id: 2010002, title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell Williams' },
      { id: 2010003, title: 'Thinking Out Loud', artist: 'Ed Sheeran' },
      { id: 2010004, title: 'Sorry', artist: 'Justin Bieber' },
      { id: 2010005, title: 'Cheap Thrills', artist: 'Sia' },
      { id: 2010006, title: 'Havana', artist: 'Camila Cabello ft. Young Thug' },
      { id: 2010007, title: 'Old Town Road', artist: 'Lil Nas X ft. Billy Ray Cyrus' },
      { id: 2010008, title: 'Señorita', artist: 'Shawn Mendes & Camila Cabello' },
      { id: 2010009, title: 'Dance Monkey', artist: 'Tones and I' },
      { id: 2010010, title: 'Bad Guy', artist: 'Billie Eilish' },
      { id: 2010011, title: 'Stressed Out', artist: 'Twenty One Pilots' },
      { id: 2010012, title: 'Rolling in the Deep', artist: 'Adele' },
    ],
  },
  {
    key: '2020s', label: '2020-tal', emoji: '🔥',
    tracks: [
      { id: 2310817667, title: 'Blinding Lights', artist: 'The Weeknd' },
      { id: 2288596557, title: 'Flowers', artist: 'Miley Cyrus' },
      { id: 1040830212, title: 'Levitating', artist: 'Dua Lipa' },
      { id: 1264247442, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber' },
      { id: 1561025822, title: 'INDUSTRY BABY', artist: 'Lil Nas X & Jack Harlow' },
      { id: 546971832, title: 'Montero', artist: 'Lil Nas X' },
      { id: 544529742, title: "We Don't Talk About Bruno", artist: 'Carolina Gaitán' },
      { id: 1321651992, title: 'Butter', artist: 'BTS' },
      { id: 1564465082, title: 'Dynamite', artist: 'BTS' },
      { id: 908327682, title: 'How You Like That', artist: 'BLACKPINK' },
      { id: 2020001, title: 'As It Was', artist: 'Harry Styles' },
      { id: 2020002, title: 'Anti-Hero', artist: 'Taylor Swift' },
      { id: 2020003, title: 'Heat Waves', artist: 'Glass Animals' },
      { id: 2020004, title: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar & Giveon' },
      { id: 2020005, title: 'Kiss Me More', artist: 'Doja Cat ft. SZA' },
      { id: 2020006, title: 'abcdefu', artist: 'GAYLE' },
      { id: 2020007, title: 'About Damn Time', artist: 'Lizzo' },
      { id: 2020008, title: 'Unholy', artist: 'Sam Smith & Kim Petras' },
      { id: 2020009, title: 'Calm Down', artist: 'Rema & Selena Gomez' },
      { id: 2020010, title: 'Cruel Summer', artist: 'Taylor Swift' },
      { id: 2020011, title: 'Bad Habits', artist: 'Ed Sheeran' },
      { id: 2020012, title: 'Shivers', artist: 'Ed Sheeran' },
      { id: 2020013, title: 'Easy On Me', artist: 'Adele' },
      { id: 2020014, title: 'Golden Hour', artist: 'JVKE' },
    ],
  },

  // === GENRE ===
  {
    key: 'pop', label: 'Pop', emoji: '🎤',
    tracks: [
      { id: 2310817667, title: 'Blinding Lights', artist: 'The Weeknd' },
      { id: 6562816, title: 'Shape of You', artist: 'Ed Sheeran' },
      { id: 786717, title: 'Believe', artist: 'Cher' },
      { id: 1040830212, title: 'Levitating', artist: 'Dua Lipa' },
      { id: 2288596557, title: 'Flowers', artist: 'Miley Cyrus' },
      { id: 5552050, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { id: 904810, title: '...Baby One More Time', artist: 'Britney Spears' },
      { id: 61532878, title: 'Happy', artist: 'Pharrell Williams' },
      { id: 602265, title: 'Thriller', artist: 'Michael Jackson' },
      { id: 993970, title: 'Take On Me', artist: 'a-ha' },
      { id: 2762723, title: 'Dancing Queen', artist: 'ABBA' },
      { id: 75158766, title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper' },
      { id: 3300001, title: 'Rolling in the Deep', artist: 'Adele' },
      { id: 3300002, title: 'Someone Like You', artist: 'Adele' },
      { id: 3300003, title: 'Bad Guy', artist: 'Billie Eilish' },
      { id: 3300004, title: 'Poker Face', artist: 'Lady Gaga' },
      { id: 3300005, title: 'Roar', artist: 'Katy Perry' },
      { id: 3300006, title: 'Firework', artist: 'Katy Perry' },
      { id: 3300007, title: 'Shake It Off', artist: 'Taylor Swift' },
      { id: 3300008, title: 'Love Story', artist: 'Taylor Swift' },
      { id: 3300009, title: 'Call Me Maybe', artist: 'Carly Rae Jepsen' },
      { id: 3300010, title: 'Baby', artist: 'Justin Bieber ft. Ludacris' },
      { id: 3300011, title: 'Toxic', artist: 'Britney Spears' },
      { id: 3300012, title: 'Umbrella', artist: 'Rihanna' },
    ],
  },
  {
    key: 'rock', label: 'Rock', emoji: '🎸',
    tracks: [
      { id: 916424, title: 'Bohemian Rhapsody', artist: 'Queen' },
      { id: 739887, title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
      { id: 661726, title: 'Mr. Brightside', artist: 'The Killers' },
      { id: 1065504, title: 'Wonderwall', artist: 'Oasis' },
      { id: 3129028, title: 'Back in Black', artist: 'AC/DC' },
      { id: 68518, title: 'Stairway to Heaven', artist: 'Led Zeppelin' },
      { id: 1152978, title: 'Enter Sandman', artist: 'Metallica' },
      { id: 906073, title: 'Basket Case', artist: 'Green Day' },
      { id: 401442, title: 'Creep', artist: 'Radiohead' },
      { id: 546010, title: 'Numb', artist: 'Linkin Park' },
      { id: 134012, title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
      { id: 3133841, title: "Livin' on a Prayer", artist: 'Bon Jovi' },
      { id: 669930, title: "Don't Stop Believin'", artist: 'Journey' },
      { id: 904593, title: "Don't Stop Me Now", artist: 'Queen' },
      { id: 3400001, title: 'Highway to Hell', artist: 'AC/DC' },
      { id: 3400002, title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
      { id: 3400003, title: 'Under the Bridge', artist: 'Red Hot Chili Peppers' },
      { id: 3400004, title: 'Seven Nation Army', artist: 'The White Stripes' },
      { id: 3400005, title: 'Smoke on the Water', artist: 'Deep Purple' },
      { id: 3400006, title: 'Welcome to the Jungle', artist: "Guns N' Roses" },
      { id: 3400007, title: 'The Final Countdown', artist: 'Europe' },
      { id: 3400008, title: 'We Will Rock You', artist: 'Queen' },
      { id: 3400009, title: 'Africa', artist: 'Toto' },
      { id: 3400010, title: 'Eye of the Tiger', artist: 'Survivor' },
    ],
  },
  {
    key: 'hiphop', label: 'Hip-Hop', emoji: '🎙️',
    tracks: [
      { id: 3104198, title: 'Lose Yourself', artist: 'Eminem' },
      { id: 1109686, title: 'Juicy', artist: 'The Notorious B.I.G.' },
      { id: 12789050, title: 'HUMBLE.', artist: 'Kendrick Lamar' },
      { id: 7868140, title: 'Stronger', artist: 'Kanye West' },
      { id: 2174922, title: 'In Da Club', artist: '50 Cent' },
      { id: 79844680, title: "God's Plan", artist: 'Drake' },
      { id: 1561025822, title: 'INDUSTRY BABY', artist: 'Lil Nas X & Jack Harlow' },
      { id: 5552050, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { id: 546971832, title: 'Montero', artist: 'Lil Nas X' },
      { id: 3104048, title: 'Without Me', artist: 'Eminem' },
      { id: 3500001, title: "Gangsta's Paradise", artist: 'Coolio' },
      { id: 3500002, title: 'Gold Digger', artist: 'Kanye West ft. Jamie Foxx' },
      { id: 3500003, title: 'SICKO MODE', artist: 'Travis Scott' },
      { id: 3500004, title: 'Hotline Bling', artist: 'Drake' },
      { id: 3500005, title: 'Mo Money Mo Problems', artist: 'The Notorious B.I.G.' },
      { id: 3500006, title: 'Nuthin But a G Thang', artist: 'Dr. Dre ft. Snoop Dogg' },
      { id: 3500007, title: 'California Gurls', artist: 'Katy Perry ft. Snoop Dogg' },
      { id: 3500008, title: 'Yeah!', artist: 'Usher ft. Lil Jon & Ludacris' },
      { id: 3500009, title: 'Empire State of Mind', artist: 'JAY-Z ft. Alicia Keys' },
      { id: 3500010, title: 'Old Town Road', artist: 'Lil Nas X ft. Billy Ray Cyrus' },
      { id: 3500011, title: 'Rap God', artist: 'Eminem' },
      { id: 3500012, title: 'All Falls Down', artist: 'Kanye West' },
    ],
  },
  {
    key: 'edm', label: 'EDM', emoji: '🎧',
    tracks: [
      { id: 3101301, title: 'Levels', artist: 'Avicii' },
      { id: 67786698, title: 'Wake Me Up', artist: 'Avicii' },
      { id: 60842359, title: "Don't You Worry Child", artist: 'Swedish House Mafia' },
      { id: 569470, title: 'Titanium', artist: 'David Guetta ft. Sia' },
      { id: 3135556, title: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk' },
      { id: 3135553, title: 'One More Time', artist: 'Daft Punk' },
      { id: 11234004, title: 'Save The World', artist: 'Swedish House Mafia' },
      { id: 61427200, title: 'Greyhound', artist: 'Swedish House Mafia' },
      { id: 2010002, title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell Williams' },
      { id: 3600001, title: 'Around the World', artist: 'Daft Punk' },
      { id: 3600002, title: 'Clarity', artist: 'Zedd ft. Foxes' },
      { id: 3600003, title: 'Animals', artist: 'Martin Garrix' },
      { id: 3600004, title: 'Lean On', artist: 'Major Lazer & DJ Snake ft. MØ' },
      { id: 3600005, title: 'Silence', artist: 'Marshmello ft. Khalid' },
      { id: 3600006, title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex' },
      { id: 3600007, title: 'Bangarang', artist: 'Skrillex ft. Sirah' },
      { id: 3600008, title: 'Sandstorm', artist: 'Darude' },
      { id: 3600009, title: 'Summer', artist: 'Calvin Harris' },
      { id: 3600010, title: 'Feel So Close', artist: 'Calvin Harris' },
      { id: 3600011, title: 'Fireflies', artist: 'Owl City' },
      { id: 3600012, title: 'Spectrum', artist: 'Zedd ft. Matthew Koma' },
    ],
  },
  {
    key: 'dnb', label: 'Drum & Bass', emoji: '🥁',
    tracks: [
      { id: 5700001, title: 'Goldie - Inner City Life', artist: 'Goldie' },
      { id: 5700002, title: 'Original Nuttah', artist: 'Shy FX & UK Apache' },
      { id: 5700003, title: 'Hurt You So', artist: 'Jonny L' },
      { id: 5700004, title: 'Super Sharp Shooter', artist: 'DJ Gammer' },
      { id: 916279, title: 'Brown Paper Bag', artist: 'Roni Size & Reprazent' },
      { id: 5700006, title: 'Timeless', artist: 'Goldie' },
      { id: 5700007, title: 'Dread Bass', artist: 'Dead Dred' },
      { id: 5700008, title: 'Hold Your Colour', artist: 'Pendulum' },
      { id: 5700009, title: 'Tarantula', artist: 'Pendulum' },
      { id: 5700010, title: 'Slam', artist: 'Pendulum' },
      { id: 5700011, title: 'Watercolour', artist: 'Pendulum' },
      { id: 5700012, title: 'The Island', artist: 'Pendulum' },
      { id: 5700013, title: 'Witchcraft', artist: 'Pendulum' },
      { id: 5700014, title: 'Propane Nightmares', artist: 'Pendulum' },
      { id: 5700015, title: 'Nobody To Love', artist: 'Sigma' },
      { id: 5700016, title: 'Changing', artist: 'Sigma ft. Paloma Faith' },
      { id: 5700017, title: 'T2 - Heartbroken', artist: 'T2 ft. Jodie' },
      { id: 5700018, title: 'Camo & Krooked - All Fall Down', artist: 'Camo & Krooked' },
      { id: 5700019, title: 'Netsky - Memory Lane', artist: 'Netsky' },
      { id: 5700020, title: 'Love Me Again', artist: 'Netsky' },
      { id: 5700021, title: 'London Elektricity - Just One Second', artist: 'London Elektricity' },
      { id: 5700022, title: 'Chase & Status - Blind Faith', artist: 'Chase & Status' },
      { id: 5700023, title: 'End Credits', artist: 'Chase & Status ft. Plan B' },
      { id: 5700024, title: 'No Problem', artist: 'Chase & Status ft. Childish Gambino' },
    ],
  },
  {
    key: 'kpop', label: 'K-Pop', emoji: '🇰🇷',
    tracks: [
      { id: 1564465082, title: 'Dynamite', artist: 'BTS' },
      { id: 908327682, title: 'How You Like That', artist: 'BLACKPINK' },
      { id: 1321651992, title: 'Butter', artist: 'BTS' },
      { id: 784811032, title: 'Boy With Luv', artist: 'BTS ft. Halsey' },
      { id: 71407662, title: 'Gangnam Style', artist: 'PSY' },
      { id: 1539483452, title: 'LALISA', artist: 'LISA' },
      { id: 1466498302, title: 'Next Level', artist: 'aespa' },
      { id: 908327652, title: 'Ice Cream', artist: 'BLACKPINK & Selena Gomez' },
      { id: 1006498802, title: 'Life Goes On', artist: 'BTS' },
      { id: 3700001, title: 'DNA', artist: 'BTS' },
      { id: 3700002, title: 'DDU-DU DDU-DU', artist: 'BLACKPINK' },
      { id: 3700003, title: 'Kill This Love', artist: 'BLACKPINK' },
      { id: 3700004, title: 'Fake Love', artist: 'BTS' },
      { id: 3700005, title: 'Mic Drop', artist: 'BTS' },
      { id: 3700006, title: 'Spring Day', artist: 'BTS' },
      { id: 3700007, title: 'Permission to Dance', artist: 'BTS' },
      { id: 3700008, title: 'Lovesick Girls', artist: 'BLACKPINK' },
      { id: 3700009, title: 'Pink Venom', artist: 'BLACKPINK' },
      { id: 3700010, title: 'Fancy', artist: 'TWICE' },
      { id: 3700011, title: 'Feel Special', artist: 'TWICE' },
      { id: 3700012, title: 'Psycho', artist: 'Red Velvet' },
    ],
  },
  {
    key: 'latin', label: 'Latin', emoji: '💃',
    tracks: [
      { id: 424018562, title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee' },
      { id: 119606392, title: 'Bailando', artist: 'Enrique Iglesias' },
      { id: 567051412, title: 'Dákiti', artist: 'Bad Bunny & Jhay Cortez' },
      { id: 915810, title: "Livin' la Vida Loca", artist: 'Ricky Martin' },
      { id: 503484242, title: 'Hawái', artist: 'Maluma' },
      { id: 97811786, title: 'Try Everything', artist: 'Shakira' },
      { id: 3800001, title: 'Hips Don\'t Lie', artist: 'Shakira ft. Wyclef Jean' },
      { id: 3800002, title: 'La Bamba', artist: 'Ritchie Valens' },
      { id: 3800003, title: 'Macarena', artist: 'Los Del Rio' },
      { id: 3800004, title: 'Gasolina', artist: 'Daddy Yankee' },
      { id: 3800005, title: 'Con Calma', artist: 'Daddy Yankee & Snow' },
      { id: 3800006, title: 'Taki Taki', artist: 'DJ Snake ft. Selena Gomez, Ozuna & Cardi B' },
      { id: 3800007, title: 'MIA', artist: 'Bad Bunny ft. Drake' },
      { id: 3800008, title: 'Te Bote', artist: 'Casper, Nio Garcia, Darell, Nicky Jam, Bad Bunny & Ozuna' },
      { id: 3800009, title: 'Boom Boom', artist: 'RedOne, Daddy Yankee, French Montana & Dinah Jane' },
      { id: 3800010, title: 'Échame La Culpa', artist: 'Luis Fonsi & Demi Lovato' },
      { id: 3800011, title: 'Smooth', artist: 'Santana ft. Rob Thomas' },
      { id: 3800012, title: 'Waka Waka', artist: 'Shakira' },
      { id: 3800013, title: 'Baila Conmigo', artist: 'Dayvi & Victor Allen' },
      { id: 3800014, title: 'El Perdón', artist: 'Nicky Jam & Enrique Iglesias' },
    ],
  },

  // === TEMA ===
  {
    key: 'tecknat', label: 'Tecknat', emoji: '🧸',
    tracks: [
      { id: 67238735, title: 'Let It Go', artist: 'Idina Menzel' },
      { id: 15457951, title: 'Under the Sea', artist: 'Samuel E. Wright' },
      { id: 15457945, title: 'Part of Your World', artist: 'Jodi Benson' },
      { id: 1171894, title: 'A Whole New World', artist: 'Peabo Bryson & Regina Belle' },
      { id: 15058028, title: 'Hakuna Matata', artist: 'Nathan Lane & Ernie Sabella' },
      { id: 15058022, title: 'Circle of Life', artist: 'Carmen Twillie' },
      { id: 67238739, title: 'Do You Want to Build a Snowman?', artist: 'Kristen Bell' },
      { id: 61532878, title: 'Happy', artist: 'Pharrell Williams' },
      { id: 97811786, title: 'Try Everything', artist: 'Shakira' },
      { id: 110839318, title: 'Remember Me', artist: 'Miguel' },
      { id: 544529742, title: "We Don't Talk About Bruno", artist: 'Carolina Gaitán' },
      { id: 119927498, title: 'Speechless', artist: 'Naomi Scott' },
      { id: 15058026, title: 'Can You Feel the Love Tonight', artist: 'Elton John' },
      { id: 3900001, title: 'All Star', artist: 'Smash Mouth' },
      { id: 3900002, title: 'How Far I\'ll Go', artist: 'Auli\'i Cravalho' },
      { id: 3900003, title: 'You\'re Welcome', artist: 'Dwayne Johnson' },
      { id: 3900004, title: 'I See the Light', artist: 'Mandy Moore & Zachary Levi' },
      { id: 3900005, title: 'When You Wish Upon a Star', artist: 'Cliff Edwards' },
      { id: 3900006, title: 'Be Our Guest', artist: 'Jerry Orbach' },
      { id: 3900007, title: 'Beauty and the Beast', artist: 'Angela Lansbury' },
      { id: 3900008, title: 'You\'ve Got a Friend in Me', artist: 'Randy Newman' },
      { id: 3900009, title: 'I Just Can\'t Wait to Be King', artist: 'Jason Weaver' },
      { id: 3900010, title: 'Colors of the Wind', artist: 'Vanessa Williams' },
      { id: 3900011, title: 'Surface Pressure', artist: 'Jessica Darrow' },
    ],
  },
  {
    key: 'anime', label: 'Anime', emoji: '🌸',
    tracks: [
      { id: 136332066, title: 'Gurenge', artist: 'LiSA' },
      { id: 916130, title: 'Blue Bird', artist: 'Ikimono-gakari' },
      { id: 889048, title: 'Guren no Yumiya', artist: 'Linked Horizon' },
      { id: 4334853, title: 'Unravel', artist: 'TK from Ling Tosite Sigure' },
      { id: 138545417, title: 'Shinzou wo Sasageyo!', artist: 'Linked Horizon' },
      { id: 14227498, title: 'Again', artist: 'YUI' },
      { id: 6207064, title: 'Silhouette', artist: 'KANA-BOON' },
      { id: 86498654, title: 'The Day', artist: 'Porno Graffitti' },
      { id: 544894002, title: 'Kaikai Kitan', artist: 'Eve' },
      { id: 1447692372, title: 'Zankyou Sanka', artist: 'Aimer' },
      { id: 1396413092, title: 'KICK BACK', artist: 'Kenshi Yonezu' },
      { id: 4000001, title: 'A Cruel Angel\'s Thesis', artist: 'Yoko Takahashi' },
      { id: 4000002, title: 'Cha-La Head-Cha-La', artist: 'Hironobu Kageyama' },
      { id: 4000003, title: 'We Are!', artist: 'Hiroshi Kitadani' },
      { id: 4000004, title: 'Butter-Fly', artist: 'Koji Wada' },
      { id: 4000005, title: 'Pokémon Theme', artist: 'Jason Paige' },
      { id: 4000006, title: 'Crossing Field', artist: 'LiSA' },
      { id: 4000007, title: 'Myth & Roid - OVERLAPPERCUT', artist: 'MYTH & ROID' },
      { id: 4000008, title: 'My Hero', artist: 'Brian the Sun' },
      { id: 4000009, title: 'Odd Future', artist: 'UVERworld' },
      { id: 4000010, title: 'Tank!', artist: 'The Seatbelts' },
      { id: 4000011, title: 'Naruto Main Theme', artist: 'Toshio Masuda' },
    ],
  },
  {
    key: 'games', label: 'Spel', emoji: '🎮',
    tracks: [
      { id: 72061030, title: 'Sweden', artist: 'C418' },
      { id: 72061032, title: 'Wet Hands', artist: 'C418' },
      { id: 86154654, title: 'Megalovania', artist: 'Toby Fox' },
      { id: 15963966, title: 'Dragonborn', artist: 'Jeremy Soule' },
      { id: 8859498, title: 'Want You Gone', artist: 'Jonathan Coulton' },
      { id: 7816930, title: 'Still Alive', artist: 'Lisa Miskovsky' },
      { id: 72061034, title: 'Mice on Venus', artist: 'C418' },
      { id: 72061036, title: 'Danny', artist: 'C418' },
      { id: 4100001, title: 'Super Mario Bros. Theme', artist: 'Koji Kondo' },
      { id: 4100002, title: 'Tetris Theme (Korobeiniki)', artist: 'Hirokazu Tanaka' },
      { id: 4100003, title: 'The Legend of Zelda Theme', artist: 'Koji Kondo' },
      { id: 4100004, title: 'Halo Theme', artist: 'Martin O\'Donnell & Michael Salvatori' },
      { id: 4100005, title: 'Gerudo Valley', artist: 'Koji Kondo' },
      { id: 4100006, title: 'Credits - Undertale', artist: 'Toby Fox' },
      { id: 4100007, title: 'Gusty Garden Galaxy', artist: 'Koji Kondo' },
      { id: 4100008, title: 'One-Winged Angel', artist: 'Nobuo Uematsu' },
      { id: 4100009, title: 'Bloody Tears', artist: 'Konami Kukeiha Club' },
      { id: 4100010, title: 'Green Hill Zone', artist: 'Masato Nakamura' },
      { id: 4100011, title: 'Pac-Man Theme', artist: 'Toru Iwatani' },
      { id: 4100012, title: 'Still Alive (Portal)', artist: 'Ellen McLain' },
    ],
  },
  {
    key: 'film', label: 'Film', emoji: '🎬',
    tracks: [
      { id: 388698, title: 'My Heart Will Go On', artist: 'Céline Dion' },
      { id: 2306436, title: 'Eye of the Tiger', artist: 'Survivor' },
      { id: 3104198, title: 'Lose Yourself', artist: 'Eminem' },
      { id: 2207213, title: 'Skyfall', artist: 'Adele' },
      { id: 424471, title: "I Don't Want to Miss a Thing", artist: 'Aerosmith' },
      { id: 669930, title: "Don't Stop Believin'", artist: 'Journey' },
      { id: 695498, title: 'Hotel California', artist: 'Eagles' },
      { id: 67238735, title: 'Let It Go', artist: 'Idina Menzel' },
      { id: 4200001, title: 'Ghostbusters', artist: 'Ray Parker Jr.' },
      { id: 4200002, title: 'The Imperial March', artist: 'John Williams' },
      { id: 4200003, title: 'Star Wars Main Theme', artist: 'John Williams' },
      { id: 4200004, title: 'Raiders March', artist: 'John Williams' },
      { id: 4200005, title: 'Moon River', artist: 'Audrey Hepburn' },
      { id: 4200006, title: 'Footloose', artist: 'Kenny Loggins' },
      { id: 4200007, title: 'Take My Breath Away', artist: 'Berlin' },
      { id: 4200008, title: 'Bohemian Rhapsody', artist: 'Queen' },
      { id: 4200009, title: "I Will Always Love You", artist: 'Whitney Houston' },
      { id: 4200010, title: 'Unchained Melody', artist: 'The Righteous Brothers' },
      { id: 4200011, title: 'Don\'t You (Forget About Me)', artist: 'Simple Minds' },
      { id: 4200012, title: 'The Circle of Life', artist: 'Carmen Twillie' },
      { id: 4200013, title: 'James Bond Theme', artist: 'John Barry Orchestra' },
      { id: 4200014, title: 'Gonna Fly Now (Rocky Theme)', artist: 'Bill Conti' },
    ],
  },
  {
    key: 'tv', label: 'TV-serier', emoji: '📺',
    tracks: [
      { id: 3122151, title: "I'll Be There for You", artist: 'The Rembrandts' },
      { id: 116020868, title: 'Running Up That Hill', artist: 'Kate Bush' },
      { id: 14879980, title: 'Carry On Wayward Son', artist: 'Kansas' },
      { id: 661726, title: 'Mr. Brightside', artist: 'The Killers' },
      { id: 739887, title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
      { id: 669930, title: "Don't Stop Believin'", artist: 'Journey' },
      { id: 1065504, title: 'Wonderwall', artist: 'Oasis' },
      { id: 401442, title: 'Creep', artist: 'Radiohead' },
      { id: 4300001, title: 'Game of Thrones Theme', artist: 'Ramin Djawadi' },
      { id: 4300002, title: 'Breaking Bad Theme', artist: 'Dave Porter' },
      { id: 4300003, title: 'The Mandalorian Theme', artist: 'Ludwig Göransson' },
      { id: 4300004, title: 'Stranger Things Theme', artist: 'Kyle Dixon & Michael Stein' },
      { id: 4300005, title: 'Twin Peaks Theme', artist: 'Angelo Badalamenti' },
      { id: 4300006, title: 'The Fresh Prince of Bel-Air Theme', artist: 'Will Smith' },
      { id: 4300007, title: 'Cheers Theme (Where Everybody Knows Your Name)', artist: 'Gary Portnoy' },
      { id: 4300008, title: 'House of Cards Theme', artist: 'Jeff Beal' },
      { id: 4300009, title: 'The Simpsons Theme', artist: 'Danny Elfman' },
      { id: 4300010, title: 'Seinfeld Theme', artist: 'Jonathan Wolff' },
      { id: 4300011, title: 'Succession Theme', artist: 'Nicholas Britell' },
      { id: 4300012, title: 'The Last of Us Theme', artist: 'Gustavo Santaolalla' },
    ],
  },
  {
    key: 'swedish', label: 'Svenska', emoji: '🇸🇪',
    tracks: [
      { id: 60842359, title: "Don't You Worry Child", artist: 'Swedish House Mafia' },
      { id: 11234004, title: 'Save The World', artist: 'Swedish House Mafia' },
      { id: 1335449, title: 'The Final Countdown', artist: 'Europe' },
      { id: 2762723, title: 'Dancing Queen', artist: 'ABBA' },
      { id: 2762720, title: 'Mamma Mia', artist: 'ABBA' },
      { id: 2762735, title: 'Waterloo', artist: 'ABBA' },
      { id: 3101301, title: 'Levels', artist: 'Avicii' },
      { id: 67786698, title: 'Wake Me Up', artist: 'Avicii' },
      { id: 569470, title: 'Titanium', artist: 'David Guetta ft. Sia' },
      { id: 61427200, title: 'Greyhound', artist: 'Swedish House Mafia' },
      { id: 993970, title: 'Take On Me', artist: 'a-ha' },
      { id: 4400001, title: 'SOS', artist: 'ABBA' },
      { id: 4400002, title: 'Gimme! Gimme! Gimme!', artist: 'ABBA' },
      { id: 4400003, title: 'The Winner Takes It All', artist: 'ABBA' },
      { id: 4400004, title: 'Super Trouper', artist: 'ABBA' },
      { id: 4400005, title: 'Hey Brother', artist: 'Avicii' },
      { id: 4400006, title: 'Waiting for Love', artist: 'Avicii' },
      { id: 4400007, title: 'Without You', artist: 'Avicii' },
      { id: 4400008, title: 'One (Your Name)', artist: 'Swedish House Mafia ft. Pharrell Williams' },
      { id: 4400009, title: 'Euphoria', artist: 'Loreen' },
      { id: 4400010, title: 'Tattoo', artist: 'Loreen' },
      { id: 4400011, title: 'Trouble', artist: 'Iggy Azalea ft. T.I.' },
      { id: 4400012, title: 'Midnight City', artist: 'M83' },
    ],
  },
  {
    key: 'klassiskt', label: 'Klassiskt', emoji: '🎻',
    tracks: [
      { id: 3157582, title: 'Für Elise', artist: 'Ludwig van Beethoven' },
      { id: 5765487, title: 'Clair de Lune', artist: 'Claude Debussy' },
      { id: 3157610, title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven' },
      { id: 73851942, title: 'Ride of the Valkyries', artist: 'Richard Wagner' },
      { id: 6390486, title: 'The Four Seasons: Spring', artist: 'Antonio Vivaldi' },
      { id: 3157596, title: 'Symphony No. 5', artist: 'Ludwig van Beethoven' },
      { id: 75073774, title: 'In the Hall of the Mountain King', artist: 'Edvard Grieg' },
      { id: 3336994, title: 'Canon in D', artist: 'Johann Pachelbel' },
      { id: 4500001, title: 'Tocatta and Fugue in D minor', artist: 'Johann Sebastian Bach' },
      { id: 4500002, title: 'Eine Kleine Nachtmusik', artist: 'Wolfgang Amadeus Mozart' },
      { id: 4500003, title: 'The Four Seasons: Summer', artist: 'Antonio Vivaldi' },
      { id: 4500004, title: 'Ode to Joy', artist: 'Ludwig van Beethoven' },
      { id: 4500005, title: 'Hallelujah Chorus', artist: 'George Frideric Handel' },
      { id: 4500006, title: 'Nocturne Op. 9 No. 2', artist: 'Frédéric Chopin' },
      { id: 4500007, title: 'Swan Lake Theme', artist: 'Pyotr Ilyich Tchaikovsky' },
      { id: 4500008, title: 'Nutcracker Suite: Dance of the Sugar Plum Fairy', artist: 'Pyotr Ilyich Tchaikovsky' },
      { id: 4500009, title: '1812 Overture', artist: 'Pyotr Ilyich Tchaikovsky' },
      { id: 4500010, title: 'Bolero', artist: 'Maurice Ravel' },
      { id: 4500011, title: 'Air on the G String', artist: 'Johann Sebastian Bach' },
      { id: 4500012, title: 'Peer Gynt: Morning Mood', artist: 'Edvard Grieg' },
    ],
  },
]

// --- Play history (persisted in localStorage) ---

const HISTORY_KEY = 'soundwarp_history'

function getHistory(): number[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch {
    return []
  }
}

function addToHistory(trackId: number): void {
  const history = getHistory()
  if (!history.includes(trackId)) {
    history.push(trackId)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }
}

function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

export function getPlayedCount(): number {
  return getHistory().length
}

export function getTotalTrackCount(): number {
  const uniqueIds = new Set<number>()
  CATEGORIES.forEach(cat => cat.tracks.forEach(t => uniqueIds.add(t.id)))
  return uniqueIds.size
}

export function getRandomTrack(categoryKey: string): TrackEntry | null {
  const cat = CATEGORIES.find(c => c.key === categoryKey)
  if (!cat || cat.tracks.length === 0) return null

  const history = getHistory()
  const unplayed = cat.tracks.filter(t => !history.includes(t.id))

  // If all tracks in category have been played, reset category tracks from history
  if (unplayed.length === 0) {
    // Remove this category's track IDs from history so they can be played again
    const catIds = new Set(cat.tracks.map(t => t.id))
    const newHistory = history.filter(id => !catIds.has(id))
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    // Now all tracks are available again
    return cat.tracks[Math.floor(Math.random() * cat.tracks.length)]
  }

  return unplayed[Math.floor(Math.random() * unplayed.length)]
}

export function markAsPlayed(trackId: number): void {
  addToHistory(trackId)
}

export function resetHistory(): void {
  clearHistory()
}

export function getRemainingCount(categoryKey: string): number {
  const cat = CATEGORIES.find(c => c.key === categoryKey)
  if (!cat) return 0
  const history = getHistory()
  return cat.tracks.filter(t => !history.includes(t.id)).length
}

/* =====================================================================
   EDIT ME: everything personal lives here.
   About-me text, skills, facts and education are in index.html (marked EDIT).
   ===================================================================== */
window.PORTFOLIO = {
  // --- hero: first name in Anton, the rest signed across it in script; the badge hangs above ---
  heroName: 'Mehakpreet Kaur Cheema',
  wordmark: 'Mehakpreet',
  email: 'mehak12cheema@gmail.com',
  cv: '',                                                    // EDIT: link to your CV (empty hides the button)
  status: 'Open to internships & freelance work',
  formspree: 'https://formspree.io/f/meaankdk',              // the "Reach out" form posts here

  // --- colour palette. Add more objects here and a palette switcher appears (bottom right); the first is the default.
  //     bg = dark sections, fg = light sections, accent = the loud one, blue = small text on light,
  //     cream = paper white, gold = highlights, deep = headings accent on the projects sheet.
  //     pattern = the hero background: 'dots' or 'stripes' ---
  themes: [
    { name: 'Butter & Sky',  pattern: 'dots',
      bg: '#472F26', fg: '#FEF0B6', accent: '#BBD9F3', blue: '#4D84CF', cream: '#FFFBEA', gold: '#FBD47F', deep: '#2C5A9A' }
  ],

  // --- the ID badge ---
  badge: {
    name: 'MEHAKPREET',
    role: ['Full-Stack Developer', '+ UI/UX & Graphic Designer'],
    label: 'CSE · Class of ’28',
    id: 'IKGPTU',
    availability: 'Open to internships',
    signature: 'Mehakpreet',
    seal: ['CGPA', '9.5'],
    photo: 'images/mehak.jpg',                               // empty = initials
    strapText: 'MEHAKPREET KAUR CHEEMA ✦ PORTFOLIO ✦ ',
    backTitle: 'What I do',
    backRows: [
      { icon: 'code',    title: 'Frontend',        text: 'React, React Native, Tailwind' },
      { icon: 'layers',  title: 'Full stack',      text: 'MongoDB, Express, React, Node' },
      { icon: 'pen',     title: 'UI/UX & design',  text: 'Apps, branding, posters' },
      { icon: 'atom',    title: 'AI/ML + Quantum', text: 'Learning ML · exploring Qiskit' }
    ],
    backNote: 'Building with code.\nDesigning with heart.'
  },

  socials: [
    { label: 'GitHub',    url: 'https://github.com/mehakcheema12',                icon: 'github' },
    { label: 'LinkedIn',  url: 'https://in.linkedin.com/in/mehakpreetkaurcheema', icon: 'linkedin' },
    { label: 'Behance',   url: 'https://www.behance.net/mehakprcheema',           icon: 'behance' },
    { label: 'Instagram', url: 'https://www.instagram.com/mehakintosh/',          icon: 'instagram' },
    { label: 'X',         url: 'https://x.com/Mehak12Cheema',                     icon: 'x' }
  ],

  // --- tech stack: [name, devicon slug or full logo URL]. Two rows drifting in opposite directions ---
  tools: [
    [['React', 'react/react-original'], ['React Native', 'react/react-original'], ['Expo', 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/expo.svg'], ['JavaScript', 'javascript/javascript-original'],
     ['TypeScript', 'typescript/typescript-original'], ['Node.js', 'nodejs/nodejs-original'], ['Express', 'express/express-original'], ['MongoDB', 'mongodb/mongodb-original'],
     ['Tailwind CSS', 'tailwindcss/tailwindcss-original'], ['HTML5', 'html5/html5-original'], ['CSS3', 'css3/css3-original']],
    [['Python', 'python/python-original'], ['Jupyter', 'jupyter/jupyter-original'], ['Qiskit', 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/qiskit.svg'],
     ['Git', 'git/git-original'], ['GitHub', 'github/github-original'], ['VS Code', 'vscode/vscode-original'], ['C++', 'cplusplus/cplusplus-original'],
     ['Figma', 'figma/figma-original'], ['Canva', 'canva/canva-original'], ['SQL', 'azuresqldatabase/azuresqldatabase-original'],
     ['Packet Tracer', 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/cisco.svg']]
  ],

  // --- "What I bring" crossed straps: each row scrolls with the page, in opposite directions ---
  straps: [
    ['Design', 'Code', 'Build', 'Prototype', 'Ship', 'Debug'],
    ['UI/UX', 'Full stack', 'Branding', 'Posters', 'Networking', 'Quantum']
  ],

  // --- Education crossed straps: subjects studied, one list per strap ---
  eduStraps: [
    ['Mathematics', 'Physics', 'Chemistry', 'EVS', 'Geography', 'Literature', 'Languages', 'Electronics', 'Workshop', 'C'],
    ['C++', 'OOP', 'DSA', 'Computer Architecture', 'Computer Networks', 'Operating Systems', 'DBMS', 'Software Engineering', 'Theory of Computation']
  ],

  // --- the Papeterie: the one ink every postcard stamp is pressed in ---
  stampInk: '#6B4630',

  // --- projects.
  //     image / video: optional cover files; empty = an animated device mock in the project colour.
  //     gallery: screenshots (website projects): a slideshow on the tile and a browser frame in the case study.
  //     phones: app screens already in a phone frame (transparent background).
  //     github / link: repo and live site ('' hides the button).
  work: [
    { title: 'VaultVu', tag: 'Mobile app · Team of 4', kind: 'app', year: '2025', role: 'UI/UX design & frontend',
      stack: 'React Native, Expo, TypeScript',
      colors: ['#0d1b2a', '#4D84CF', '#BBD9F3', '#FEF0B6'], image: '', video: '',
      // app screens (already in a phone frame): fanned out on the tile, one big phone in the case study
      phones: ['images/vaultvu/home.webp', 'images/vaultvu/fraud-types.webp', 'images/vaultvu/quiz.webp', 'images/vaultvu/emi.webp'],
      github: 'https://github.com/arpitsehal/VaultVu', link: '',
      summary: 'A mobile app that shields people from digital fraud. It checks suspicious links, messages, phone numbers and calls, explains the risk in plain words, and teaches online safety through games.',
      challenge: 'Scams reach people through links, texts and calls, and most people can’t tell a fake from the real thing until it’s too late. VaultVu had to make checking something feel quick, clear and even a little fun, in English, Hindi and Punjabi.',
      approach: 'In a team of four, I owned the UI/UX and built frontend screens in React Native with Expo. I designed the flows so every check ends in a clear verdict with the reasons behind it, and turned fraud education into daily quizzes, levels and a leaderboard. Behind the screens, a Node, Express and MongoDB backend combines on-device pattern checks with Google Safe Browsing and Gemini.',
      features: [
        { title: 'URL fraud checker', text: 'Spots brand spoofing, shady domains, shortened links and risky files, then double-checks with Google Safe Browsing and Gemini for one clear risk score.' },
        { title: 'Message, number & call checks', text: 'Paste a text, look up a number or analyse a call to see the warning signs and why they matter.' },
        { title: 'AI safety assistant', text: 'A built-in Gemini chatbot to ask about anything that feels off.' },
        { title: 'Learn by playing', text: 'Daily quizzes, levels, quiz battles, coins, badges and a leaderboard.' },
        { title: 'Money tools', text: 'A budget manager plus SIP and EMI trackers.' },
        { title: 'Three languages', text: 'English, Hindi and Punjabi throughout.' }
      ],
      team: [
        ['Arpit Kumar', 'Lead developer'],
        ['Mehakpreet Kaur Cheema', 'UI/UX designer & frontend developer'],
        ['Bisman Kaur', 'Backend developer'],
        ['Ananya Sawhney', 'Frontend developer']
      ] },

    { title: 'CoffeeAura', tag: 'Website · Solo project', kind: 'web', year: '2025', role: 'Design & development',
      stack: 'HTML, CSS, JavaScript, Swiper.js',
      colors: ['#2b1a12', '#a26a42', '#f3e3cf', '#472F26'], image: 'images/coffeeaura/hero.jpg', video: '',
      // screenshots: the tile cycles through them; the case study shows them in a browser frame
      gallery: ['images/coffeeaura/hero.jpg', 'images/coffeeaura/origins.jpg', 'images/coffeeaura/benefits.jpg',
                'images/coffeeaura/types.jpg', 'images/coffeeaura/caffeine.jpg', 'images/coffeeaura/mood.jpg'],
      github: 'https://github.com/mehakcheema12/Coffee-Aura', link: 'https://coffeeaura.vercel.app',
      summary: 'A floating coffee experience: one interactive page that takes you from bean to cup, with origins, brew methods, a caffeine calculator, a mood-based coffee matcher and a quiz.',
      challenge: 'Most coffee websites stop at a menu. I wanted a page that feels like a slow morning at a café: warm, playful and full of small things to discover.',
      approach: 'I designed and hand-built it in HTML, CSS and JavaScript, pairing Playfair Display with Inter for an editorial café feel and using Swiper.js for the sliders. Each section is its own little experience, from coffee origins and coffee science to the journey from planting to brewing.',
      features: [
        { title: 'Caffeine calculator', text: 'Enter your cups for the day and see your caffeine status.' },
        { title: 'Mood & brew', text: 'Pick a mood and get a coffee match, with a quote and a song to go with it.' },
        { title: 'Weather brew', text: 'A coffee suggestion that fits the weather.' },
        { title: 'Brew methods', text: 'Pour over, French press and cold brew, each with ratios and steps in a pop-up.' },
        { title: 'Coffee quiz', text: 'Test what you’ve learned at the end of the journey.' }
      ] },

    { title: 'Quantum Key Forge', tag: 'Website · Solo project', kind: 'web', year: '2026', role: 'Design & development',
      stack: 'HTML, CSS, JavaScript · Python, Qiskit',
      colors: ['#1a1714', '#4b63ff', '#fbf0df', '#f7c948'], image: 'images/qkey/top.jpg', video: '',
      gallery: ['images/qkey/top.jpg', 'images/qkey/circuit.jpg', 'images/qkey/how.jpg', 'images/qkey/honest.jpg', 'images/qkey/code.jpg'],
      github: '', link: 'https://qkey.netlify.app/',
      summary: 'Six qubits walk into a password. A password generator where every character is one measurement of six simulated qubits in superposition, running entirely in your browser.',
      challenge: 'Quantum computing is easy to talk about and hard to picture. I wanted to take a tiny Qiskit script I wrote and turn it into something anyone could click and actually see working: qubits going into superposition, collapsing, and becoming a key.',
      approach: 'It started as quantumPassword.py, a Qiskit circuit that puts six qubits through Hadamard gates and measures them on the AerSimulator. I rebuilt that circuit in the browser with a playful, sticker-book lab look: an animated circuit shows every shot’s bitstring turning into a number and then a character, and an honest section explains what is truly quantum here and what is simulated.',
      features: [
        { title: 'The forge', text: 'Pick a length, press Measure, and get a fresh key with its strength in bits of entropy. Copy it in one click.' },
        { title: 'Live circuit', text: 'Watch six H gates and measurements collapse into a bitstring, a decimal and a character, shot by shot.' },
        { title: 'Three moves', text: 'Superpose, measure, map: the whole idea explained in three steps, with the 64-character set lighting up.' },
        { title: 'Secure-ish, explained', text: 'Nothing leaves the page, randomness comes from crypto.getRandomValues, and it says plainly that the qubits are simulated.' },
        { title: 'The original in Qiskit', text: 'The Python script behind it all, ready to run with Qiskit and the AerSimulator.' }
      ] }
  ]
};

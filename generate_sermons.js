const fs = require('fs');

const romansStructure = {
    'Chapter 1': [
        'Romans 1:1A', 'Romans 1:1B', 'Romans 1:1C', 'Romans 1:1D',
        'Romans 1:2A', 'Romans 1:2B', 'Romans 1:3-4', 'Romans 1:5',
        'Romans 1:6', 'Romans 1:7', 'Romans 1:8', 'Romans 1:9-12',
        'Romans 1:13-15', 'Romans 1:16', 'Romans 1:17', 'Romans 1:18A',
        'Romans 1:18B', 'Romans 1:19-32'
    ],
    'Chapter 2': [
        'Romans 2:1-5 (1)', 'Romans 2:1-5 (2)', 'Romans 2:1-5 (3)',
        'Romans 2:6-11', 'Romans 2:12-16', 'Romans 2:17-24', 'Romans 2:25-29'
    ],
    'Chapter 3': [
        'Romans 3:1-8', 'Romans 3:9-18', 'Romans 3:19-20', 'Romans 3:21-23',
        'Romans 3:24-26', 'Romans 3:27-31'
    ],
    'Chapter 4': [
        'Romans 4:1-5', 'Romans 4:4-5', 'Romans 4:6-8', 'Romans 4:9-12',
        'Romans 4:13-16', 'Romans 4:17-22', 'Romans 4:23-25', 'Romans 1-4 (1)',
        'Romans 1-4 (2)', 'Romans 1-4 (3)', 'Romans 1-4 (4)', 'Romans 1-4 (5)'
    ],
    'Chapter 5': [
        'Romans 5:1-2', 'Romans 5:3-4', 'Romans 5:3-5', 'Romans 5:6-11',
        'Romans 5:12-14 (1)', 'Romans 5:12-14 (2)', 'Romans 5:15-21'
    ],
    'Chapter 6': [
        'Romans 6:1-2', 'Romans 6:3-4', 'Romans 6:5-7', 'Romans 6:8-11',
        'Romans 6:12-14', 'Romans 6:15-18', 'Romans 6:19-21', 'Romans 6:22-23'
    ],
    'Chapter 7': [
        'Romans 7:1-6', 'Romans 7:7-8', 'Romans 7:9-12', 'Romans 7:13-14',
        'Romans 7:15-17', 'Romans 7:18-25'
    ],
    'Chapter 8': [
        'Romans 8:1', 'Romans 8:2-4', 'Romans 8:5-8', 'Romans 8:9-11',
        'Romans 8:12-13', 'Romans 8:14-17', 'Romans 8:18-22', 'Romans 8:23-25',
        'Romans 8:26-27', 'Romans 8:28', 'Romans 8:29', 'Romans 8:30',
        'Romans 8:31-33', 'Romans 8:34', 'Romans 8:35-39'
    ],
    'Chapter 9': [
        'Romans 9:1-5', 'Romans 9:6-9', 'Romans 9:10-13', 'Romans 9:14-16',
        'Romans 9:17-18', 'Romans 9:19-23', 'Romans 9:24-29', 'Romans 9:30-33'
    ],
    'Chapter 10': [
        'Romans 10:1-4', 'Romans 10:5-10', 'Romans 10:11-13', 'Romans 10:14-17',
        'Romans 10:18-21'
    ],
    'Chapter 11': [
        'Romans 11:1-6', 'Romans 11:7-10', 'Romans 11:11-12', 'Romans 11:13-15',
        'Romans 11:16-18', 'Romans 11:19-22', 'Romans 11:23-24', 'Romans 11:25-27',
        'Romans 11:28-32', 'Romans 11:33-35', 'Romans 11:36'
    ],
    'Chapter 12': [
        'Romans 12:1', 'Romans 12:2', 'Romans 12:3', 'Romans 12:4-5',
        'Romans 12:6', 'Romans 12:7', 'Romans 12:8A', 'Romans 12:8B',
        'Romans 12:9', 'Romans 12:10-11', 'Romans 12:12-13', 'Romans 12:14-15',
        'Romans 12:16-18', 'Romans 12:19-21'
    ],
    'Chapter 13': [
        'Romans 13:1', 'Romans 13:2-5', 'Romans 13:6-7', 'Romans 13:8-10',
        'Romans 13:11', 'Romans 13:12', 'Romans 13:13-14'
    ],
    'Chapter 14': [
        'Romans 14:1-3', 'Romans 14:4-6', 'Romans 14:7-9', 'Romans 14:10-12',
        'Romans 14:13-16', 'Romans 14:17', 'Romans 14:18-20A', 'Romans 14:20B-23'
    ],
    'Chapter 15': [
        'Romans 15:1-3', 'Romans 15:4', 'Romans 15:5-6', 'Romans 15:7-13',
        'Romans 15:14-15', 'Romans 15:16-18', 'Romans 15:19-21', 'Romans 15:22-29',
        'Romans 15:30-33'
    ],
    'Chapter 16': [
        'Romans 16:1-2', 'Romans 16:3-5A', 'Romans 16:5B-7', 'Romans 16:8-16',
        'Romans 16:17-18', 'Romans 16:19-20', 'Romans 16:21-24', 'Romans 16:25-27'
    ]
};

let html = `            <div class="sermon-accordion-container animate-on-scroll">
                
                <!-- LEVEL 1: ROMANS -->
                <button class="accordion-lvl-1">Exposition of Romans</button>
                <div class="panel-lvl-1">
`;

for (let chapter = 1; chapter <= 16; chapter++) {
    const chKey = 'Chapter ' + chapter;
    const sermons = romansStructure[chKey] || [];

    html += `                    <!-- Chapter ${chapter} -->
                    <button class="accordion-lvl-2">${chKey}</button>
                    <div class="panel-lvl-2">
                        <div class="sermon-list">
`;
    sermons.forEach(sermon => {
        html += `                            <div class="sermon-row">
                                <span class="sermon-title-text">${sermon}</span>
                                <button class="play-button small-play" aria-label="Play View" data-video=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></button>
                            </div>\n`;
    });

    html += `                        </div>
                    </div>
`;
}

html += `                </div>

                <!-- LEVEL 1: JOHN -->
                <button class="accordion-lvl-1">Exposition of John</button>
                <div class="panel-lvl-1">
                    <div class="sermon-list" style="padding: 1rem;">
                        <p style="color: var(--light-gray);">Placeholder for John sermons.</p>
                    </div>
                </div>

                <!-- LEVEL 1: TOPICAL SERMONS -->
                <button class="accordion-lvl-1">Topical Sermons</button>
                <div class="panel-lvl-1">
                    <div class="sermon-list" style="padding: 1rem;">
                        <p style="color: var(--light-gray);">Placeholder for Topical sermons.</p>
                    </div>
                </div>
            </div>`;

const targetFile = 'c:\\Users\\abditi\\.gemini\\antigravity\\scratch\\lole-main\\sermons.html';
const content = fs.readFileSync(targetFile, 'utf8');

// Regex to replace everything inside <section class="sermon-archive container"> ... </section>
const sectionRegex = /(<section class="sermon-archive container">)([\s\S]*?)(<\/section>\s*<!-- YouTube Video Modal -->)/i;

const newHTMLString = content.replace(sectionRegex, `$1\n${html}\n        $3`);

fs.writeFileSync(targetFile, newHTMLString, 'utf8');
console.log('Successfully injected accordion HTML into sermons.html');

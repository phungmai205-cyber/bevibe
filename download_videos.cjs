const fs = require('fs');
const path = require('path');

const videosToDownload = [
  // Dr. Bargo
  {
    brand: 'dr-bargo',
    productKey: 'drbargo-3', // Serum
    filename: 'drbargo_serum.mp4',
    id: '1Owy9JUN8ioYtgNE6p08sylrIihc2qsv6'
  },
  {
    brand: 'dr-bargo',
    productKey: 'drbargo-2', // Foam Cleansing
    filename: 'drbargo_cleanser.mp4',
    id: '11FN02-n0sD88whaT2FuEdsPOSyQ5Fcrm' // 6.08 MB version
  },
  {
    brand: 'dr-bargo',
    productKey: 'drbargo-1', // Emulsion
    filename: 'drbargo_emulsion.mp4',
    id: '1hjIlxsoQwpquhykGg8LnrpWVg6oDxXlm' // 6.00 MB
  },
  {
    brand: 'dr-bargo',
    productKey: 'drbargo-4', // Toner
    filename: 'drbargo_toner.mp4',
    id: '1UVbpBsy5BUL1wE8ZNjQWUl5GA1Ky0Oeg' // 6.01 MB
  },

  // Neuraderm
  {
    brand: 'neuraderm',
    productKey: 'neura-1', // Calming Foam Cleanser
    filename: 'neuraderm_cleanser.mp4',
    id: '1aiSAMN1RaATDpwZRcjqD8x2HLLtyYEHa' // 2.91 MB
  },
  {
    brand: 'neuraderm',
    productKey: 'neura-2', // Calming Mist
    filename: 'neuraderm_mist.mp4',
    id: '1OfyVFPNi3UT3layI_ffBsu3CoKRzKtdT' // 3.08 MB
  },
  {
    brand: 'neuraderm',
    productKey: 'neura-3', // Core Time Ampoule
    filename: 'neuraderm_ampoule.mp4',
    id: '1fHykXjGCSEPaxGqlsir6seL9InwkJXB-' // 4.30 MB
  },
  {
    brand: 'neuraderm',
    productKey: 'neura-4', // Deep Calming Mask / Cream Lifting Mask
    filename: 'neuraderm_mask.mp4',
    id: '1NP4W05pmgakIn7k2JiHsVijYNbFF62FW' // 4.73 MB
  },
  {
    brand: 'neuraderm',
    productKey: 'neura-5', // Intensive Suncream
    filename: 'neuraderm_suncream.mp4',
    id: '1LQUyXp2z_YLqMF192Aw2cZdgTGFMbV0O' // 2.86 MB
  },
  {
    brand: 'neuraderm',
    productKey: 'neura-6', // Neuro Lacto MD cream
    filename: 'neuraderm_md_cream.mp4',
    id: '1UNjmxeAdzpR41__eu4wvLhzNZAgVhHdi' // 4.04 MB
  },

  // Stem C
  {
    brand: 'stem-c',
    productKey: 'stemc-vid1',
    filename: 'stemc_video_1.mp4',
    id: '1rprZ5NzuWPasIfGy0s5EKgp3GmEcXfXz' // 3.43 MB
  },
  {
    brand: 'stem-c',
    productKey: 'stemc-vid2',
    filename: 'stemc_video_2.mp4',
    id: '1H_4t9Sjg6uKrWiR9BHIl_hNc51ZUSvo1' // 3.07 MB
  },
  {
    brand: 'stem-c',
    productKey: 'stemc-vid3',
    filename: 'stemc_video_3.mp4',
    id: '15fI4ak9d3Vt95TGcdmEdxwTKjV2TCWAn' // 3.11 MB
  }
];

async function downloadSingle(item) {
  const dir = path.join(__dirname, 'assets', 'videos', item.brand);
  fs.mkdirSync(dir, { recursive: true });
  const destPath = path.join(dir, item.filename);

  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10000) {
    console.log(`[SKIP] Already exists: ${destPath} (${(fs.statSync(destPath).size / 1024 / 1024).toFixed(2)} MB)`);
    return destPath;
  }

  console.log(`[DOWNLOADING] ${item.brand}/${item.filename} (ID: ${item.id})...`);
  const urls = [
    `https://drive.usercontent.google.com/download?id=${item.id}&export=download`,
    `https://drive.google.com/uc?export=download&id=${item.id}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength > 10000) {
          fs.writeFileSync(destPath, Buffer.from(buffer));
          console.log(`[SUCCESS] Saved ${destPath} (${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);
          return destPath;
        }
      }
    } catch (e) {
      console.error(`Attempt failed: ${e.message}`);
    }
  }
  console.error(`[FAILED] Could not download ${item.filename}`);
  return null;
}

async function run() {
  console.log(`Starting download of ${videosToDownload.length} videos...`);
  for (const item of videosToDownload) {
    await downloadSingle(item);
  }
  console.log('All downloads processed!');
}

run();

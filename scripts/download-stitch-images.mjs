import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const images = {
  'logo.png': 'https://lh3.googleusercontent.com/aida/ALJJyrASS3Rxnm6vmxlONwsNq1NGPCpDJG56unVd6FkGQBYO-wLrkQTKLy9BKFJjVUmpEejRZbDCvJMs_v-3I55mFBlEN0e64p6ErBF3K3mIOM2s2cR9_Hb-kqwaQt7R00rTDEetR-egVTv0QZpn_MWC4qY0WCPNBghsma0ph1wv5Yw2uULOg-GaTf3K0JXKcdZkfug3JnwKdujCry6awQ6nCFh3AzUJAI98062288lvem2kOQ',
  'hero-model.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHvdH-JIccSvkTJS8PAc4xWc3xqH-eZeYh5qmX1BapbCHFmd0JTf1JOGcce8Cy6pRY0QyAZOm5tTqX_ln4Q37Wcsw0mAYAB87vcepnlwkgJURIbZXD58BJD96862W3sQNjJS-oUxutiffrYxicJ1WqwdD405M4CBjYe1wjyWSXy8XHzOUxVbkTSTfY6hiiQesgOmLOKjtvSpCmpr6bbFIUN2jS1JxCiklptNiUoiX',
  'fabric-texture.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-_H4Zv2OKrscXi8cGeBRvIJAJ7FdCd4cvXVrLOteKznhnf0TNwA90woiEKOEjjxmuyc5gmLnkeGYSiSlo0ONQOBGoPfZyylSeqqc8fRqMrgPDVVnoFAnwJF-Dj6r5PvViSPGdvLkoasHhIrsFsEq5h3kJu3p5gzWaRWz2oV8DbzFYGD3oAOrM-4xAQo1lo-vWpBJI0qdqJhijBzMBW8Poj0qyMnDFg1W69sqRJPPX',
  'collection-oversized.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj98CZA6yFUvEesCBB8VWEEN6Q-y3vTM2Fag0zzdqfUY4u5_cmwp72C7BY9RtfcGyrDbw5yC_5-19R95KoC8rRJCSEkuvMSZ9928PrnZHJYXPzdTWfAJmGZrVQ2ZJTExGYdm0UYizqxPFbk7yT-wDCwxZAdUUqZ3WvQA3msjIi9mpDT5I48JkdCRrAMcK6GbPMIEJyE7h3eKbFRfwsJsio4OlAUJ0dEVcOwSVVCZpB',
  'collection-graphic.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvtBLMbty0QY0dnMYfGVrF35EhYo8e4ySef7z9ikfbW12u9z7hgbblq-C1l88cEY2rFO6R3gA7n_7M-cnUlQJq6Hgl038K0iE_aUdmeDBxEG4D2B0lyog-tmkg3z1rG-_0VRe4ZEkg4zc7yKtg_CI5WH8njdmkixPf8eWXhocj-GQuGQDWX2kL_MCrPjSGTWtf4Yqa5TrkN6XVOea8aRes4w0MzbmCase1KfjVy8HG',
  'collection-original.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUcs8CfN80ekY3K6qA6c3zSp4v1rrGDiLDvCZYs6mvNz9Wjaqhze7zUk5VbF8zUj7lkxCimdj5eOxbpwoLLJWV709B1HYMs_3_shUoVPjgvZnbsTo3SjR4aukgTGzfUvD8UqL1lfdk2i8_Ijy3f0lr8hZnBaf47Q9Q81Z_4ON__oUsOwy7m9ToYxNTnQvuBE8tFWSDrLgUMo7vQAxKdL0VRURtq868U8TEHTHMvzNM',
  'collection-drops.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFDFo_kKt6zOUIOC_TgZqqrvfRGvED0XZfoi9M5si2QD_XROm-oFaaDt01C4aSfvl9-bmufvlbbyChvs4e4xkjjbpEEFqJTTKDGiBgTCFkxZ_uA65NpcKTc2Vve9TBB4leK38NFKHsWhKCxGX8S4iU2g5dIhUkXfQqr6CHrL5jNtAH54eix9PEsMcskjMqff7zR_1UDUKGuq3acZbaY-YSL0O3HA04poJ0knN2ELoD',
  'product-1-front.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPs3q4MvxwloADvPcQ_l75NQZsnoT59kqUlsG1U9d_tZrsP3OiGyed_Pauho5qZ9CC95nnxhpPuXTIOK62pe2xeeespFK93fZ7AfNDMG1Hrz1ApdDe247wzctyiqqFFkzQbgCP9dd4Lnvz5E_G6JigJGCHqIs_l9QTYGP8l-_oILFFaJ1iFo1yfnQGwgfWe_IwOZTQszfHxGgPO6H54mEy_D-9x5N1L3-WMU_fTIQj',
  'product-1-back.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0V0fzajy0kXfg3D5M8owed_qHrXubC9i6MLGGKxkIjFejn-N2bPhS1vOoRPYbnfcwD-iv9TxD7KMhGWc0YeK_UpDIoaJbyFtx7Jw9nSnMvLmEvE_dSzzeEyb9mLTDb_fGGJAowxJy9_wbeb98j9AidODT8c6qAitX0wHPrnUuFTvIn7i0AR-b96qmtceJqw9QihxsqN8Qb2daCuXnuJii4Fo1TPl7DUYKV6Az7BL6',
  'product-2-front.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5fk1OVOLr0EM8AOi9aXKYPNkSo4wXvdQjPfOECDrbOTsZk5l8w7kY1tP3PCCFUJRWDT06kQQuvwKxubpfthYeysRtHmXKDLuFLlKSSL64QN40UtjlFgTiKQMCxbXvGAv1zoK9oxXfezM3EUdy6xAJ2QtoHPYW_x1duZvkb2DKVg7llq3TUDIdtPCjvCmeeTRZvb06w01Wr4UM42GEIxWuBNsq3KPJQhpZDpEibg04',
  'product-2-back.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLufhzMjK53V388n99tSTnA9VX_u5pEDf6m45ElN0Lxwun8mFDB_fulDaNR69SdFhEMpgRJO26EYLn2O4Nkqye0xVZqDBn42JBPp1EccGzybwUtF6Q15IbD59ZuDD_CzdnFiuywR2hAm-hHNTnFVVQOUFbG9dzwaz6UJ8fav78pa1aN2BS_IeTMrXP3rwCuO9_RSlzpCMvFDPv1-RessjbsYaJYZlw6IWpQN992cwh',
  'product-3-front.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxyyoaQqViLRu82suA5JQgK-JZjWmijl3dqYmTjiiApZfjCgZSirY5Rhu7eX5DxbORPQEUR6CHhcjbnoHLVBVRZx2sAbO4SeeSq2z3D0sMApCSdVysO6KcdSTgyPnyVPeBAc4n7VtJOXGJBxiD3-IabaskWTqcsnyoytRaLWpIRYxrKboqMoW9r3GQh0E5O10hnIWjWrlNChGFb85m21xWrhsyjG9HNnbynBUuMjSg',
  'product-3-back.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmRzTWywp-JEqWoep-LJQvoiSwhaa835m4poXL0-gLnvPLK7GLU2_BM6gybdbM0-8vcVDSbvkQcNDDsrOX_yMTnbGedQdmUw7o8QeMB74G-HzNdaUPew_B1_NoR8uwN4tCc7_QsHvJga3eV5zb_JivWqKicXcVvfDk_wQPfyctQUDRL0fazykBM7d7IE-e3Duse5oeDbh-BJsEBKGKP3_gau10RQoiXVORH_AWIyuq',
  'product-4-front.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpLxUfdUsibgbJBcgmaUsjnk7oVxgmcwSDTy8kU_08y32GKe7-i6kiBGYgqNzrC8Em4jz9lH_Fb0vIWv8yAVdknqN6-C91Grgp4K3GZ8X7ezM1hwvJfAOqTbYbrhdixJPcQUG8EvZlwPMHR4-QKW20FIXZAPJSyMrLhI9s7htCRLLXRvUnYa_KWIYkr09NA2fBmA1QvQNkLCQak-r7jq52iZBeTCMGhYK5H_1Z1h3',
  'product-4-back.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbIyGv1_YRmM6PfbHRq31ae5_c6muidbkaZfOX2FLutsRlCqcColPrCQ2prrxSuVCnh7r0l0Y4Kop_3-HipsemaJpC_1u2-OEpBWS-j4DALUKIX5yNK_aDqcpcE7DdpORtgYBn2yfB5KNMcDIzdyQrhR300ECCB8vViln9_yGVaijll9BMzFBPfK3BxdpClbRXndZE7JXNaVJmQLagPgAcNrWGNI2_3ro9Ou0hNvQ-',
  'custom-mockup.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhz3ok8ajWKx2r_kGso0tXwTjFKZiblgtWY_0f2lV1vhdvQxpR5qSD8c6xEJ8ZO39nLdgO3k7lV7T7a5sfd9wAdw9WBcCFEF7xPsOJrzLU45TVm4XLMZEHl2nXE5j8Xp7KGJRnICvJjR3BPjZlsi6NzWIcoJPpizZqfy7RMntr5KS1cjEWqsh4HEVKdlbQ2THkgR_fuBNiDsisVaBwz9XcdjkZbpyRhnVWcmhaarkB',
  'creator-1.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbicI0hDBg7oWk7fxPyqef_VQErloLPCoyjpMY-t5BVyAMQWQrQu3bLn6TDFom_jolusPhaY1apocP5w4Ggis6lArdG2YzLtQEKdHRqFzm0TnrvqSGzIiVa3j0RHmtvSI-TWkX7jbmiI-NM23LW3HIVsUoibaylq6EhbwWaC7yBy2cSNtZd6fHrYjhpptGgpMqwX30nSif0XDybQ0L193QOqUMh_3sT_sYo7B2kCn1',
  'creator-2.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpxA8wINjUbIi8EHAk0lW3ncJF_3b6gkGa8X0b_M01ke1dGUEeGj0Ny6SUWjZQcdOgXvraHu-niJqVw-Me3qTW6CmTjKPEnU6gEgJCnoH8XBe1ABCmnbaMPT9w2FmmrHhdh-gQ4xHWor_zjTIZwBnFBCxrPc16L8e8GPQHieqmq_THKHqKdu-ezpQLencdknOMS90ZkiH3WJ4OGwPHhw2VrH7akVWcwtIJI7IWtWbH',
  'creator-3.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3NL9quqCrNwHHy4JSivKMD3eq48lp7ls_9TE6s_sEq496HsVjQj0S9_8KJJwzT0tRFO6xmIikWMWdiMBaP4zlUfiARmvfwDUTSJOStUWxHGEIH2f2o6KFSRss096H5OFLC74tY3yMuaxCfUX2GU6qSHJLDBSbgUA--V27jk78noEJpfQHuA1Ywf9-_9PTvs8UuUcFCFGOPPo7wI7FSCqw2-pOdm8wq8bAELrVPm4-',
  'lookbook-hero.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcsTN47SLFu1OW8CrG-soiwuHpspCxIKMRyyjDtzcj9yBIFySWOPZ4afSoAOzrXdyp5lXQevc3-ALcaDKk8GoZGuaSxdRb7Bgyt6eW-Rf85jqVv5Soo0VVi4kaf0EIYycaaf05FvvNfbjYqjwKXH-V2iyoViDHFKgok8BcumpBRH70MbSP0YsLQly_yeZlb6RXTB2LvTVu3JfPYRvBxwDrBA2gVclX8kZFGG9H5I9-',
  'lookbook-detail.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGTSuzbP6myzsdEuy_2RNBTciS4TYmteHdd-z3qhYI135fMHnaBoyV-P81QA4juW0ouDwOJMRmaswZytvbFiZE-u6OYPZ76R9WfRl7F88SYGxGW3WJePewlM5rCswEhvUCdC1c3Kuh23BaY8hbVpHYU8CgTAHr31FI3x3NPTMnNcxragr5GtKL7mlWGekWDBk_TYll-JLAUJMxMLuceOqLR6kCNBStJ1LzShOCrPL9',
  'brand-studio.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpyj1heu6U2Dpz9fljFQjHwL2is0e180kQkdPEsXp18o-18ICrMiSa-QxFzs5nnhD0oJCESgsrhxpMzmV2crOdi0MS9_ln7cF7BQO7fhfIvZZxsBI5Ysdo_46tp-NwuppAtbea9HZ8_2CzmV9MX7RLN7Gk4jquzYCVZrAJ5f02W1sZ3yhPdVmfEpdIvBjRIXEL3GF86ah7nAWCwaAPRXzC9ALCf3yICajilR_RMeaz'
};

const targetDir = path.resolve('public', 'images', 'stitch');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(filename, url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(targetDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${Object.keys(images).length} assets into ${targetDir}...`);
  for (const [filename, url] of Object.entries(images)) {
    process.stdout.write(`Downloading ${filename}... `);
    try {
      await download(filename, url);
      console.log('DONE');
    } catch (e) {
      console.log('FAIL:', e.message);
    }
  }
  console.log('All image assets successfully downloaded!');
}

run();


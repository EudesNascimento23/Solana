// bulk-solana-wallet-generator.js

const fs = require('fs');
const readline = require('readline');
const solanaWeb3 = require('@solana/web3.js');

async function generateWallets(count) {
  const wallets = [];

  for (let i = 0; i < count; i++) {
    const keypair = solanaWeb3.Keypair.generate();

    wallets.push({
      publicKey: keypair.publicKey.toBase58(),
      secretKey: Buffer.from(keypair.secretKey).toString('hex'), // hex string of secret key
    });
  }

  return wallets;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('How many Solana wallets do you want to generate? ', async (answer) => {
    const count = parseInt(answer);
    if (isNaN(count) || count <= 0) {
      console.log('Please enter a valid positive number.');
      rl.close();
      return;
    }

    console.log(`Generating ${count} wallets...`);
    const wallets = await generateWallets(count);

    // Format output: publicKey,secretKey per line
    const output = wallets
      .map(w => `${w.publicKey},${w.secretKey}`)
      .join('\n');

    fs.writeFileSync('generated_wallets.txt', output);
    console.log(`Wallets saved to generated_wallets.txt`);

    rl.close();
  });
}

main();

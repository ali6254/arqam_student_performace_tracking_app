const bcrypt = require("bcryptjs");

async function main() {
  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  console.log("\nPassword:", password);
  console.log("Hash:", hash);
}

main().catch(console.error);

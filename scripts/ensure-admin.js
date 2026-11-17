const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin@123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@buildclothing.com" },
    update: { passwordHash: hash, role: "SUPER_ADMIN" },
    create: {
      email: "admin@buildclothing.com",
      name: "BUILD Admin",
      passwordHash: hash,
      role: "SUPER_ADMIN",
      phone: "+91 9876543210",
    },
  });
  console.log("Admin account:", admin.email, "Role:", admin.role);

  const suraj = await prisma.user.upsert({
    where: { email: "surajyadav67150@gmail.com" },
    update: { passwordHash: hash, role: "SUPER_ADMIN" },
    create: {
      email: "surajyadav67150@gmail.com",
      name: "Suraj Yadav",
      passwordHash: hash,
      role: "SUPER_ADMIN",
      phone: "+91 9876543210",
    },
  });
  console.log("Personal admin account:", suraj.email, "Role:", suraj.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

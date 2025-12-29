import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'poojyanthm@gmail.com';
    const newPassword = 'Poojum123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log(`✅ Password updated for ${user.email}`);
    console.log(`New Password: ${newPassword}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

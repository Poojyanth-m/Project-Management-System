import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@projectpulse.com';
    const password = 'Admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`🔍 Checking/Creating user: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
            // Optional: update name to ensure it matches specific expectations
            firstName: 'Admin',
            lastName: 'User'
        },
        create: {
            email,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.ADMIN,
            isActive: true
        },
    });

    console.log('✅ Admin user ensured successfully:');
    console.log({
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
    });
}

main()
    .catch((e) => {
        console.error('❌ Error creating admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

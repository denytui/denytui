import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import faker from 'faker';

const prisma = new PrismaClient();

// eslint-disable-next-line max-lines-per-function
async function main(): Promise<void> {
  // Delete all olds data
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();
  await prisma.message.deleteMany();

  const password = await bcrypt.hash('1234567', 12);

  // default user
  const usersDefault = [
    {
      username: 'user1',
      email: 'user1@yopmail.com',
      password,
      firstName: '1',
      lastName: 'user',
    },
    {
      username: 'admin1',
      email: 'admin1@yopmail.com',
      password,
      firstName: '1',
      lastName: 'admin',
    },
  ];
  await prisma.user.createMany({ data: usersDefault, skipDuplicates: true });

  const usersFake = [];
  for (let i = 0; i < 50; ++i) {
    usersFake.push({
      username: 'user' + Math.floor(1000000 * Math.random()),
      email: faker.internet.email(),
      password: password,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: Math.floor(100 * Math.random()),
    });
  }
  await prisma.user.createMany({ data: usersFake, skipDuplicates: true });
  // await Promise.all(usersFake.map((user) => prisma.user.create({ data: user })));
  console.log('50 users created');

  // -----------------------------------------------
  // Create groups & categories
  const groupData = [];
  const languages = [
    'Javascript',
    'TypeScript',
    'C#',
    'Python',
    'Ruby',
    'Golang',
    'Java',
    'Rust',
    'HTML-CSS',
  ];

  for (let i = 0; i < languages.length; ++i) {
    groupData.push({ name: 'Group ' + languages[i] });
  }

  const frameworks = [
    'Nodejs',
    'React',
    'Vue',
    'Angular',
    'Nestjs',
    'Nextjs',
    'Vitejs',
    'Bootstrap',
    'TailwindCSS',
    'RubyOnRails',
    'Python-Django',
    'Python-Flask',
    '.Net-core',
    'Deno',
    'Nuxtjs',
  ];
  for (let i = 0; i < frameworks.length; ++i) {
    groupData.push({ name: 'Group ' + languages[i] });
  }

  await prisma.group.createMany({ data: groupData, skipDuplicates: true });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

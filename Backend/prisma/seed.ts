import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  // Users
  const hashed = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "admin@publishing.com" },
    update: {},
    create: { name: "Admin", email: "admin@publishing.com", password: hashed },
  });

  // Publishers
  const gramedia = await prisma.publisher.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Gramedia Pustaka Utama",
      address: "Jakarta",
      email: "info@gramedia.com",
    },
  });
  const mizan = await prisma.publisher.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Mizan", address: "Bandung", email: "info@mizan.com" },
  });
  const bentang = await prisma.publisher.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Bentang Pustaka",
      address: "Yogyakarta",
      email: "info@bentang.com",
    },
  });
  const penguin = await prisma.publisher.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Penguin Books",
      address: "London, UK",
      email: "info@penguin.co.uk",
    },
  });
  const vintage = await prisma.publisher.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "Vintage Books",
      address: "New York, USA",
      email: "info@vintage.com",
    },
  });
  const gallimard = await prisma.publisher.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: "Gallimard",
      address: "Paris, France",
      email: "info@gallimard.fr",
    },
  });

  // Authors
  const pramoedya = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Pramoedya Ananta Toer",
      bio: "Sastrawan Indonesia terbesar, penulis Tetralogi Buru. Lahir di Blora, Jawa Tengah.",
      birthDate: new Date("1925-02-06"),
    },
  });
  const andrea = await prisma.author.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Andrea Hirata",
      bio: "Penulis asal Belitung, terkenal lewat novel Laskar Pelangi yang diterjemahkan ke puluhan bahasa.",
      birthDate: new Date("1967-10-24"),
    },
  });
  const dostoyevsky = await prisma.author.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Fyodor Dostoyevsky",
      bio: "Novelis Rusia abad ke-19, dikenal lewat eksplorasi mendalam tentang psikologi manusia dan moralitas.",
      birthDate: new Date("1821-11-11"),
    },
  });
  const camus = await prisma.author.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Albert Camus",
      bio: "Filsuf dan penulis Prancis-Aljazair, pelopor absurdisme. Meraih Nobel Sastra 1957.",
      birthDate: new Date("1913-11-07"),
    },
  });
  const kafka = await prisma.author.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "Franz Kafka",
      bio: "Penulis Bohemia berbahasa Jerman, karyanya menggambarkan alienasi dan birokrasi yang absurd.",
      birthDate: new Date("1883-07-03"),
    },
  });
  const nietzsche = await prisma.author.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: "Friedrich Nietzsche",
      bio: "Filsuf Jerman yang berpengaruh, terkenal dengan konsep Übermensch dan kritik terhadap moralitas.",
      birthDate: new Date("1844-10-15"),
    },
  });
  const sartre = await prisma.author.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: "Jean-Paul Sartre",
      bio: "Filsuf dan penulis Prancis, bapak eksistensialisme modern. Menolak Nobel Sastra 1964.",
      birthDate: new Date("1905-06-21"),
    },
  });
  const danbrown = await prisma.author.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: "Dan Brown",
      bio: "Penulis thriller Amerika, terkenal dengan seri Robert Langdon yang terjual lebih dari 200 juta kopi.",
      birthDate: new Date("1964-06-22"),
    },
  });
  const tolstoy = await prisma.author.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: "Leo Tolstoy",
      bio: "Novelis Rusia, dianggap salah satu penulis terbesar sepanjang masa lewat War and Peace dan Anna Karenina.",
      birthDate: new Date("1828-09-09"),
    },
  });
  const orwell = await prisma.author.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: "George Orwell",
      bio: "Penulis dan jurnalis Inggris, dikenal lewat kritik tajamnya terhadap totalitarianisme.",
      birthDate: new Date("1903-06-25"),
    },
  });

  // Books
  const books = [
    {
      isbn: "978-979-22-1234-5",
      title: "Bumi Manusia",
      genre: "Historical Fiction",
      synopsis:
        "Kisah Minke, pemuda Jawa terpelajar di era kolonial Belanda yang jatuh cinta pada Annelies.",
      publishedAt: new Date("1980-01-01"),
      authorId: pramoedya.id,
      publisherId: gramedia.id,
    },
    {
      isbn: "978-979-22-1235-2",
      title: "Anak Semua Bangsa",
      genre: "Historical Fiction",
      synopsis:
        "Kelanjutan Bumi Manusia, Minke menjelajahi Eropa dan memperluas pandangannya tentang kolonialisme.",
      publishedAt: new Date("1980-06-01"),
      authorId: pramoedya.id,
      publisherId: gramedia.id,
    },
    {
      isbn: "978-979-22-5678-9",
      title: "Laskar Pelangi",
      genre: "Drama",
      synopsis:
        "Kisah sepuluh anak Belitung yang berjuang meraih pendidikan di sekolah yang hampir roboh.",
      publishedAt: new Date("2005-09-26"),
      authorId: andrea.id,
      publisherId: bentang.id,
    },
    {
      isbn: "978-979-22-5679-6",
      title: "Sang Pemimpi",
      genre: "Drama",
      synopsis:
        "Ikal dan Arai bermimpi besar untuk kuliah di Eropa meski hidup dalam keterbatasan.",
      publishedAt: new Date("2006-01-01"),
      authorId: andrea.id,
      publisherId: bentang.id,
    },
    {
      isbn: "978-0-14-044913-6",
      title: "Crime and Punishment",
      genre: "Psychological Fiction",
      synopsis:
        "Raskolnikov, mahasiswa miskin St. Petersburg, membunuh seorang rentenir dan bergulat dengan rasa bersalah.",
      publishedAt: new Date("1866-01-01"),
      authorId: dostoyevsky.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-14-028035-8",
      title: "The Brothers Karamazov",
      genre: "Philosophical Fiction",
      synopsis:
        "Drama keluarga Karamazov yang membahas iman, keraguan, moralitas, dan pembunuhan sang ayah.",
      publishedAt: new Date("1880-01-01"),
      authorId: dostoyevsky.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-679-72020-1",
      title: "The Stranger",
      genre: "Philosophical Fiction",
      synopsis:
        "Meursault, pria yang tak mampu merasakan emosi konvensional, membunuh seseorang di bawah terik matahari Aljazair.",
      publishedAt: new Date("1942-01-01"),
      authorId: camus.id,
      publisherId: vintage.id,
    },
    {
      isbn: "978-0-679-73373-7",
      title: "The Plague",
      genre: "Philosophical Fiction",
      synopsis:
        "Wabah bubonic melanda kota Oran — sebuah alegori tentang pendudukan Nazi dan respons manusia terhadap absurditas.",
      publishedAt: new Date("1947-01-01"),
      authorId: camus.id,
      publisherId: vintage.id,
    },
    {
      isbn: "978-0-14-028044-0",
      title: "The Trial",
      genre: "Absurdist Fiction",
      synopsis:
        "Josef K tiba-tiba ditangkap tanpa tahu kesalahannya — kritik terhadap birokrasi dan sistem hukum yang tak masuk akal.",
      publishedAt: new Date("1925-01-01"),
      authorId: kafka.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-14-028700-5",
      title: "The Metamorphosis",
      genre: "Absurdist Fiction",
      synopsis:
        "Gregor Samsa terbangun dan mendapati dirinya telah berubah menjadi serangga raksasa.",
      publishedAt: new Date("1915-01-01"),
      authorId: kafka.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-14-044328-8",
      title: "Thus Spoke Zarathustra",
      genre: "Philosophy",
      synopsis:
        "Zarathustra turun dari gunung untuk mengajarkan konsep Übermensch dan kehendak untuk berkuasa.",
      publishedAt: new Date("1883-01-01"),
      authorId: nietzsche.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-679-72022-5",
      title: "Nausea",
      genre: "Philosophical Fiction",
      synopsis:
        "Antoine Roquentin mengalami krisis eksistensial di kota Bouville — perasaan mual terhadap keberadaan itu sendiri.",
      publishedAt: new Date("1938-01-01"),
      authorId: sartre.id,
      publisherId: gallimard.id,
    },
    {
      isbn: "978-0-307-47427-2",
      title: "The Da Vinci Code",
      genre: "Thriller",
      synopsis:
        "Robert Langdon memecahkan kode rahasia yang tersimpan dalam karya-karya Leonardo da Vinci.",
      publishedAt: new Date("2003-03-18"),
      authorId: danbrown.id,
      publisherId: vintage.id,
    },
    {
      isbn: "978-0-307-47428-9",
      title: "Inferno",
      genre: "Thriller",
      synopsis:
        "Langdon terbangun di Florence tanpa ingatan, mengejar misteri yang terinspirasi dari Dante's Inferno.",
      publishedAt: new Date("2013-05-14"),
      authorId: danbrown.id,
      publisherId: vintage.id,
    },
    {
      isbn: "978-0-14-028042-6",
      title: "Anna Karenina",
      genre: "Literary Fiction",
      synopsis:
        "Tragedi wanita bangsawan Rusia yang meninggalkan suami dan anaknya demi cinta terlarang.",
      publishedAt: new Date("1878-01-01"),
      authorId: tolstoy.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-14-103943-3",
      title: "Nineteen Eighty-Four",
      genre: "Dystopian Fiction",
      synopsis:
        "Winston Smith hidup di bawah rezim totaliter Oceania yang mengawasi setiap gerak warganya.",
      publishedAt: new Date("1949-06-08"),
      authorId: orwell.id,
      publisherId: penguin.id,
    },
    {
      isbn: "978-0-14-118776-1",
      title: "Animal Farm",
      genre: "Political Satire",
      synopsis:
        "Hewan-hewan di Manor Farm memberontak melawan manusia — alegori tajam terhadap revolusi Soviet.",
      publishedAt: new Date("1945-08-17"),
      authorId: orwell.id,
      publisherId: penguin.id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  console.log(`Done! ${books.length} buku, 10 penulis, 6 penerbit.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

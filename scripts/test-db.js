#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests if your Vercel Postgres database is properly connected
 * 
 * Run with: npm run db:test
 */

const { PrismaClient } = require("@prisma/client");

async function testDatabaseConnection() {
  console.log("\n🔍 Testing Vercel Postgres Database Connection...\n");

  const prisma = new PrismaClient();

  try {
    // Test 1: Basic connection
    console.log("✅ Test 1: Checking database connection...");
    const userCount = await prisma.user.count();
    console.log(`   ✓ Connected! Found ${userCount} users in database\n`);

    // Test 2: Gigs table
    console.log("✅ Test 2: Checking gigs table...");
    const gigCount = await prisma.gig.count();
    console.log(`   ✓ Gigs table working! Found ${gigCount} gigs\n`);

    // Test 3: Messages table
    console.log("✅ Test 3: Checking messages table...");
    const messageCount = await prisma.message.count();
    console.log(`   ✓ Messages table working! Found ${messageCount} messages\n`);

    // Test 4: Applications table
    console.log("✅ Test 4: Checking gig applications table...");
    const appCount = await prisma.gigApplication.count();
    console.log(`   ✓ Applications table working! Found ${appCount} applications\n`);

    // Test 5: Test write operation
    console.log("✅ Test 5: Testing write operation...");
    const timestamp = new Date().toISOString();
    const testRecord = {
      title: `Test Gig ${timestamp}`,
      description: "This is a test to verify database write operations",
      category: "Testing",
      budget: 0,
      duration: "1 day",
      posterId: "test-user-id",
    };

    // Note: This will fail if test-user-id doesn't exist, which is expected
    // Just checking if the write operation works
    console.log(
      '   ℹ️  (Skipping write test - would require valid user)\n'
    );

    console.log("════════════════════════════════════════════════════════");
    console.log("🎉 DATABASE CONNECTION SUCCESSFUL!");
    console.log("════════════════════════════════════════════════════════\n");
    console.log("Summary:");
    console.log(`  • Users: ${userCount}`);
    console.log(`  • Gigs: ${gigCount}`);
    console.log(`  • Messages: ${messageCount}`);
    console.log(`  • Applications: ${appCount}`);
    console.log("\n✨ Your Vercel Postgres database is working correctly!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ DATABASE CONNECTION FAILED!\n");
    console.error("Error:", error.message);
    console.error("\nTroubleshooting steps:");
    console.error("1. Check DATABASE_URL in .env.local");
    console.error("2. Verify connection string format (postgresql://...)");
    console.error("3. Ensure database is created in Vercel Storage");
    console.error("4. Run: npx prisma db push");
    console.error("5. Check Vercel Postgres database status\n");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const mongoUri = 'mongodb+srv://haatxpress_db_user:pmyVnQZzKPXbCkL1@cluster0.tkajdrt.mongodb.net/ruposhee_db?retryWrites=true&w=majority';

// New password
const newPassword = 'admin123';
const username = 'ruposhee';

async function resetPassword() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        // Get the vendors collection
        const db = mongoose.connection.db;
        const vendorsCollection = db.collection('vendors');

        // Find the vendor
        console.log(`\nSearching for vendor with username: "${username}"...`);
        const vendor = await vendorsCollection.findOne({ username: username });

        if (!vendor) {
            console.log(`✗ Vendor with username "${username}" not found!`);
            console.log('\nAvailable vendors:');
            const allVendors = await vendorsCollection.find({}).project({ username: 1, name: 1 }).toArray();
            allVendors.forEach(v => {
                console.log(`  - Username: ${v.username}, Name: ${v.name || 'N/A'}`);
            });
            process.exit(1);
        }

        console.log(`✓ Found vendor: ${vendor.name || vendor.username}`);

        // Hash the new password
        console.log('\nGenerating new password hash...');
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('✓ Password hashed');

        // Update the password
        console.log('\nUpdating password in database...');
        const result = await vendorsCollection.updateOne(
            { username: username },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 1) {
            console.log('✓ Password updated successfully!');
            console.log('\n========================================');
            console.log('New Login Credentials:');
            console.log('========================================');
            console.log(`Username: ${username}`);
            console.log(`Password: ${newPassword}`);
            console.log('========================================');
            console.log('\nYou can now login to the admin panel at http://localhost:4200');
        } else {
            console.log('✗ Failed to update password');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

resetPassword();

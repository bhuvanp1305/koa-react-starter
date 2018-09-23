const config = {
    server: {
        default: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        development: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        production: {
            port: 8080,
            setupData: false,
            dropDatabase: false
        }
    },
    mongo: {
        default: {
            dbname: 'koareact',
            url: 'mongodb://localhost/koareact',
            useMongoClient: true
        }
    },
    setup: {
        default: {
            superAdminUser: {
                email: 'superadmin@aripratech.com',
                password: 'superadmin@123'
            },
            adminUser: {
                email: 'admin@aripratech.com',
                password: 'admin@123'
            }
        }
    }
}

export default config
import bcrypt from 'bcryptjs'

const users = [
    {
        name: "Admin User",
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: "Mitesh",
        email: 'mitesh@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: "Anshul",
        email: 'anshul@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
]

export default users
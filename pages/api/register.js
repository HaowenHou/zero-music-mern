import { createRouter } from 'next-connect';
import bcrypt from 'bcryptjs';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

const apiRoute = createRouter();

apiRoute.post(async (req, res) => {
    await dbConnect();
    // console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            username,
            password: hashedPassword,
            avatar: req.file ? `/avatars/${req.file.filename}` : undefined,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default apiRoute.handler();

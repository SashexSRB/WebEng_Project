const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const loggedInLayout= '../views/layouts/logged_in';
const jwtSecret = process.env.JWT_SECRET;


//Check Login
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    const locals = {
        title: "NERVPost",
        description: "NERV's Official Homepage"
    }

    if(!token) {
        res.render('admin/reject_auth', { locals, localslayout: adminLayout });
    } 

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    } catch (error) {
        res.render('admin/reject_auth', { locals, layout: adminLayout });
    }
}


// GET Login Pages
router.get('/login', async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});


//POST Check Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const isPassValid = await bcrypt.compare(password, user.password);

        if(!isPassValid){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/');

        res.redirect('admin/');
    } catch (error) {
        console.log(error);
    }
});

//About Route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        const data  = await User.findById({_id: req.userId});
        console.log(data);

        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }

        res.render('profile', {locals, data, layout: loggedInLayout});
    } catch (error) {
        console.log(error);
    }
    
});


//GET Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }

        const data = await Post.find();
        res.render('admin/dashboard', { locals, data, layout: loggedInLayout });
    } catch (error) {
        console.log(error);
    }
});

//GET Create new post
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }

        const data = await Post.find();
        res.render('admin/add-post', { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

//POST Create new post
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/newUser', async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }
        res.render('admin/newUser', {
            locals, layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

//POST Register
router.post('/register', async (req, res) => {
    try {
        const { username, firstName, lastName, password} = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const randomSecurityInt = Math.floor(100000 + (Math.random() * 900000));
        console.log(randomSecurityInt);

        try {
            const user = await User.create({username, password: hashedPass, firstName, lastName, securityCode: randomSecurityInt, createdAt: Date.now()});
            res.status(201).json({message: 'User Created', user});
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({message: 'Internal Server Error'});
        }

    } catch (error) {
        console.log(error);
    }
});

//GET Reset Password
router.get('/passReset', async(req, res)=> {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }
        res.render('admin/passReset', {
            locals, layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/reqResetPass', async(req, res) => {
    const { username, securityCode, password } = req.body;
    try {
        const p_securityCode = parseInt(securityCode);
        const user = await User.findOne({ username });
        const hashedPass = await bcrypt.hash(password, 10);
        if(p_securityCode === user.securityCode) {
            user.updateOne({username: username}, {$set:{password: hashedPass}});
        } else {
            res.status(409).json({message: 'User doesnt exist'});
        }
    } catch (error) {
        console.log(error);
    }
})

//GET edit post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }
        const data = await Post.findOne({_id: req.params.id});

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});


//PUT edit post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});

//DELETE delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

// Log-Out
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;
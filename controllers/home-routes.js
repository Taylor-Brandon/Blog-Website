const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll();
        console.log(dbPostData);

        const posts = dbPostData.map((post) =>
            post.get({ plain: true })
        );

        

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    } 
    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
     res.redirect('/');
     return;
    }
    res.render('signup');
 });
 
 router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                    attributes: ['description', 'createdAt'],
                }
            ]
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this ID' });
            return;
        }

        const post = postData.get({ plain: true });

        res.render('post', {
            post, 
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


module.exports = router;


